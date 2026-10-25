"use client";

/**
 * CanvasText
 * ──────────
 * Headline rendered as a cloud of canvas particles. Glyphs are rasterized
 * offscreen, sampled into points, then assembled from both side edges into
 * the letterforms — with soft idle drift and
 * optional pointer magnetism after settle. Zero deps beyond React.
 *
 * Motion contract:
 * - Intro timeline moves particles from both side edges into the glyphs.
 * - rAF loop only while animating / drifting / pointer-active; stops when
 *   the lattice is locked (drift=0, no pointer) to save CPU.
 * - Intro positions are calculated once and interpolated directly per frame.
 *   Glyph sampling reads only the text bounding box.
 * - `prefers-reduced-motion` paints a static sampled glyph (no drift).
 * - Particles reassemble on text / size / density / scatter / replay changes.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CanvasTextProps {
  /** The string to rasterize into particles. */
  text: string;
  /** Fill color for particles. Defaults to currentColor. */
  color?: string;
  /** Particle diameter in CSS pixels. Default: 1.6. */
  particleSize?: number;
  /**
   * Sampling stride in source pixels (1 = densest). Higher = fewer particles.
   * Default: 2.
   */
  density?: number;
  /** Soft idle drift after settle, in CSS pixels. 0 = locked grid (default). */
  drift?: number;
  /** How far particles begin beyond the side edges, in CSS pixels. Default: 48. */
  scatter?: number;
  /** Initial side-entry portion of the intro, in seconds. Default: 1.0. */
  loadDuration?: number;
  /** Remaining assembly time after side entry, in seconds. Default: 1.4. */
  morphDuration?: number;
  /** Pointer attraction strength (0 = off). Default: 0.35. */
  magnetic?: number;
  /** Radius of pointer influence in CSS pixels. Default: 100. */
  magneticRadius?: number;
  /** Force the loop paused. When omitted, auto-pauses off-screen / hidden. */
  paused?: boolean;
  /** Run this one-shot intro even when the device requests reduced motion. */
  forceMotion?: boolean;
  /**
   * Bump to re-run the scatter → assemble intro without changing other props.
   * Useful for playground Replay controls.
   */
  replayKey?: string | number;
  /** Optional Tailwind class for sizing the host box. */
  className?: string;
  /** Font size in CSS pixels. Default: 64. */
  fontSize?: number;
  /** Font weight. Default: 600. */
  fontWeight?: number | string;
  /** Font family. Default: system UI sans. */
  fontFamily?: string;
}

type Particle = {
  homeX: number;
  homeY: number;
  /** Starting position beyond the left or right edge. */
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
};

type Engine = {
  particles: Particle[];
  width: number;
  height: number;
  dpr: number;
  /** Last dpr applied via setTransform — skip redundant transforms. */
  paintedDpr: number;
  color: string;
  particleSize: number;
  drift: number;
  magnetic: number;
  magneticRadius: number;
  /** Intro time that has actually been animated, excluding paused time. */
  introElapsed: number;
  /** Last rAF timestamp used to advance the intro timeline. */
  lastFrameTime: number;
  /** Total time for the side-to-text entrance. */
  introMs: number;
  pointer: { x: number; y: number; active: boolean };
  reducedMotion: boolean;
  /** True once intro finished and lattice is static (no drift / pointer). */
  idleLocked: boolean;
  ctx: CanvasRenderingContext2D;
};

const DEFAULT_FONT_FAMILY =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

/** Soft cap — denser samples are stride-skipped so mobile stays smooth. */
const MAX_PARTICLES = 2800;
const RESIZE_DEBOUNCE_MS = 80;

/**
 * Canvas-backed particle headline. Samples rasterized glyphs into points that
 * load as a spinning circle, then slowly resolve into letterforms.
 */
