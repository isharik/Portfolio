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
  const clickBufferRef = useRef<AudioBuffer | null>(null)
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
      if (AC) {
        const context = new AC({ latencyHint: 'interactive' })
        const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.03), context.sampleRate)
        const samples = buffer.getChannelData(0)
        for (let index = 0; index < samples.length; index += 1) samples[index] = Math.random() * 2 - 1
        clickBufferRef.current = buffer
        ctxRef.current = context
      }
    }
    return ctxRef.current
  }, [])

  // Create the context ahead of the first interaction, but resume it only from
  // the pointer gesture so browser autoplay policies don't delay the first click.
  useEffect(() => {
    ensureCtx()
  }, [ensureCtx])

  // A short filtered-noise tick reads as a quiet mouse click rather than a low thud.
  // Schedule it synchronously on pointerdown and resume in parallel to avoid a delayed first click.
  const play = useCallback(async () => {
    const ctx = ensureCtx()
    const buffer = clickBufferRef.current
    if (!ctx || !buffer) return
    if (ctx.state !== 'running') void ctx.resume().catch(() => {})
    const t = ctx.currentTime

    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1150, t)
    filter.Q.setValueAtTime(0.7, t)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.045, t + 0.0008)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.024)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(t)
    source.stop(t + 0.03)
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
