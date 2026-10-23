'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

type SoundCtx = { enabled: boolean; toggle: () => void }
const SoundContext = createContext<SoundCtx>({ enabled: true, toggle: () => {} })

// Only chime for genuinely interactive elements — not blank space or body text.
const INTERACTIVE = 'a[href], button, [role="button"], [role="tab"], [role="switch"], label, summary'

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true)
  const enabledRef = useRef(true)
  const ctxRef = useRef<AudioContext | null>(null)
  const lastRef = useRef(0)

  // Restore preference (default on)
  useEffect(() => {
    try {
      if (localStorage.getItem('sound') === 'off') {
        setEnabled(false)
        enabledRef.current = false
      }
    } catch {}
  }, [])

  const ensureCtx = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (AC) ctxRef.current = new AC({ latencyHint: 'interactive' })
    }
    return ctxRef.current
  }, [])

  // Create the context ahead of the first interaction, but resume it only from
  // the pointer gesture so browser autoplay policies don't delay the first click.
  useEffect(() => {
    ensureCtx()
  }, [ensureCtx])

  // A short, warm click with a near-instant attack. Wait for a suspended audio
  // context to resume before scheduling, otherwise the tone can start late.
  const play = useCallback(async () => {
    const ctx = ensureCtx()
    if (!ctx) return
    if (ctx.state !== 'running') {
      try { await ctx.resume() } catch { return }
    }
    const t = ctx.currentTime

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2800, t)

    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, t)
    master.gain.exponentialRampToValueAtTime(0.1, t + 0.0015) // immediate, soft attack
    master.gain.exponentialRampToValueAtTime(0.0001, t + 0.16) // short, clean decay

    filter.connect(master)
    master.connect(ctx.destination)

    // main tone
    const o1 = ctx.createOscillator()
    o1.type = 'sine'
    o1.frequency.setValueAtTime(540, t)
    o1.frequency.exponentialRampToValueAtTime(320, t + 0.1)
    o1.connect(filter)

    // sub-octave for warmth/body
    const o2 = ctx.createOscillator()
    o2.type = 'sine'
    o2.frequency.setValueAtTime(270, t)
    o2.frequency.exponentialRampToValueAtTime(180, t + 0.1)
    const subGain = ctx.createGain()
    subGain.gain.value = 0.5
    o2.connect(subGain)
    subGain.connect(filter)

    o1.start(t)
    o2.start(t)
    o1.stop(t + 0.28)
    o2.stop(t + 0.28)
  }, [ensureCtx])

  // Global, capture-phase listener so it works across all interactive elements.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!enabledRef.current) return
      const target = e.target as Element | null
      const el = target?.closest?.(INTERACTIVE) as HTMLElement | null
      if (!el) return
      if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return
      const now = performance.now()
      if (now - lastRef.current < 70) return // throttle rapid taps
      lastRef.current = now
      void play().catch(() => {})
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [play])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      enabledRef.current = next
      try {
        localStorage.setItem('sound', next ? 'on' : 'off')
      } catch {}
      if (next) {
        void play().catch(() => {}) // preview the sound the moment it's re-enabled
      }
      return next
    })
  }, [play])

  return <SoundContext.Provider value={{ enabled, toggle }}>{children}</SoundContext.Provider>
}

export const useSound = () => useContext(SoundContext)
