import type React from 'react'

// Skewed streak masks (shared with the intro's pattern)
const STREAKS = [
  'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0) 36%, rgb(0,0,0) 55%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)',
  'linear-gradient(90deg, rgba(0,0,0,0) 11%, rgb(0,0,0) 25%, rgba(0,0,0,0.55) 41%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)',
  'linear-gradient(90deg, rgba(0,0,0,0) 9%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.424) 40%, rgb(0,0,0) 48%, rgba(0,0,0,0.267) 54%, rgba(0,0,0,0.13) 78%, rgb(0,0,0) 88%, rgba(0,0,0,0) 97%)',
  'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 17%, rgba(0,0,0,0.55) 26%, rgb(0,0,0) 35%, rgba(0,0,0,0) 47%, rgba(0,0,0,0.13) 69%, rgb(0,0,0) 79%, rgba(0,0,0,0) 97%)',
  'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 27%, rgb(0,0,0) 42%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 74%, rgb(0,0,0) 82%, rgba(0,0,0,0.47) 88%, rgba(0,0,0,0) 97%)',
]

const BASE_MASK =
  'radial-gradient(125% 100% at 0% 0%, rgb(0,0,0) 0%, rgba(0,0,0,0.224) 88.2883%, rgba(0,0,0,0) 100%)'

/**
 * App-wide ambient background: the same charcoal→black (dark) / soft-light
 * pattern as the intro, themed via tokens so text stays readable in both
 * modes. CSS-only — no WebGL, no render loop.
 */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0" style={{ background: 'var(--pattern-base)' }} />

      {/* Skewed streaks, concentrated top-left */}
      <div className="app-streaks absolute inset-0" style={{ mask: BASE_MASK, WebkitMask: BASE_MASK }}>
        {STREAKS.map((m, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(var(--pattern-streak) 0%, transparent 100%)',
              mask: m,
              WebkitMask: m,
              transform: 'skewX(45deg)',
            }}
          />
        ))}
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--pattern-dot) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          opacity: 0.5,
        }}
      />

      {/* Slow breathing glow */}
      <div
        className="app-glow absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 38%, var(--pattern-glow), transparent 60%)' }}
      />

      {/* Legibility vignette toward the theme background */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 92% 80% at 50% 35%, transparent 45%, var(--bg) 95%)' }}
      />
    </div>
  )
}
