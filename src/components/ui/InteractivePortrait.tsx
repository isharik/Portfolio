'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Dot = { x: number; y: number; size: number }

type Props = {
  src: string
  alt: string
}

/** A transparent portrait with a lightweight, cursor-reactive halftone layer. */
export default function InteractivePortrait({ src, alt }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const source = new window.Image()
    const pointer = { x: -1000, y: -1000, active: false }
    let dots: Dot[] = []
    let frame = 0

    const paint = (time: number) => {
      const bounds = canvas.getBoundingClientRect()
      const density = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(bounds.width * density)
      const height = Math.round(bounds.height * density)

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      context.setTransform(density, 0, 0, density, 0, 0)
      context.clearRect(0, 0, bounds.width, bounds.height)
      context.fillStyle = '#ffffff'
      context.globalAlpha = pointer.active ? 0.9 : 0.38

      for (const dot of dots) {
        const dx = dot.x - pointer.x
        const dy = dot.y - pointer.y
        const distance = Math.hypot(dx, dy)
        const radius = 72
        const force = pointer.active && distance < radius ? (1 - distance / radius) ** 2 : 0
        const nudge = force * 20
        const drift = force * Math.sin(time / 105 + dot.x * 0.18 + dot.y * 0.12) * 2.2
        const unitX = distance ? dx / distance : 1
        const unitY = distance ? dy / distance : 0

        context.beginPath()
        context.arc(dot.x + unitX * (nudge + drift), dot.y + unitY * (nudge + drift), dot.size + force * 0.8, 0, Math.PI * 2)
        context.fill()
      }

      frame = window.requestAnimationFrame(paint)
    }

    source.onload = () => {
      const sampler = document.createElement('canvas')
      sampler.width = source.naturalWidth
      sampler.height = source.naturalHeight
      const samplerContext = sampler.getContext('2d', { willReadFrequently: true })
      if (!samplerContext) return

      samplerContext.drawImage(source, 0, 0)
      const pixels = samplerContext.getImageData(0, 0, sampler.width, sampler.height).data
      const step = 11
      for (let y = 0; y < sampler.height; y += step) {
        for (let x = 0; x < sampler.width; x += step) {
          const index = (y * sampler.width + x) * 4
          const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3
          if (pixels[index + 3] > 170 && brightness > 190) {
            dots.push({ x: x / sampler.width, y: y / sampler.height, size: 0.55 + (brightness / 255) * 0.55 })
          }
        }
      }

      // Store normalized source points, then convert them to the current CSS size.
      dots = dots.map((dot) => ({ ...dot, x: dot.x * canvas.clientWidth, y: dot.y * canvas.clientHeight }))
      frame = window.requestAnimationFrame(paint)
    }
    source.src = src

    const move = (event: PointerEvent) => {
      if (reduce) return
      const bounds = canvas.getBoundingClientRect()
      // Re-scale source points when a responsive layout changes dimensions.
      if (bounds.width && bounds.height) {
        pointer.x = event.clientX - bounds.left
        pointer.y = event.clientY - bounds.top
        pointer.active = true
      }
    }
    const leave = () => {
      pointer.active = false
      pointer.x = -1000
      pointer.y = -1000
    }

    canvas.parentElement?.addEventListener('pointermove', move)
    canvas.parentElement?.addEventListener('pointerleave', leave)
    return () => {
      canvas.parentElement?.removeEventListener('pointermove', move)
      canvas.parentElement?.removeEventListener('pointerleave', leave)
      window.cancelAnimationFrame(frame)
    }
  }, [reduce, src])

  const handleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reduce) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    surfaceRef.current?.style.setProperty('transform', `rotateX(${-y * 11}deg) rotateY(${x * 11}deg) translateZ(14px) scale(1.02)`)
    cursorRef.current?.style.setProperty('transform', `translate(${event.clientX - box.left}px, ${event.clientY - box.top}px)`)
    cursorRef.current?.style.setProperty('opacity', '1')
  }

  const reset = () => {
    surfaceRef.current?.style.removeProperty('transform')
    cursorRef.current?.style.setProperty('opacity', '0')
  }

  return (
    <div className="portrait-stage">
      <button
        type="button"
        className="portrait-tilt portrait-large relative block h-60 w-56 cursor-pointer border-0 bg-transparent p-0 sm:h-72 sm:w-64"
        aria-label="Interactive profile portrait"
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onClick={(event) => {
          event.currentTarget.classList.remove('portrait-clicked')
          void event.currentTarget.offsetWidth
          event.currentTarget.classList.add('portrait-clicked')
        }}
      >
        <div ref={surfaceRef} className="portrait-surface relative h-full w-full">
          <Image src={src} alt={alt} fill priority sizes="(max-width: 640px) 224px, 256px" className="object-contain portrait-image" />
          <canvas ref={canvasRef} aria-hidden className="portrait-dots absolute inset-0 h-full w-full" />
          <span ref={cursorRef} aria-hidden className="portrait-dot-cursor" />
        </div>
      </button>
    </div>
  )
}
