'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { DarkGradientBg } from '@/components/ui/elegant-dark-pattern'

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
const FIRST_HOLD = 950 // opening "Hello" lingers
const STEP = 320 // steady flow with enough time for each clean fade

/**
 * Full-screen intro: a deliberate opening greeting, then one smooth flow
 * through the world's languages over the living dark pattern, before it
 * crossfades out to reveal the page. Requested, one-time, skippable.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)

  // gentle mouse parallax on the greeting
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 110, damping: 22, mass: 0.5 })
  const py = useSpring(my, { stiffness: 110, damping: 22, mass: 0.5 })

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
        timer = window.setTimeout(() => setVisible(false), 560)
        return
      }
      setIndex(idx)
      timer = window.setTimeout(tick, STEP)
    }, FIRST_HOLD)
    return () => window.clearTimeout(timer)
  }, [])

  const onMove = (e: React.MouseEvent) => {
    mx.set(((e.clientX - window.innerWidth / 2) / window.innerWidth) * 26)
    my.set(((e.clientY - window.innerHeight / 2) / window.innerHeight) * 26)
  }

  const progress = ((index + 1) / GREETINGS.length) * 100

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader-root fixed inset-0 z-[100] cursor-pointer select-none"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: OUT }}
          onClick={() => setVisible(false)}
          onMouseMove={onMove}
          role="status"
          aria-label="Loading"
        >
          <DarkGradientBg>
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6">
              {/* cinematic entrance for the opening greeting */}
              <div className="pl-greet-in relative flex h-40 w-full items-center justify-center">
                <motion.div style={{ x: px, y: py }} className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 1 }}
                      transition={{ duration: 0.2, ease: OUT }}
                      className="absolute inset-0 flex items-center justify-center text-center font-display font-bold tracking-tight text-white"
                      style={{ fontSize: 'clamp(2.75rem, 11vw, 6.5rem)', lineHeight: 1 }}
                    >
                      {GREETINGS[index]}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* fill line + skip hint */}
              <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4">
                <div className="h-px w-44 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-white/70"
                    style={{ width: `${progress}%`, transition: 'width 0.4s cubic-bezier(0.23,1,0.32,1)' }}
                  />
                </div>
                <p className="font-mono text-[11px] tracking-wide text-white/40">click anywhere to skip</p>
              </div>
            </div>
          </DarkGradientBg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
