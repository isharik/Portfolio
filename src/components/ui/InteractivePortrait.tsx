'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Dot = { u: number; v: number; size: number; phase: number }

type Props = {
  src: string
  alt: string
}

/** A transparent portrait whose sampled halftone dots scatter around the pointer. */
export default function InteractivePortrait({ src, alt }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const target = buttonRef.current
    if (!canvas || !target) return
    const context = canvas.getContext('2d')
    if (!context) return

    const source = new window.Image()
    const pointer = { x: -1000, y: -1000, active: false }
    let dots: Dot[] = []
    let frame = 0

    const paint = (time: number) => {
      const bounds = target.getBoundingClientRect()
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
      context.globalAlpha = pointer.active ? 0.96 : 0.54

      for (const dot of dots) {
        const x = dot.u * bounds.width
        const y = dot.v * bounds.height
        const dx = x - pointer.x
        const dy = y - pointer.y
        const distance = Math.hypot(dx, dy)
        const radius = 92
        const force = pointer.active && distance < radius ? (1 - distance / radius) ** 1.8 : 0
        const unitX = distance ? dx / distance : 1
        const unitY = distance ? dy / distance : 0
        const ripple = force * Math.sin(time / 92 + dot.phase) * 4
        const radial = force * 25 + ripple
        const orbit = force * Math.sin(time / 145 + dot.phase) * 9

        context.beginPath()
        context.arc(
          x + unitX * radial - unitY * orbit,
          y + unitY * radial + unitX * orbit,
          dot.size + force * 0.95,
          0,
          Math.PI * 2
        )
        context.fill()
      }
      frame = window.requestAnimationFrame(paint)
    }

    source.onload = () => {
      const sampleWidth = 216
      const sampleHeight = Math.round((source.naturalHeight / source.naturalWidth) * sampleWidth)
      const sampler = document.createElement('canvas')
      sampler.width = sampleWidth
      sampler.height = sampleHeight
      const samplerContext = sampler.getContext('2d', { willReadFrequently: true })
      if (!samplerContext) return
      samplerContext.drawImage(source, 0, 0, sampleWidth, sampleHeight)
      const pixels = samplerContext.getImageData(0, 0, sampleWidth, sampleHeight).data
      const step = 4

      for (let y = 0; y < sampleHeight; y += step) {
        for (let x = 0; x < sampleWidth; x += step) {
          let brightest = 0
          let alpha = 0
          for (let yy = y; yy < Math.min(y + step, sampleHeight); yy += 1) {
            for (let xx = x; xx < Math.min(x + step, sampleWidth); xx += 1) {
              const index = (yy * sampleWidth + xx) * 4
              const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3
              brightest = Math.max(brightest, brightness)
              alpha = Math.max(alpha, pixels[index + 3])
            }
          }
          if (alpha > 150 && brightest > 155) {
            dots.push({
              u: (x + step / 2) / sampleWidth,
              v: (y + step / 2) / sampleHeight,
              size: 0.45 + (brightest / 255) * 0.72,
              phase: x * 0.19 + y * 0.13,
            })
          }
        }
      }
      frame = window.requestAnimationFrame(paint)
    }
    source.src = src

    const moveDots = (event: PointerEvent) => {
      if (reduce) return
      const bounds = target.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      pointer.active = true
    }
    const resetDots = () => {
      pointer.active = false
      pointer.x = -1000
      pointer.y = -1000
    }
    target.addEventListener('pointermove', moveDots)
    target.addEventListener('pointerleave', resetDots)

    return () => {
      target.removeEventListener('pointermove', moveDots)
      target.removeEventListener('pointerleave', resetDots)
      window.cancelAnimationFrame(frame)
    }
  }, [reduce, src])

  const handleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reduce) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    surfaceRef.current?.style.setProperty('transform', `rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(14px) scale(1.02)`)
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
        ref={buttonRef}
        type="button"
        className="portrait-tilt relative block h-60 w-56 cursor-pointer border-0 bg-transparent p-0 sm:h-72 sm:w-64"
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
        </div>
        <span ref={cursorRef} aria-hidden className="portrait-dot-cursor" />
      </button>
    </div>
  )
}
