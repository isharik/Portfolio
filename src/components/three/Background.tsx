'use client'
import { useEffect, useRef } from 'react'

/**
 * Ambient background: fine grid + a cursor-following spotlight + two slow
 * aurora blobs. CSS-driven and lightweight — no render loop, no WebGL.
 * The spotlight only tracks the pointer on fine-pointer (desktop) devices
 * and is disabled under prefers-reduced-motion.
 */
export default function Background() {
  const spotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = spotRef.current
    if (!el) return
    const R = 460 // half of the 920px spot box; centers the gradient on the point
    const place = (x: number, y: number) => {
      el.style.transform = `translate3d(${x - R}px, ${y - R}px, 0)`
    }

    // Match the old default resting position (≈ 50% / 30%)
    place(window.innerWidth / 2, window.innerHeight * 0.3)

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    let raf = 0
    let px = 0
    let py = 0
    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        place(px, py) // transform-only update: no repaint
        raf = 0
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-bg" />

      {/* aurora blobs */}
      <div
        className="bg-aurora left-[-10%] top-[-15%] h-[55vh] w-[55vh]"
        style={{ background: 'radial-gradient(circle, var(--aurora-1), transparent 65%)', animation: 'drift-a 22s ease-in-out infinite' }}
      />
      <div
        className="bg-aurora right-[-12%] top-[10%] h-[50vh] w-[50vh]"
        style={{ background: 'radial-gradient(circle, var(--aurora-2), transparent 65%)', animation: 'drift-b 26s ease-in-out infinite' }}
      />

      {/* fine grid, masked to fade toward the bottom */}
      <div className="bg-grid absolute inset-0" />

      {/* cursor spotlight: pre-painted gradient moved by transform only */}
      <div ref={spotRef} className="bg-spot" />

      {/* legibility vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 30%, transparent 45%, var(--bg) 92%)' }}
      />
    </div>
  )
}
