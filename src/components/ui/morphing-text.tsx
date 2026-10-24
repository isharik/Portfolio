'use client'

import { useEffect, useId, useRef } from 'react'
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
 * Gooey blur/threshold morph inspired by Magic UI's Morphing Text
 * (MIT; credit to Magic UI and Luis Code). Only two DOM text layers update;
 * animation runs on RAF without a React render on each frame.
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
  const filterId = `greeting-morph-${useId().replace(/:/g, '')}`
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
      second.style.filter = 'none'
      second.style.opacity = '0'
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
      const blurIn = Math.min(8 / Math.max(fraction, 0.0001) - 8, 100)
      const blurOut = Math.min(8 / Math.max(inverse, 0.0001) - 8, 100)

      if (first.textContent !== texts[current]) first.textContent = texts[current]
      if (second.textContent !== texts[next]) second.textContent = texts[next]
      first.style.filter = `blur(${blurOut}px)`
      first.style.opacity = String(Math.pow(inverse, 0.4))
      second.style.filter = `blur(${blurIn}px)`
      second.style.opacity = String(Math.pow(fraction, 0.4))

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
        style={{ filter: `url(#${filterId}) blur(0.45px)` }}
      >
        <span ref={measureRef} className="morphing-text-measure">{texts[0]}</span>
        <span ref={firstRef} className="morphing-text-layer">{texts[0]}</span>
        <span ref={secondRef} className="morphing-text-layer" style={{ opacity: 0 }}>{texts[1 % texts.length]}</span>
      </span>
      <svg className="morphing-text-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 18 -7"
            />
          </filter>
        </defs>
      </svg>
      <span className="sr-only">{texts.join(', ')}</span>
    </>
  )
}
