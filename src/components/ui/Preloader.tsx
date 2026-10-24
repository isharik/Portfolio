'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Background from '@/components/three/Background'

const OUT = [0.23, 1, 0.32, 1] as const

// "Hello" around the world (native script where it reads well)
const GREETINGS = [
  { text: 'Hello', emoji: '👋' },
  { text: 'नमस्ते', emoji: '🙏' },
  { text: 'Hola', emoji: '🌞' },
  { text: 'Bonjour', emoji: '🌷' },
  { text: 'Ciao', emoji: '🍋' },
  { text: 'こんにちは', emoji: '🌸' },
  { text: '你好', emoji: '🏮' },
  { text: '안녕하세요', emoji: '🫰' },
  { text: 'مرحبا', emoji: '🌙' },
  { text: 'Olá', emoji: '🪇' },
  { text: 'Hallo', emoji: '🌼' },
  { text: 'Привет', emoji: '❄️' },
  { text: 'Vanakkam', emoji: '🌺' },
  { text: 'Salaam', emoji: '✨' },
]
const FIRST_HOLD = 640
const STEP = 760

function splitGlyphs(text: string) {
  if (typeof Intl.Segmenter === 'function') {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), ({ segment }) => segment)
  }
  return Array.from(text)
}

function scatter(index: number, axis: 'x' | 'y') {
  const seed = (index * 17 + (axis === 'x' ? 11 : 29)) % 9
  return axis === 'x' ? (seed - 4) * 5 : -10 - seed * 2
}

/**
 * Skippable greeting sequence over the same theme-aware global background as
 * the page. Each glyph settles in crisply, then breaks into a brief ash-like drift.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  // Lock scroll only while the intro is visible; restore the moment it hides.
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  // Start the hero particle assembly as the welcome overlay finishes leaving,
  // so visitors actually see the headline form instead of missing it behind it.
  useEffect(() => {
    if (visible) return
    const timer = window.setTimeout(() => window.dispatchEvent(new Event('portfolio:welcome-complete')), 300)
    return () => window.clearTimeout(timer)
  }, [visible])

  // One clean timeline: hold "Hello", then flow, then exit. (setTimeout chain,
  // so the first word never double-fires.)
  useEffect(() => {
    if (!visible) return
    let idx = 0
    let timer = window.setTimeout(function tick() {
      idx += 1
      if (idx >= GREETINGS.length) {
        timer = window.setTimeout(() => setVisible(false), 400)
        return
      }
      setIndex(idx)
      timer = window.setTimeout(tick, STEP)
    }, FIRST_HOLD)
    return () => window.clearTimeout(timer)
  }, [visible])

  const progress = ((index + 1) / GREETINGS.length) * 100

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader-root fixed inset-0 z-[100] cursor-pointer select-none"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: OUT }}
          onClick={() => setVisible(false)}
          role="status"
          aria-label="Loading"
        >
          <div className="relative min-h-screen w-full overflow-hidden bg-[var(--bg)]">
            <Background overlay />
            <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6">
              <div className="relative flex h-40 w-full items-center justify-center">
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={index}
                    initial="enter"
                    animate="settled"
                    exit="ash"
                    variants={{
                      enter: { opacity: 1 },
                      settled: { opacity: 1, transition: { staggerChildren: reduce ? 0 : 0.014, delayChildren: 0.015 } },
                      ash: { transition: { staggerChildren: reduce ? 0 : 0.014, staggerDirection: -1 } },
                    }}
                    className="preloader-greeting absolute inset-0 flex items-center justify-center gap-[0.22em] text-center text-fg"
                    style={{ fontSize: 'clamp(2.75rem, 11vw, 6.5rem)', lineHeight: 1 }}
                  >
                    <span className="inline-flex" aria-hidden="true">
                      {splitGlyphs(GREETINGS[index].text).map((glyph, glyphIndex) => (
                        <motion.span
                          key={`${glyph}-${glyphIndex}`}
                          className="inline-block"
                          variants={{
                            enter: { opacity: 0, y: 9, rotateX: -24, filter: 'blur(3px)' },
                            settled: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: reduce ? 0 : 0.24, ease: OUT } },
                            ash: { opacity: 0, x: reduce ? 0 : scatter(glyphIndex, 'x'), y: reduce ? 0 : scatter(glyphIndex, 'y'), scale: 0.65, filter: reduce ? 'blur(0px)' : 'blur(4px)', transition: { duration: reduce ? 0 : 0.22, ease: 'easeOut' } },
                          }}
                        >{glyph}</motion.span>
                      ))}
                    </span>
                    <motion.span
                      className="preloader-emoji"
                      aria-hidden="true"
                      variants={{
                        enter: { opacity: 0, y: 5, scale: 0.8 },
                        settled: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0 : 0.2, delay: 0.08, ease: OUT } },
                        ash: { opacity: 0, y: -7, scale: 0.8, transition: { duration: reduce ? 0 : 0.16 } },
                      }}
                    >{GREETINGS[index].emoji}</motion.span>
                    <span className="sr-only">{GREETINGS[index].text}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* fill line + skip hint */}
              <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4">
                <div className="h-px w-44 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${progress}%`, transition: reduce ? 'none' : 'width 0.3s cubic-bezier(0.2,0.75,0.25,1)' }}
                  />
                </div>
                <p className="font-mono text-[11px] tracking-wide text-fg-subtle">click anywhere to skip</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
