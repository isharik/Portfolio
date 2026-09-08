'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Ties a section's opacity (and a small lift) to its scroll position, so it
 * fades in as it enters and fades back as it leaves — without hiding content
 * while it's actually in view (opacity never drops below ~0.3).
 */
export default function ScrollFade({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // Gentle: full opacity while properly in view; only softens at the very
  // edges (when the section is mostly off-screen), never below 0.5.
  const opacity = useTransform(scrollYProgress, [0, 0.14, 0.86, 1], [0.5, 1, 1, 0.5])
  const y = useTransform(scrollYProgress, [0, 0.14, 0.86, 1], [26, 0, 0, -26])

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="will-change-[transform,opacity]">
      {children}
    </motion.div>
  )
}
