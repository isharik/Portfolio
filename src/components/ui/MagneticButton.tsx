'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'

type Props = {
  children: React.ReactNode
  href?: string
  onClick?: (e: React.MouseEvent) => void
  variant?: Variant
  className?: string
  external?: boolean
  ariaLabel?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const styles: Record<Variant, string> = {
  primary:
    'bg-accent text-[var(--accent-fg)] hover:brightness-110 shadow-[0_4px_20px_-4px_var(--accent)]',
  secondary:
    'border border-border bg-surface/60 text-fg hover:border-border-strong hover:bg-[var(--surface-muted)]',
  ghost: 'text-fg-muted hover:text-fg',
}

/** Cursor-reactive button with spring physics + press feedback. */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  external,
  ariaLabel,
  type = 'button',
  disabled,
}: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 })

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.25)
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  const inner = (
    <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
  )

  const base = cn(
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium',
    'transition-[filter,background-color,border-color,transform] duration-200 ease-out',
    'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [@media(hover:none)]:!transform-none',
    styles[variant],
    className
  )

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className="inline-flex [@media(hover:none)]:!translate-x-0 [@media(hover:none)]:!translate-y-0"
    >
      {href ? (
        <a
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          className={base}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} aria-label={ariaLabel} className={base} disabled={disabled}>
          {inner}
        </button>
      )}
    </motion.div>
  )
}
