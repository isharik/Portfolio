'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const OUT = [0.23, 1, 0.32, 1] as const

// "Hello" around the world (native script where it reads well)
const GREETINGS = [
  'Hello',
  'नमस्ते',
  'Hola',
  'Bonjour',
  'Ciao',
  'こんにちは',
  '你好',
  '안녕하세요',
  'مرحبا',
  'Olá',
  'Hallo',
  'Привет',
  'Vanakkam',
  'Salaam',
]
const FIRST_HOLD = 520
const STEP = 250

/**
 * Lightweight, skippable greeting sequence. Static backdrop and opacity-only
 * text transitions avoid the expensive layered movement of the old intro.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)

  // Lock scroll only while the intro is visible; restore the moment it hides.
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  // One clean timeline: hold "Hello", then flow, then exit. (setTimeout chain,
  // so the first word never double-fires.)
  useEffect(() => {
    let idx = 0
    let timer = window.setTimeout(function tick() {
      idx += 1
      if (idx >= GREETINGS.length) {
        timer = window.setTimeout(() => setVisible(false), 340)
        return
      }
      setIndex(idx)
      timer = window.setTimeout(tick, STEP)
    }, FIRST_HOLD)
    return () => window.clearTimeout(timer)
  }, [])

  const progress = ((index + 1) / GREETINGS.length) * 100

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader-root fixed inset-0 z-[100] cursor-pointer select-none"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: OUT }}
          onClick={() => setVisible(false)}
          role="status"
          aria-label="Loading"
        >
          <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_42%,#17202d_0%,#080b11_48%,#030406_100%)]">
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6">
              <div className="relative flex h-40 w-full items-center justify-center">
                <AnimatePresence initial={false}>
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: OUT }}
                    className="absolute inset-0 flex items-center justify-center text-center font-display font-bold tracking-tight text-white"
                    style={{ fontSize: 'clamp(2.75rem, 11vw, 6.5rem)', lineHeight: 1 }}
                  >
                    {GREETINGS[index]}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* fill line + skip hint */}
              <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4">
                <div className="h-px w-44 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-white/70"
                    style={{ width: `${progress}%`, transition: 'width 0.22s cubic-bezier(0.2,0.75,0.25,1)' }}
                  />
                </div>
                <p className="font-mono text-[11px] tracking-wide text-white/40">click anywhere to skip</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
