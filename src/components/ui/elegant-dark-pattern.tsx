import type React from 'react'
import { cn } from '@/lib/utils'

interface DarkGradientBgProps {
  children?: React.ReactNode
  className?: string
}

// Skewed cyan streak masks (from the reference pattern)
const STREAKS = [
  'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0) 36%, rgb(0,0,0) 55%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)',
  'linear-gradient(90deg, rgba(0,0,0,0) 11%, rgb(0,0,0) 25%, rgba(0,0,0,0.55) 41%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)',
  'linear-gradient(90deg, rgba(0,0,0,0) 9%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.424) 40%, rgb(0,0,0) 48%, rgba(0,0,0,0.267) 54%, rgba(0,0,0,0.13) 78%, rgb(0,0,0) 88%, rgba(0,0,0,0) 97%)',
  'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 17%, rgba(0,0,0,0.55) 26%, rgb(0,0,0) 35%, rgba(0,0,0,0) 47%, rgba(0,0,0,0.13) 69%, rgb(0,0,0) 79%, rgba(0,0,0,0) 97%)',
  'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 27%, rgb(0,0,0) 42%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 74%, rgb(0,0,0) 82%, rgba(0,0,0,0.47) 88%, rgba(0,0,0,0) 97%)',
]

const BASE_MASK =
  'radial-gradient(125% 100% at 0% 0%, rgb(0,0,0) 0%, rgba(0,0,0,0.224) 88.2883%, rgba(0,0,0,0) 100%)'

export function DarkGradientBg({ children, className }: DarkGradientBgProps) {
  return (
    <div className={cn('relative min-h-screen w-full overflow-hidden bg-black', className)}>
      {/* Base charcoal → black gradient, masked from the top-left */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(100% 100% at 0% 0%, rgb(46,46,46) 0%, rgb(0,0,0) 100%)',
          mask: BASE_MASK,
          WebkitMask: BASE_MASK,
        }}
      />

      {/* Skewed cyan streaks — slow drift + shimmer (the "alive-streaks" animation) */}
      <div className="alive-streaks absolute inset-0" style={{ mask: BASE_MASK, WebkitMask: BASE_MASK }}>
        {STREAKS.map((m, i) => (
          <div
            key={i}
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(rgb(0,207,255) 0%, rgba(0,207,255,0) 100%)',
              mask: m,
              WebkitMask: m,
              transform: 'skewX(45deg)',
            }}
          />
        ))}
      </div>

      {/* Dot pattern — slowly panning */}
      <div
        className="alive-dots absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Soft radial highlight behind content — slow breathing drift */}
      <div
        className="alive-glow absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 42%, rgba(120,120,220,0.20), transparent 60%)' }}
      />

      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  )
}
