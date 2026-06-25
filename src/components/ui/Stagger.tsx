'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface StaggerProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function StaggerContainer({ children, className = '', delay = 0 }: StaggerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      variants={{ ...container, visible: { ...container.visible, transition: { staggerChildren: 0.1, delayChildren: delay } } }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
