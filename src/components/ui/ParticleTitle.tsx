'use client'

import { useEffect, useRef, useState } from 'react'

type Props = { lead: string; accent: string }
type Dot = { x: number; y: number; sx: number; sy: number; alpha: number; radius: number; accent: boolean; delay: number }

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const ASSEMBLY_DURATION = 1560

export default function ParticleTitle({ lead, accent }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasReady, setCanvasReady] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!wrap || !canvas || !ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let dots: Dot[] = []
    let frame = 0
    let startTime = 0
    let width = 0
    let height = 0
    let lastWidth = 0
    let lastHeight = 0
    let dpr = 1
    let finished = false
    let started = false
    let welcomeComplete = false

    const paint = (progress: number) => {
      ctx.clearRect(0, 0, width, height)
      const styles = getComputedStyle(document.documentElement)
      const ink = styles.getPropertyValue('--fg').trim() || '#16161a'
      const highlight = styles.getPropertyValue('--accent').trim() || '#5b5bd6'
      for (const dot of dots) {
        const t = clamp((progress - dot.delay * 0.2) / 0.8)
        const eased = 1 - Math.pow(1 - t, 3)
        const x = dot.sx + (dot.x - dot.sx) * eased
        const y = dot.sy + (dot.y - dot.sy) * eased
        ctx.globalAlpha = dot.alpha * (0.35 + 0.65 * eased)
        ctx.fillStyle = dot.accent ? highlight : ink
        ctx.beginPath()
        ctx.arc(x, y, dot.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const animate = (now: number) => {
      frame = 0
      const progress = clamp((now - startTime) / ASSEMBLY_DURATION)
      paint(progress)
      if (progress < 1 && !document.hidden) frame = requestAnimationFrame(animate)
      else {
        finished = true
        paint(1)
      }
    }

    const drawTitle = (animateOnce: boolean) => {
      const nextWidth = wrap.clientWidth
      const nextHeight = wrap.clientHeight
      if (dots.length && nextWidth === lastWidth && nextHeight === lastHeight) return
      width = nextWidth
      height = nextHeight
      if (!width || !height) return
      lastWidth = width
      lastHeight = height
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const mask = document.createElement('canvas')
      mask.width = canvas.width
      mask.height = canvas.height
      const maskCtx = mask.getContext('2d', { willReadFrequently: true })
      if (!maskCtx) return
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      maskCtx.textAlign = 'left'
      maskCtx.textBaseline = 'middle'
      const textAlign = getComputedStyle(wrap).textAlign
      const fontSize = Math.min(58, Math.max(36, width * 0.08))
      const font = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim() || 'system-ui'
      maskCtx.font = `600 ${fontSize}px ${font}, sans-serif`
      const leadWidth = maskCtx.measureText(`${lead} `).width
      const accentWidth = maskCtx.measureText(accent).width
      const oneLine = leadWidth + accentWidth <= width - 20
      const lines = oneLine ? 1 : 2
      const lineHeight = fontSize * 1.12
      if (oneLine) {
        const left = textAlign === 'left' ? 0 : (width - leadWidth - accentWidth) / 2
        maskCtx.fillStyle = '#000000'
        maskCtx.fillText(`${lead} `, left, height / 2)
        maskCtx.fillStyle = '#ffffff'
        maskCtx.fillText(accent, left + leadWidth, height / 2)
      } else {
        maskCtx.textAlign = textAlign === 'left' ? 'left' : 'center'
        maskCtx.fillStyle = '#000000'
        maskCtx.fillText(lead, textAlign === 'left' ? 0 : width / 2, height / 2 - lineHeight / 2)
        maskCtx.fillStyle = '#ffffff'
        maskCtx.fillText(accent, textAlign === 'left' ? 0 : width / 2, height / 2 + lineHeight / 2)
      }

      const pixels = maskCtx.getImageData(0, 0, mask.width, mask.height).data
      let sampleStep = Math.max(2, Math.round(2.8 * dpr))
      const points: Array<{ x: number; y: number; alpha: number; accent: boolean }> = []
      const sample = () => {
        points.length = 0
        for (let y = 0; y < mask.height; y += sampleStep) {
          for (let x = 0; x < mask.width; x += sampleStep) {
            const index = (y * mask.width + x) * 4
            const alpha = pixels[index + 3] / 255
            if (alpha > 0.18) points.push({ x: (x + sampleStep / 2) / dpr, y: (y + sampleStep / 2) / dpr, alpha, accent: pixels[index] > 127 })
          }
        }
      }
      sample()
      while (points.length > 1800) { sampleStep += 1; sample() }

      let seed = 8341
      const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
      dots = points.map((point) => {
        const direction = random() < 0.5 ? -1 : 1
        const distance = 34 + random() * Math.min(180, width * 0.3)
        return {
          ...point,
          sx: direction < 0 ? -distance : width + distance,
          sy: point.y + (random() - 0.5) * Math.min(100, height * 0.7),
          radius: 0.8 + random() * 0.62,
          delay: random(),
        }
      })
      setCanvasReady(true)
      if (animateOnce && !reducedMotion.matches && !document.hidden && !finished) {
        started = true
        startTime = performance.now()
        frame = requestAnimationFrame(animate)
      } else if (reducedMotion.matches || finished) {
        finished = true
        paint(1)
      } else {
        paint(0)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      const wasAnimating = started && !finished
      const progress = wasAnimating ? clamp((performance.now() - startTime) / ASSEMBLY_DURATION) : 0
      const shouldAnimate = !started && !finished && !reducedMotion.matches
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      drawTitle(shouldAnimate)
      if (wasAnimating && !reducedMotion.matches && !finished) {
        startTime = performance.now() - progress * ASSEMBLY_DURATION
        paint(progress)
        frame = requestAnimationFrame(animate)
      }
    })
    resizeObserver.observe(wrap)

    const startWhenVisible = () => {
      if (started || finished || !welcomeComplete) return
      if (reducedMotion.matches) { drawTitle(false); return }
      if (document.hidden) return
      started = true
      startTime = performance.now()
      frame = requestAnimationFrame(animate)
    }
    drawTitle(false)
    const onWelcomeComplete = () => {
      welcomeComplete = true
      startWhenVisible()
    }
    window.addEventListener('portfolio:welcome-complete', onWelcomeComplete)
    // The first draw establishes the scattered dots; reveal them when the heading enters view.
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startWhenVisible()
    }, { threshold: 0.15 })
    visibility.observe(wrap)
    const themeObserver = new MutationObserver(() => paint(finished ? 1 : clamp((performance.now() - startTime) / ASSEMBLY_DURATION)))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const onVisible = () => {
      if (document.hidden) return
      if (!started && !finished) startWhenVisible()
      else if (started && !finished && !frame) frame = requestAnimationFrame(animate)
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      visibility.disconnect()
      themeObserver.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('portfolio:welcome-complete', onWelcomeComplete)
    }
  }, [accent, lead])

  return (
    <div ref={wrapRef} className={`particle-title${canvasReady ? ' is-ready' : ''}`}>
      <canvas ref={canvasRef} className="particle-title-canvas" aria-hidden="true" />
      <h1 className="particle-title-semantic">
        {lead} <span>{accent}</span>
      </h1>
    </div>
  )
}