export function CanvasText({
  text,
  color,
  particleSize = 1.6,
  density = 2,
  drift = 0,
  scatter = 48,
  loadDuration = 1,
  morphDuration = 1.4,
  magnetic = 0.35,
  magneticRadius = 100,
  paused,
  forceMotion = false,
  replayKey,
  className,
  fontSize = 64,
  fontWeight = 600,
  fontFamily = DEFAULT_FONT_FAMILY,
}: CanvasTextProps) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const engineRef = React.useRef<Engine | null>(null);
  const offscreenRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number>(0);
  const resizeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const wrapRectRef = React.useRef<DOMRect | null>(null);
  const inViewRef = React.useRef(true);
  const pageVisibleRef = React.useRef(true);
  const pausedPropRef = React.useRef(paused);
  const colorPropRef = React.useRef(color);
  const kickLoopRef = React.useRef<((force?: boolean) => void) | null>(null);
  pausedPropRef.current = paused;
  colorPropRef.current = color;

  const safeDensity = Math.max(1, Math.round(density));
  const safeParticleSize = Math.max(0.6, particleSize);
  const safeDrift = Math.max(0, drift);
  const safeScatter = Math.max(12, scatter);
  const safeLoadDuration = Math.max(0.2, loadDuration);
  const safeMorphDuration = Math.max(0.2, morphDuration);
  const safeMagnetic = Math.max(0, magnetic);
  const safeMagneticRadius = Math.max(8, magneticRadius);

  const hostMinHeight = Math.max(
    120,
    Math.ceil(safeScatter * 2.35 + safeParticleSize * 4 + 32),
  );

  const liveRef = React.useRef({
    particleSize: safeParticleSize,
    drift: safeDrift,
    magnetic: safeMagnetic,
    magneticRadius: safeMagneticRadius,
  });
  liveRef.current = {
    particleSize: safeParticleSize,
    drift: safeDrift,
    magnetic: safeMagnetic,
    magneticRadius: safeMagneticRadius,
  };

  const rebuild = React.useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const cssW = Math.max(1, wrap.clientWidth);
    const cssH = Math.max(1, wrap.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cx = cssW / 2;
    const cy = cssH / 2;
    const pixelW = Math.max(1, Math.round(cssW * dpr));
    const pixelH = Math.max(1, Math.round(cssH * dpr));

    // Avoid resetting the bitmap (and flashing) when size is unchanged.
    if (canvas.width !== pixelW) canvas.width = pixelW;
    if (canvas.height !== pixelH) canvas.height = pixelH;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    // Reuse the existing 2d context when the canvas bitmaps were not reset.
    const prev = engineRef.current;
    const ctx =
      prev && prev.width === cssW && prev.height === cssH && prev.dpr === dpr
        ? prev.ctx
        : canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resolvedColor = resolveFillColor(wrap, colorPropRef.current);

    let off = offscreenRef.current;
    if (!off) {
      off = document.createElement("canvas");
      offscreenRef.current = off;
    }
    if (off.width !== pixelW) off.width = pixelW;
    if (off.height !== pixelH) off.height = pixelH;

    const octx = off.getContext("2d", { willReadFrequently: true });
    if (!octx) return;

    const baseFontSize = Math.max(12, fontSize);
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    octx.clearRect(0, 0, cssW, cssH);
    octx.fillStyle = "#ffffff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.font = `${fontWeight} ${baseFontSize}px ${fontFamily}`;
    const measuredWidth = octx.measureText(text || " ").width;
    const fitScale = Math.min(1, Math.max(0.42, (cssW - 24) / Math.max(1, measuredWidth)));
    const safeFontSize = Math.max(12, baseFontSize * fitScale);
    octx.font = `${fontWeight} ${safeFontSize}px ${fontFamily}`;
    octx.fillText(text || " ", cx, cy);

    // Read only the glyph bounding box — full-canvas getImageData is expensive.
    const metrics = octx.measureText(text || " ");
    const textW = Math.max(
      safeFontSize,
      (metrics.actualBoundingBoxLeft ?? 0) +
        (metrics.actualBoundingBoxRight ?? metrics.width / 2),
    );
    const textH = Math.max(
      safeFontSize,
      (metrics.actualBoundingBoxAscent ?? safeFontSize * 0.8) +
        (metrics.actualBoundingBoxDescent ?? safeFontSize * 0.25),
    );
    const pad = Math.ceil(safeFontSize * 0.35);
    const boxCssX = Math.max(0, Math.floor(cx - textW / 2 - pad));
    const boxCssY = Math.max(0, Math.floor(cy - textH / 2 - pad));
    const boxCssW = Math.min(cssW - boxCssX, Math.ceil(textW + pad * 2));
    const boxCssH = Math.min(cssH - boxCssY, Math.ceil(textH + pad * 2));
    const boxX = Math.floor(boxCssX * dpr);
    const boxY = Math.floor(boxCssY * dpr);
    const boxW = Math.max(1, Math.ceil(boxCssW * dpr));
    const boxH = Math.max(1, Math.ceil(boxCssH * dpr));

    const {
      data,
      width: dataW,
      height: dataH,
    } = octx.getImageData(boxX, boxY, boxW, boxH);
    let step = Math.max(1, Math.round(safeDensity * dpr));

    // Estimate sample count; widen stride if we'd blow the particle budget.
    const approx = Math.ceil(dataW / step) * Math.ceil(dataH / step) * 0.35; // denser inside glyph bbox
    if (approx > MAX_PARTICLES) {
      step = Math.max(
        step,
        Math.ceil(Math.sqrt((dataW * dataH * 0.35) / MAX_PARTICLES)),
      );
    }

    const particles: Particle[] = [];
    const invDpr = 1 / dpr;
    const originOffsetX = boxX * invDpr;
    const originOffsetY = boxY * invDpr;

    for (let y = 0; y < dataH; y += step) {
      const row = y * dataW;
      for (let x = 0; x < dataW; x += step) {
        if (data[(row + x) * 4 + 3] < 128) continue;
        const homeX = Math.round(originOffsetX + x * invDpr);
        const homeY = Math.round(originOffsetY + y * invDpr);
        particles.push({
          homeX,
          homeY,
          originX: homeX,
          originY: homeY,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          seed: 0,
        });
        if (particles.length >= MAX_PARTICLES) break;
      }
      if (particles.length >= MAX_PARTICLES) break;
    }

    const sideSpread = Math.min(220, Math.max(safeScatter, cssW * 0.28));
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!;
      const seed = Math.random();
      const spread = sideSpread * (0.62 + seed * 0.58);
      const fromLeft = p.homeX < cx;
      p.originX = fromLeft ? -spread : cssW + spread;
      p.originY = Math.max(0, Math.min(cssH, p.homeY + (seed - 0.5) * safeScatter * 1.4));
      p.x = p.originX;
      p.y = p.originY;
      p.seed = seed * 1000;
    }

    const reducedMotion = !forceMotion && window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        p.x = p.homeX;
        p.y = p.homeY;
        p.originX = p.homeX;
        p.originY = p.homeY;
      }
    }

    const prevPointer = prev?.pointer ?? {
      x: cx,
      y: cy,
      active: false,
    };

    const live = liveRef.current;
    const now = performance.now();
    engineRef.current = {
      particles,
      width: cssW,
      height: cssH,
      dpr,
      paintedDpr: -1,
      color: resolvedColor,
      particleSize: live.particleSize,
      drift: live.drift,
      magnetic: live.magnetic,
      magneticRadius: live.magneticRadius,
      introElapsed: 0,
      lastFrameTime: now,
      introMs: (safeLoadDuration + safeMorphDuration) * 1000,
      pointer: prevPointer,
      reducedMotion,
      idleLocked: reducedMotion,
      ctx,
    };

    wrapRectRef.current = wrap.getBoundingClientRect();
    paintFrame(engineRef.current);
    // Force the loop awake for the new intro (even if a prior run had idle-locked).
    kickLoopRef.current?.(true);
  }, [
    text,
    fontSize,
    fontWeight,
    fontFamily,
    safeDensity,
    safeScatter,
    safeLoadDuration,
    safeMorphDuration,
    replayKey,
    forceMotion,
  ]);

  const syncFillColor = React.useCallback(() => {
    const wrap = wrapRef.current;
    const engine = engineRef.current;
    if (!wrap || !engine) return;
    const next = resolveFillColor(wrap, colorPropRef.current);
    if (next === engine.color) return;
    engine.color = next;
    paintFrame(engine);
  }, []);

  React.useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.particleSize = safeParticleSize;
    engine.drift = safeDrift;
    engine.magnetic = safeMagnetic;
    engine.magneticRadius = safeMagneticRadius;
    if (safeMagnetic <= 0) {
      engine.pointer.active = false;
    }
    // Drift coming online must wake a stopped idle loop.
    if (engine.idleLocked && safeDrift > 0) {
      kickLoopRef.current?.(true);
    }
    paintFrame(engine);
  }, [safeParticleSize, safeDrift, safeMagnetic, safeMagneticRadius]);

  React.useEffect(() => {
    rebuild();

    const wrap = wrapRef.current;
    if (!wrap) return;

    const scheduleRebuild = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        resizeTimerRef.current = null;
        wrapRectRef.current = wrap.getBoundingClientRect();
        rebuild();
      }, RESIZE_DEBOUNCE_MS);
    };

    const ro = new ResizeObserver(scheduleRebuild);
    ro.observe(wrap);

    const mo = new MutationObserver(() => syncFillColor());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      ro.disconnect();
      mo.disconnect();
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [rebuild, syncFillColor]);

  React.useEffect(() => {
    syncFillColor();
  }, [color, syncFillColor]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let running = false;

    const shouldRun = () => {
      const engine = engineRef.current;
      if (!engine || engine.reducedMotion) return false;
      if (pausedPropRef.current === true) return false;
      if (engine.idleLocked) return false;
      if (pausedPropRef.current === false) return true;
      return inViewRef.current && pageVisibleRef.current;
    };

    const tick = (now: number) => {
      const engine = engineRef.current;
      if (!engine || !shouldRun()) {
        running = false;
        if (engine) paintFrame(engine);
        return;
      }

      const stillAnimating = stepParticles(engine, now);
      paintFrame(engine);

      if (!stillAnimating && engine.drift <= 0 && !engine.pointer.active) {
        engine.idleLocked = true;
        running = false;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const ensureLoop = (force = false) => {
      const engine = engineRef.current;
      if (!engine || engine.reducedMotion) return;
      if (pausedPropRef.current === true) return;

      if (force) engine.idleLocked = false;

      // Locked lattice with no drift / pointer — stay asleep.
      if (engine.idleLocked && engine.drift <= 0 && !engine.pointer.active) {
        return;
      }

      if (
        pausedPropRef.current !== false &&
        !(inViewRef.current && pageVisibleRef.current)
      ) {
        return;
      }

      if (running) return;
      engine.idleLocked = false;
      engine.lastFrameTime = performance.now();
      running = true;
      rafRef.current = requestAnimationFrame(tick);
    };
    kickLoopRef.current = ensureLoop;

    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries.some((e) => e.isIntersecting);
        if (inViewRef.current) ensureLoop();
      },
      { threshold: 0.01 },
    );
    io.observe(wrap);

    const onVisibility = () => {
      pageVisibleRef.current = document.visibilityState !== "hidden";
      if (pageVisibleRef.current) ensureLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    pageVisibleRef.current = document.visibilityState !== "hidden";

    ensureLoop();

    return () => {
      running = false;
      kickLoopRef.current = null;
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused]);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || safeMagnetic <= 0) return;

    const onMove = (event: PointerEvent) => {
      const engine = engineRef.current;
      if (!engine || engine.magnetic <= 0) return;
      const rect = wrap.getBoundingClientRect();
      wrapRectRef.current = rect;
      engine.pointer.x = event.clientX - rect.left;
      engine.pointer.y = event.clientY - rect.top;
      engine.pointer.active = true;
      if (engine.idleLocked) {
        kickLoopRef.current?.(true);
      }
    };

    const onLeave = () => {
      const engine = engineRef.current;
      if (!engine) return;
      engine.pointer.active = false;
      // Snap back to the locked lattice when magnetism releases.
      if (engine.drift <= 0) {
        const ps = engine.particles;
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i]!;
          p.x = p.homeX;
          p.y = p.homeY;
          p.vx = 0;
          p.vy = 0;
        }
        engine.idleLocked = true;
        paintFrame(engine);
      }
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointercancel", onLeave);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointercancel", onLeave);
    };
  }, [safeMagnetic]);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative w-full max-w-3xl",
        className,
      )}
      style={{ minHeight: hostMinHeight }}
      aria-label={text}
      role="img"
    >
      <span className="sr-only">{text}</span>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full [transform:translateZ(0)]"
        aria-hidden
      />
    </div>
  );
}

