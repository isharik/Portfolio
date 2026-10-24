'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Background from '@/components/three/Background'
import { MorphingText } from '@/components/ui/morphing-text'

const OUT = [0.23, 1, 0.32, 1] as const

// Latin transliterations keep the international greeting set consistent in the handwritten font.
const GREETINGS = [
  { text: 'Hello', emoji: '👋' },
  { text: 'Namaste', emoji: '🙏' },
  { text: 'Hola', emoji: '🌞' },
  { text: 'Bonjour', emoji: '🌷' },
  { text: 'Ciao', emoji: '🍋' },
  { text: 'Konnichiwa', emoji: '🌸' },
  { text: 'Ni Hao', emoji: '🏮' },
  { text: 'Annyeong', emoji: '🫰' },
  { text: 'Marhaba', emoji: '🌙' },
  { text: 'Olá', emoji: '🪇' },
  { text: 'Hallo', emoji: '🌼' },
  { text: 'Privet', emoji: '❄️' },
  { text: 'Vanakkam', emoji: '🌺' },
  { text: 'Salaam', emoji: '✨' },
  { text: 'Jambo', emoji: '🦒' },
  { text: 'Sawubona', emoji: '🌍' },
  { text: 'Xin Chào', emoji: '🪷' },
  { text: 'Sawasdee', emoji: '🌼' },
  { text: 'Shalom', emoji: '🕊️' },
  { text: 'Merhaba', emoji: '🧿' },
]
const GREETING_TEXTS = GREETINGS.map(({ text }) => text)
const MORPH_DURATION = 0.46
const MORPH_REST = 0.3

/**
 * Skippable greeting sequence over the same theme-aware global background as
 * the page, using a smooth blur-threshold morph between pixel-font greetings.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const introDuration = GREETINGS.length * ((reduce ? 0 : MORPH_DURATION) + (reduce ? 0.16 : MORPH_REST)) * 1000 + 350

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

  // Let the morph component finish one full loop before the welcome overlay exits.
  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(() => setVisible(false), introDuration)
    return () => window.clearTimeout(timer)
  }, [visible, introDuration])

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
                <div className="preloader-greeting absolute inset-0 flex items-center justify-center gap-[0.22em] text-center text-fg" style={{ fontSize: 'clamp(2.4rem, 8.6vw, 6rem)', lineHeight: 1 }}>
                  <MorphingText
                    texts={GREETING_TEXTS}
                    morphDuration={reduce ? 0 : MORPH_DURATION}
                    restDuration={reduce ? 0.16 : MORPH_REST}
                    repeat={false}
                    onWordChange={setIndex}
                    className="text-fg"
                  />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={index}
                      className="preloader-emoji"
                      aria-hidden="true"
                      initial={{ opacity: 0, y: 6, scale: 0.78, rotate: -8 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, y: -5, scale: 0.85, rotate: 8 }}
                      transition={{ duration: reduce ? 0 : 0.16, ease: OUT }}
                    >{GREETINGS[index].emoji}</motion.span>
                  </AnimatePresence>
                </div>
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
