'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type MorphingTextProps = {
  texts: string[]
  className?: string
  morphDuration?: number
  restDuration?: number
  repeat?: boolean
  onWordChange?: (index: number) => void
}

/**
 * Crisp crossfade morph. Only two DOM text layers update; animation runs on
 * RAF without a React render on each frame.
 */
export function MorphingText({
  texts,
  className,
  morphDuration = 0.48,
  restDuration = 0.22,
  repeat = true,
  onWordChange,
}: MorphingTextProps) {
  const firstRef = useRef<HTMLSpanElement>(null)
  const secondRef = useRef<HTMLSpanElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const callbackRef = useRef(onWordChange)
  const reduceMotion = useReducedMotion()
  callbackRef.current = onWordChange

  useEffect(() => {
    const first = firstRef.current
    const second = secondRef.current
    const measure = measureRef.current
    if (!first || !second || !measure || texts.length < 2) return

    let frame = 0
    let current = 0
    let next = 1
    let morphElapsed = 0
    let restElapsed = 0
    let previousTime = performance.now()
    const morphMs = Math.max(1, morphDuration * 1000)
    const restMs = Math.max(0, restDuration * 1000)

    const settle = () => {
      // Size the word+emoji group to the active greeting, not the longest
      // greeting in the sequence, so the emoji stays tucked beside each word.
      measure.textContent = texts[current]
      first.textContent = texts[current]
      second.textContent = texts[(current + 1) % texts.length]
      first.style.filter = 'none'
      first.style.opacity = '1'
      first.style.transform = 'translateY(0)'
      second.style.filter = 'none'
      second.style.opacity = '0'
      second.style.transform = 'translateY(0.08em)'
    }

    const animate = (time: number) => {
      frame = requestAnimationFrame(animate)
      const delta = Math.min(time - previousTime, 50)
      previousTime = time

      if (reduceMotion) {
        restElapsed += delta
        if (restElapsed >= Math.max(restMs, 100)) {
          if (!repeat && current === texts.length - 1) {
            cancelAnimationFrame(frame)
            return
          }
          restElapsed = 0
          current = repeat ? (current + 1) % texts.length : current + 1
          next = (current + 1) % texts.length
          settle()
          callbackRef.current?.(current)
        }
        return
      }

      restElapsed += delta
      if (restElapsed < restMs) return
      restElapsed = 0
      morphElapsed += delta

      const linearFraction = Math.min(1, morphElapsed / morphMs)
      const fraction = linearFraction * linearFraction * (3 - 2 * linearFraction)
      const inverse = 1 - fraction
      if (first.textContent !== texts[current]) first.textContent = texts[current]
      if (second.textContent !== texts[next]) second.textContent = texts[next]
      first.style.opacity = String(inverse)
      first.style.transform = `translateY(${-fraction * 0.08}em)`
      second.style.opacity = String(fraction)
      second.style.transform = `translateY(${(1 - fraction) * 0.08}em)`

      if (linearFraction >= 1) {
        current = next
        morphElapsed = 0
        settle()
        callbackRef.current?.(current)
        if (!repeat && current === texts.length - 1) {
          cancelAnimationFrame(frame)
          return
        }
        next = (current + 1) % texts.length
      }
    }

    settle()
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [texts, morphDuration, restDuration, reduceMotion, repeat])

  if (!texts.length) return null

  return (
    <>
      <span
        className={`morphing-text ${className ?? ''}`}
        aria-hidden="true"
      >
        <span ref={measureRef} className="morphing-text-measure">{texts[0]}</span>
        <span ref={firstRef} className="morphing-text-layer">{texts[0]}</span>
        <span ref={secondRef} className="morphing-text-layer" style={{ opacity: 0 }}>{texts[1 % texts.length]}</span>
      </span>
      <span className="sr-only">{texts.join(', ')}</span>
    </>
  )
}
