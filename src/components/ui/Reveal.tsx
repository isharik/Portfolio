'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Scroll-triggered reveal driven by CSS (gated by the `.js` class on <html>).
 * SSR markup carries only class names + deterministic CSS vars, so there is no
 * hydration mismatch, and the transition runs off the main thread.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  stagger,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  /** presence enables per-child stagger (see RevealItem) */
  stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '-80px 0px', threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style = { '--reveal-y': `${y}px`, '--reveal-delay': `${delay}s` } as CSSProperties

  return (
    <div
      ref={ref}
      style={style}
      className={cn(stagger !== undefined ? 'reveal-stagger' : 'reveal', visible && 'is-visible', className)}
    >
      {children}
    </div>
  )
}

/** Child of a staggered Reveal container. */
export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('reveal-child', className)}>{children}</div>
}
