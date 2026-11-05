'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

type SoundKey = 'click' | 'navigation' | 'hero' | 'about' | 'experience' | 'projects' | 'skills' | 'contact' | 'player' | 'toggle' | 'welcome'
type SoundCtx = { enabled: boolean; toggle: () => void }
const SoundContext = createContext<SoundCtx>({ enabled: true, toggle: () => {} })
const SOUND_KEYS: SoundKey[] = ['click', 'navigation', 'hero', 'about', 'experience', 'projects', 'skills', 'contact', 'player', 'toggle', 'welcome']
const INTERACTIVE = 'a[href], button, [role="button"], [role="tab"], [role="switch"], [role="slider"], input[type="range"], label, summary, [data-sound]'
const SECTION_SOUND: Record<string, SoundKey> = {
  home: 'hero', about: 'about', experience: 'experience', projects: 'projects', skills: 'skills', contact: 'contact',
}
const FALLBACK_TONES: Record<SoundKey, [number, number]> = {
  click: [1450, 980], navigation: [1280, 1110], hero: [920, 720], about: [1080, 850],
  experience: [740, 570], projects: [1360, 1580], skills: [1720, 1180], contact: [880, 1050],
  player: [1860, 1420], toggle: [680, 920], welcome: [784, 988],
}

function isSoundKey(value: string | undefined): value is SoundKey {
  return Boolean(value && SOUND_KEYS.includes(value as SoundKey))
}

function soundForElement(element: HTMLElement): SoundKey {
  const explicit = element.closest<HTMLElement>('[data-sound]')?.dataset.sound
  if (isSoundKey(explicit)) return explicit
  const section = element.closest<HTMLElement>('[id]')?.id
  if (section && SECTION_SOUND[section]) return SECTION_SOUND[section]
  return 'click'
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true)
  const enabledRef = useRef(true)
  const ctxRef = useRef<AudioContext | null>(null)
  const buffersRef = useRef<Partial<Record<SoundKey, AudioBuffer>>>({})
  const lastRef = useRef(0)
  const welcomePendingRef = useRef(false)

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

  // These small, repository-local WAVs are fetched and decoded before visitors interact.
  useEffect(() => {
    const ctx = ensureCtx()
    if (!ctx) return
    let cancelled = false
    void Promise.all(SOUND_KEYS.map(async (key) => {
      try {
        const response = await fetch(`/sounds/${key}.wav`)
        if (!response.ok) return
        const bytes = await response.arrayBuffer()
        const decoded = await ctx.decodeAudioData(bytes)
        if (!cancelled) buffersRef.current[key] = decoded
      } catch {}
    }))
    return () => { cancelled = true }
  }, [ensureCtx])

  const play = useCallback((key: SoundKey) => {
    const ctx = ensureCtx()
    if (!ctx) return
    if (ctx.state !== 'running') void ctx.resume().catch(() => {})

    const buffer = buffersRef.current[key]
    if (buffer) {
      const source = ctx.createBufferSource()
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(key === 'welcome' ? 0.45 : 0.28, ctx.currentTime)
      source.buffer = buffer
      source.connect(gain)
      gain.connect(ctx.destination)
      source.start(ctx.currentTime)
      return
    }

    // Immediate synthesized fallback if a sound file is still loading or unavailable.
    const [startFrequency, endFrequency] = FALLBACK_TONES[key]
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    const start = ctx.currentTime
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(startFrequency, start)
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + (key === 'welcome' ? 0.23 : 0.045))
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(key === 'welcome' ? 0.026 : 0.012, start + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (key === 'welcome' ? 0.27 : 0.055))
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(start)
    oscillator.stop(start + (key === 'welcome' ? 0.28 : 0.06))
  }, [ensureCtx])

  useEffect(() => {
    const onWelcomeComplete = () => {
      if (!enabledRef.current) return
      const ctx = ctxRef.current
      if (ctx?.state === 'running') play('welcome')
      else welcomePendingRef.current = true
    }
    const onDown = (event: PointerEvent) => {
      if (!enabledRef.current) return
      const target = event.target as Element | null
      const element = target?.closest?.(INTERACTIVE) as HTMLElement | null
      if (!element || element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') return
      const now = performance.now()
      if (now - lastRef.current < 65) return
      lastRef.current = now
      if (welcomePendingRef.current) {
        welcomePendingRef.current = false
        // Use the first gesture immediately when autoplay was blocked by the browser.
        play('welcome')
        return
      }
      play(soundForElement(element))
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (!enabledRef.current || (event.key !== 'Enter' && event.key !== ' ')) return
      const target = event.target as Element | null
      const element = target?.closest?.(INTERACTIVE) as HTMLElement | null
      if (!element || element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') return
      const now = performance.now()
      if (now - lastRef.current < 65) return
      lastRef.current = now
      if (welcomePendingRef.current) {
        welcomePendingRef.current = false
        play('welcome')
        return
      }
      play(soundForElement(element))
    }
    document.addEventListener('portfolio:welcome-complete', onWelcomeComplete)
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('portfolio:welcome-complete', onWelcomeComplete)
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [play])

  const toggle = useCallback(() => {
    setEnabled((previous) => {
      const next = !previous
      enabledRef.current = next
      try { localStorage.setItem('sound', next ? 'on' : 'off') } catch {}
      if (next) play('toggle')
      return next
    })
  }, [play])

  return <SoundContext.Provider value={{ enabled, toggle }}>{children}</SoundContext.Provider>
}

export const useSound = () => useContext(SoundContext)
