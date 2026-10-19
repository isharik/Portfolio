'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type Dot = { u: number; v: number; depth: number; radius: number; phase: number; offsetX: number; offsetY: number }

type Props = { src: string; alt: string }

const greetings = ['Hi there 👋', 'Hello — nice to meet you ✨', 'Let’s get to know each other ☕', 'Let’s connect 🤝']

/**
 * A source-image-derived particle sculpture. The editable dot model is kept in
 * memory and only redraws while responding to the pointer or settling home.
 */
export default function InteractivePortrait({ src, alt }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [greetingIndex, setGreetingIndex] = useState<number | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const target = buttonRef.current
    if (!canvas || !target) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const pointer = { x: 0, y: 0, yaw: 0, pitch: 0, active: false }
    let dots: Dot[] = []
    let strength = 0
    let frame = 0
    let running = false
    let visible = true
    let imageAspect = 0.75
    let dotColor = ''

    const draw = (time: number) => {
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
      const nextDotColor = document.documentElement.classList.contains('dark') ? '#f7fbff' : '#26355c'
      if (nextDotColor !== dotColor) dotColor = nextDotColor
      strength += ((pointer.active ? 1 : 0) - strength) * 0.13
      const yaw = pointer.yaw * strength
      const pitch = pointer.pitch * strength
      const sinYaw = Math.sin(yaw)
      const cosYaw = Math.cos(yaw)
      const sinPitch = Math.sin(pitch)
      const centerX = bounds.width / 2
      const centerY = bounds.height / 2
      const imageHeight = Math.min(bounds.height, bounds.width / imageAspect)
      const imageWidth = imageHeight * imageAspect
      const radius = 104
      const interactionScale = reduce ? 0.62 : 1

      for (const dot of dots) {
        const localX = (dot.u - 0.5) * imageWidth
        const localY = (dot.v - 0.5) * imageHeight
        const rotatedX = localX * cosYaw + dot.depth * sinYaw * 34
        const rotatedDepth = dot.depth * cosYaw - localX * sinYaw / 34
        const rotatedY = localY * Math.cos(pitch) - rotatedDepth * sinPitch * 15
        let x = centerX + rotatedX
        let y = centerY + rotatedY
        const dx = x - pointer.x
        const dy = y - pointer.y
        const distance = Math.hypot(dx, dy)
        const influence = pointer.active && distance < radius ? (1 - distance / radius) ** 2 : 0
        const unitX = distance ? dx / distance : 1
        const unitY = distance ? dy / distance : 0
        const ripple = influence * Math.sin(time / 100 + dot.phase) * 4 * interactionScale
        const swirl = influence * Math.cos(time / 140 + dot.phase) * 10 * interactionScale
        const idleX = visible ? Math.sin(time / 1500 + dot.phase) * 0.8 : 0
        const idleY = visible ? Math.cos(time / 1700 + dot.phase * 0.8) * 0.8 : 0
        const targetOffsetX = unitX * (influence * 36 * interactionScale + ripple) - unitY * swirl + idleX
        const targetOffsetY = unitY * (influence * 36 * interactionScale + ripple) + unitX * swirl + idleY
        dot.offsetX += (targetOffsetX - dot.offsetX) * 0.22
        dot.offsetY += (targetOffsetY - dot.offsetY) * 0.22
        x += dot.offsetX
        y += dot.offsetY

        context.globalAlpha = Math.min(1, 0.74 + (dot.depth + 1) * 0.13 + influence * 0.18 + (visible ? (Math.sin(time / 520 + dot.phase) + 1) * 0.035 : 0))
        context.fillStyle = dotColor
        context.beginPath()
        context.arc(x, y, dot.radius + influence * 1.1, 0, Math.PI * 2)
        context.fill()
      }

      if (visible || pointer.active || strength > 0.012) {
        frame = window.requestAnimationFrame(draw)
      } else {
        running = false
      }
    }

    const schedule = () => {
      if (!running) {
        running = true
        frame = window.requestAnimationFrame(draw)
      }
    }

    const source = new window.Image()
    source.onload = () => {
      imageAspect = source.naturalWidth / source.naturalHeight
      const sampleWidth = 180
      const sampleHeight = Math.round((source.naturalHeight / source.naturalWidth) * sampleWidth)
      const sampler = document.createElement('canvas')
      sampler.width = sampleWidth
      sampler.height = sampleHeight
      const samplerContext = sampler.getContext('2d', { willReadFrequently: true })
      if (!samplerContext) return
      samplerContext.drawImage(source, 0, 0, sampleWidth, sampleHeight)
      const pixels = samplerContext.getImageData(0, 0, sampleWidth, sampleHeight).data
      const step = 3

      for (let y = 0; y < sampleHeight; y += step) {
        for (let x = 0; x < sampleWidth; x += step) {
          let brightness = 0
          let alpha = 0
          for (let yy = y; yy < Math.min(y + step, sampleHeight); yy += 1) {
            for (let xx = x; xx < Math.min(x + step, sampleWidth); xx += 1) {
              const index = (yy * sampleWidth + xx) * 4
              brightness = Math.max(brightness, (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3)
              alpha = Math.max(alpha, pixels[index + 3])
            }
          }
          if (alpha > 140 && brightness > 135) {
            dots.push({
              u: (x + step / 2) / sampleWidth,
              v: (y + step / 2) / sampleHeight,
              depth: (brightness / 255 - 0.5) * 2,
              radius: 0.75 + (brightness / 255) * 0.7,
              phase: x * 0.18 + y * 0.11,
              offsetX: 0,
              offsetY: 0,
            })
          }
        }
      }
      schedule()
    }
    source.src = src

    const move = (event: PointerEvent) => {
      const bounds = target.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      const interactionScale = reduce ? 0.62 : 1
      pointer.yaw = ((pointer.x / bounds.width) - 0.5) * 0.42 * interactionScale
      pointer.pitch = ((pointer.y / bounds.height) - 0.5) * -0.3 * interactionScale
      pointer.active = true
      schedule()
    }
    const leave = () => {
      pointer.active = false
      schedule()
    }
    const resize = () => schedule()
    const observer = new ResizeObserver(resize)
    observer.observe(target)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
      else if (!pointer.active) {
        window.cancelAnimationFrame(frame)
        running = false
      }
    }, { threshold: 0.05 })
    visibilityObserver.observe(target)
    target.addEventListener('pointermove', move, { passive: true })
    target.addEventListener('pointerleave', leave)

    return () => {
      observer.disconnect()
      visibilityObserver.disconnect()
      target.removeEventListener('pointermove', move)
      target.removeEventListener('pointerleave', leave)
      window.cancelAnimationFrame(frame)
    }
  }, [reduce, src])

  const tilt = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reduce) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    surfaceRef.current?.style.setProperty('transform', `rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(12px)`)
  }

  return (
    <div className="portrait-stage">
      <button
        ref={buttonRef}
        type="button"
        className="portrait-tilt relative block h-72 w-64 cursor-pointer border-0 bg-transparent p-0 sm:h-80 sm:w-72"
        aria-label="Click profile portrait to say hello"
        onPointerMove={tilt}
        onPointerLeave={() => surfaceRef.current?.style.removeProperty('transform')}
        onClick={() => setGreetingIndex((current) => (current === null ? 0 : (current + 1) % greetings.length))}
      >
        <div ref={surfaceRef} className="portrait-surface relative h-full w-full">
          <Image src={src} alt={alt} fill priority sizes="(max-width: 640px) 256px, 288px" className="object-contain portrait-reference" />
          <canvas ref={canvasRef} aria-hidden className="portrait-dots absolute inset-0 h-full w-full" />
        </div>
        <span className="portrait-invite" aria-hidden>Say hello <span>↖</span></span>
        {greetingIndex !== null && <span className="portrait-greeting" role="status" aria-live="polite">{greetings[greetingIndex]}</span>}
      </button>
    </div>
  )
}