function resolveFillColor(wrap: HTMLElement, color?: string): string {
  const wrapStyle = getComputedStyle(wrap);
  const rootStyle = getComputedStyle(document.documentElement);
  const resolveVariable = (value: string, depth = 0): string => {
    if (depth > 3) return "";
    const match = value.trim().match(/^var\(\s*(--[\w-]+)/);
    if (!match) return value.trim();
    const resolved = rootStyle.getPropertyValue(match[1]!).trim();
    return resolved ? resolveVariable(resolved, depth + 1) : "";
  };

  const explicit = color?.trim() || wrapStyle.getPropertyValue("--wensity-canvas-text").trim();
  if (explicit) {
    const resolved = resolveVariable(explicit);
    if (resolved) return resolved;
  }

  const foreground = resolveVariable(rootStyle.getPropertyValue("--fg").trim());
  if (foreground) return foreground;

  const inherited = wrapStyle.color;
  if (inherited && inherited !== "rgba(0, 0, 0, 0)") return inherited;

  return document.documentElement.classList.contains("dark")
    ? "#ffffff"
    : "#09090b";
}

/** Gentle acceleration and settling for the side-to-text particle flow. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

/**
 * Advance particle simulation. Returns `true` while the intro is still
 * running (caller should keep rAF alive).
 */
function stepParticles(engine: Engine, now: number): boolean {
  const {
    particles,
    drift,
    magnetic,
    magneticRadius,
    pointer,
    introMs,
  } = engine;

  const elapsed = Math.max(
    0,
    engine.introElapsed + Math.max(0, now - engine.lastFrameTime),
  );
  engine.introElapsed = elapsed;
  engine.lastFrameTime = now;
  const pointerLive = pointer.active && magnetic > 0;
  const len = particles.length;

  // Intro — particles stream in from both outer edges and settle into glyphs.
  if (elapsed < introMs) {
    const raw = Math.min(1, elapsed / Math.max(1, introMs));

    for (let i = 0; i < len; i++) {
      const p = particles[i]!;
      // A small per-particle delay creates a natural inward wave from both sides.
      const stagger = (p.seed % 1000) / 1000 * 0.075;
      const delayed = Math.min(
        1,
        Math.max(0, (raw - stagger) / (1 - stagger)),
      );
      const u = easeInOutCubic(delayed);

      if (u >= 0.995) {
        p.x = p.homeX;
        p.y = p.homeY;
        p.vx = 0;
        p.vy = 0;
        continue;
      }

      p.x = p.originX + (p.homeX - p.originX) * u;
      p.y = p.originY + (p.homeY - p.originY) * u;
      p.vx = 0;
      p.vy = 0;
    }
    return true;
  }

  // Phase 3 — settled lattice.
  if (!pointerLive && drift <= 0) {
    for (let i = 0; i < len; i++) {
      const p = particles[i]!;
      p.x = p.homeX;
      p.y = p.homeY;
      p.vx = 0;
      p.vy = 0;
    }
    return false;
  }

  const radiusSq = magneticRadius * magneticRadius;

  for (let i = 0; i < len; i++) {
    const p = particles[i]!;
    let targetX = p.homeX;
    let targetY = p.homeY;

    if (drift > 0) {
      targetX += Math.sin(now * 0.0012 + p.seed) * drift;
      targetY += Math.cos(now * 0.0015 + p.seed * 1.3) * drift;
    }

    if (pointerLive) {
      const dx = p.homeX - pointer.x;
      const dy = p.homeY - pointer.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < radiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const falloff = 1 - dist / magneticRadius;
        const push = magnetic * falloff * falloff * 28;
        targetX += (dx / dist) * push;
        targetY += (dy / dist) * push;
      }
    }

    p.vx = (p.vx + (targetX - p.x) * 0.22) * 0.76;
    p.vy = (p.vy + (targetY - p.y) * 0.22) * 0.76;
    p.x += p.vx;
    p.y += p.vy;
  }

  return true;
}

/** Paint particles as axis-aligned squares — indistinguishable from discs at ~1–3px, far cheaper than arc(). */
function paintFrame(engine: Engine) {
  const { ctx, dpr, particles, color, particleSize, width, height } = engine;
  if (engine.paintedDpr !== dpr) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    engine.paintedDpr = dpr;
  }
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;

  const size = particleSize;
  const half = size * 0.5;
  const len = particles.length;
  // Single path + one fill beats N beginPath/fill pairs.
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const p = particles[i]!;
    ctx.rect(p.x - half, p.y - half, size, size);
  }
  ctx.fill();
}

export default CanvasText;
