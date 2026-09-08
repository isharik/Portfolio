'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useTheme } from './ThemeProvider'

const CHAIN_BASE = 40 // resting chain length (px)
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

/**
 * A ceiling pull-chain that toggles the theme. Grab the tab and drag it down —
 * the wire lengthens live, sways like a pendulum on release, and the bulb
 * turns on (light) / off (dark). A plain click plays the same yank.
 */
export default function LampToggle() {
  const { theme, toggleTheme } = useTheme()
  const lit = theme === 'light'

  const pull = useMotionValue(0)
  const sway = useMotionValue(0)
  const chainH = useTransform(pull, (v) => CHAIN_BASE + v)
  const tabY = useTransform(pull, (v) => CHAIN_BASE + v)

  const dragging = useRef(false)
  const startY = useRef(0)

  const swayIt = () => animate(sway, [0, 4.5, -3, 2, -1, 0], { duration: 0.95, ease: 'easeOut' })

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true
    startY.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    pull.set(clamp(e.clientY - startY.current, 0, 62))
  }
  const release = () => {
    if (!dragging.current) return
    dragging.current = false
    const dy = pull.get()
    if (dy < 8) {
      // treated as a click → play the yank; toggle early so it feels instant
      animate(pull, [0, 22, 0], { duration: 0.45, ease: [0.34, 1.3, 0.64, 1] })
      window.setTimeout(toggleTheme, 70)
    } else {
      toggleTheme()
      animate(pull, 0, { type: 'spring', stiffness: 340, damping: 17 })
    }
    swayIt()
  }

  return (
    <div className="relative h-9 w-8">
      {/* ceiling mount */}
      <div className="absolute left-1/2 top-0 z-20 h-2 w-6 -translate-x-1/2 rounded-b-[5px] bg-gradient-to-b from-zinc-300 to-zinc-500 shadow-[0_1px_2px_rgba(0,0,0,0.4)] dark:from-zinc-500 dark:to-zinc-700" />
      {/* bulb */}
      <div
        className="absolute left-1/2 top-[6px] z-20 h-3 w-3 -translate-x-1/2 rounded-full transition-[background,box-shadow] duration-500"
        style={{
          background: lit
            ? 'radial-gradient(circle at 50% 40%, #fff6d6, #ffcf6b 70%, #f0a93a)'
            : 'radial-gradient(circle at 50% 40%, #3a3a42, #202027)',
          boxShadow: lit ? '0 0 10px 3px rgba(255,200,90,0.85), 0 0 26px 10px rgba(255,190,80,0.45)' : 'none',
        }}
      />
      {/* warm room glow when lit */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1 -z-10 h-24 w-24 -translate-x-1/2 rounded-full transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle, rgba(255,196,92,0.3), transparent 70%)', opacity: lit ? 1 : 0 }}
      />

      {/* swaying chain + tab */}
      <motion.div style={{ x: '-50%', rotate: sway }} className="absolute left-1/2 top-[9px] w-5 origin-top">
        <motion.div style={{ height: chainH }} className="bead-chain absolute left-1/2 top-0 -translate-x-1/2" />
        <motion.button
          style={{
            y: tabY,
            background: 'linear-gradient(150deg, #34353c 0%, #17181c 55%, #0b0b0e 100%)',
            boxShadow:
              'inset 0 1px 1px rgba(255,255,255,0.28), inset 0 -3px 5px rgba(0,0,0,0.7), 0 4px 10px rgba(0,0,0,0.45), 0 0 16px rgba(0,207,255,0.45)',
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={release}
          onPointerCancel={release}
          aria-label={lit ? 'Switch to dark mode' : 'Switch to light mode'}
          className="absolute left-0 top-0 h-9 w-5 cursor-grab touch-none rounded-full active:cursor-grabbing"
        >
          <span className="absolute inset-y-2.5 left-1/2 w-px -translate-x-[3px] bg-white/12" />
          <span className="absolute inset-y-2.5 left-1/2 w-px translate-x-[2px] bg-white/12" />
          <span className="absolute inset-x-1 top-1 h-2 rounded-full bg-white/10 blur-[1px]" />
        </motion.button>
      </motion.div>
    </div>
  )
}
