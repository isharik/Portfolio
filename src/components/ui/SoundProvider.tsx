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
        const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.01), context.sampleRate)
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

  // Blend a tiny mechanical transient with a soft, short resonance for a smooth click.
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
    filter.frequency.setValueAtTime(2100, t)
    filter.Q.setValueAtTime(0.65, t)

    const transientGain = ctx.createGain()
    transientGain.gain.setValueAtTime(0.0001, t)
    transientGain.gain.exponentialRampToValueAtTime(0.016, t + 0.0006)
    transientGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.008)

    source.connect(filter)
    filter.connect(transientGain)
    transientGain.connect(ctx.destination)
    source.start(t)
    source.stop(t + 0.01)

    const tone = ctx.createOscillator()
    tone.type = 'sine'
    tone.frequency.setValueAtTime(980, t)
    tone.frequency.exponentialRampToValueAtTime(720, t + 0.035)
    const toneGain = ctx.createGain()
    toneGain.gain.setValueAtTime(0.0001, t)
    toneGain.gain.exponentialRampToValueAtTime(0.009, t + 0.001)
    toneGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.038)
    tone.connect(toneGain)
    toneGain.connect(ctx.destination)
    tone.start(t)
    tone.stop(t + 0.04)
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
