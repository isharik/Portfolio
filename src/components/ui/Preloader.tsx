'use client'
import { useEffect, useMemo, useState } from 'react'
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
const FIRST_HOLD = 760
const STEP = 520

/**
 * Skippable greeting sequence over the same theme-aware global background as
 * the page, with opacity-only text transitions and no pointer-driven motion.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const letters = useMemo(() => Array.from(GREETINGS[index].text), [index])

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
                  <motion.span
                    key={index}
                    initial="hidden"
                    animate="shown"
                    exit="dissolve"
                    variants={{
                      hidden: { opacity: 0 },
                      shown: { opacity: 1, transition: { staggerChildren: reduce ? 0 : 0.035, delayChildren: 0.02 } },
                      dissolve: { opacity: 0, transition: { staggerChildren: reduce ? 0 : 0.018, staggerDirection: -1 } },
                    }}
                    className="preloader-greeting absolute inset-0 flex items-center justify-center gap-[0.22em] text-center text-fg"
                    style={{ fontSize: 'clamp(2.75rem, 11vw, 6.5rem)', lineHeight: 1, willChange: reduce ? 'auto' : 'opacity' }}
                  >
                    <span className="inline-flex" aria-label={GREETINGS[index].text}>
                      {letters.map((letter, letterIndex) => (
                        <motion.span key={`${letter}-${letterIndex}`} aria-hidden="true" variants={{
                          hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
                          shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reduce ? 0 : 0.34, ease: OUT } },
                          dissolve: { opacity: 0, y: -13 - (letterIndex % 3) * 3, x: (letterIndex % 2 ? 1 : -1) * (4 + letterIndex % 4), scale: 0.72, filter: 'blur(5px)', transition: { duration: reduce ? 0 : 0.32, ease: 'easeIn', delay: reduce ? 0 : letterIndex * 0.018 } },
                        }}>{letter === ' ' ? '\u00a0' : letter}</motion.span>
                      ))}
                    </span>
                    <motion.span className="preloader-emoji" aria-hidden="true" variants={{
                      hidden: { opacity: 0, scale: 0.75, rotate: -12 },
                      shown: { opacity: 1, scale: 1, rotate: 0, transition: { duration: reduce ? 0 : 0.32, ease: OUT } },
                      dissolve: { opacity: 0, scale: 0.7, y: -7, filter: 'blur(4px)', transition: { duration: reduce ? 0 : 0.25, ease: 'easeIn' } },
                    }}>{GREETINGS[index].emoji}</motion.span>
                  </motion.span>
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
