'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

type SoundKey = 'click' | 'navigation' | 'hero' | 'about' | 'experience' | 'projects' | 'skills' | 'contact' | 'player' | 'toggle' | 'welcome'
type SoundCtx = { enabled: boolean; toggle: () => void }
const SoundContext = createContext<SoundCtx>({ enabled: true, toggle: () => {} })
const SOUND_PREF_KEY = 'sound-v2'
const SOUND_KEYS: SoundKey[] = ['click', 'navigation', 'hero', 'about', 'experience', 'projects', 'skills', 'contact', 'player', 'toggle', 'welcome']
const SOUND_FILES: Record<SoundKey, string> = {
  click: 'click.wav', navigation: 'navigation.wav', hero: 'hero.wav', about: 'about.wav',
  experience: 'experience.wav', projects: 'projects.wav', skills: 'skills.wav', contact: 'contact.wav',
  player: 'player.wav', toggle: 'toggle.wav', welcome: 'welcome.mp3',
}
const INTERACTIVE = 'a[href], button, [role="button"], [role="tab"], [role="switch"], [role="slider"], input[type="range"], label, summary, [data-sound]'
const SECTION_SOUND: Record<string, SoundKey> = {
  home: 'hero', about: 'about', experience: 'experience', projects: 'projects', skills: 'skills', contact: 'contact',
}
const FALLBACK_TONES: Record<SoundKey, [number, number]> = {
  click: [620, 460], navigation: [690, 520], hero: [650, 490], about: [590, 450],
  experience: [540, 410], projects: [610, 505], skills: [720, 560], contact: [560, 660],
  player: [760, 540], toggle: [480, 650], welcome: [523.25, 659.25],
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
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null)
  const lastRef = useRef(0)
  const welcomePendingRef = useRef(false)

  useEffect(() => {
    const welcomeAudio = new Audio(`/sounds/${SOUND_FILES.welcome}`)
    welcomeAudio.preload = 'auto'
    welcomeAudio.volume = 0.46
    welcomeAudio.load()
    welcomeAudioRef.current = welcomeAudio
    try {
      if (localStorage.getItem(SOUND_PREF_KEY) === 'off') {
        setEnabled(false)
        enabledRef.current = false
      }
    } catch {}
    return () => {
      welcomeAudio.pause()
      welcomeAudioRef.current = null
    }
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
        const response = await fetch(`/sounds/${SOUND_FILES[key]}`)
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
      gain.gain.setValueAtTime(key === 'welcome' ? 0.5 : 0.38, ctx.currentTime)
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
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(startFrequency, start)
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + (key === 'welcome' ? 0.23 : 0.045))
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(key === 'welcome' ? 0.022 : 0.008, start + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (key === 'welcome' ? 0.27 : 0.055))
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(start)
    oscillator.stop(start + (key === 'welcome' ? 0.28 : 0.06))
  }, [ensureCtx])

  const playWelcome = useCallback(async () => {
    if (!enabledRef.current) return false
    // A decoded buffer starts on the current audio clock with no media-element
    // scheduling delay once a visitor has interacted with the page.
    if (ctxRef.current?.state === 'running' && buffersRef.current.welcome) {
      play('welcome')
      return true
    }
    const welcomeAudio = welcomeAudioRef.current
    if (welcomeAudio) {
      try {
        welcomeAudio.currentTime = 0
        await welcomeAudio.play()
        return true
      } catch {}
    }
    const ctx = ctxRef.current
    if (ctx?.state === 'running') {
      play('welcome')
      return true
    }
    return false
  }, [play])

  useEffect(() => {
    const onWelcomeComplete = () => {
      if (!enabledRef.current) return
      void playWelcome().then((played) => {
        welcomePendingRef.current = !played
      })
    }
    const onDown = (event: PointerEvent) => {
      if (!enabledRef.current) return
      // Resume the shared audio clock during the first real user gesture. This
      // is required by Safari and some Android browsers before any audio may play.
      const ctx = ensureCtx()
      if (ctx?.state === 'suspended') void ctx.resume().catch(() => {})
      if (welcomePendingRef.current) {
        welcomePendingRef.current = false
        void playWelcome()
        return
      }
      const target = event.target as Element | null
      const element = target?.closest?.(INTERACTIVE) as HTMLElement | null
      if (!element || element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') return
      const now = performance.now()
      if (now - lastRef.current < 65) return
      lastRef.current = now
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
        void playWelcome()
        return
      }
      play(soundForElement(element))
    }
    window.addEventListener('portfolio:welcome-complete', onWelcomeComplete)
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      window.removeEventListener('portfolio:welcome-complete', onWelcomeComplete)
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [ensureCtx, play, playWelcome])

  const toggle = useCallback(() => {
    setEnabled((previous) => {
      const next = !previous
      enabledRef.current = next
      try { localStorage.setItem(SOUND_PREF_KEY, next ? 'on' : 'off') } catch {}
      if (!next) {
        welcomeAudioRef.current?.pause()
        welcomePendingRef.current = false
      }
      if (next) play('toggle')
      return next
    })
  }, [play])

  return <SoundContext.Provider value={{ enabled, toggle }}>{children}</SoundContext.Provider>
}

export const useSound = () => useContext(SoundContext)
