'use client'

import { FastForward, Pause, Play, Repeat, Rewind, Volume2 } from 'lucide-react'
import Image from 'next/image'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

const bars = [12, 20, 15, 26, 18, 32, 22, 15, 27, 36, 21, 30, 16, 25, 34, 18, 28, 14, 24, 32, 18, 27, 15, 22, 30, 17]
type LocalWeather = { temperature: number; code: number; place: string }
type WeatherState = 'consent' | 'loading' | 'ready' | 'unavailable'

const weatherLabel = (code: number) => {
  if (code === 0) return ['☀️', 'CLEAR']
  if (code <= 3) return ['🌤️', 'PARTLY CLOUDY']
  if (code <= 48) return ['🌫️', 'FOG']
  if (code <= 67 || (code >= 80 && code <= 82)) return ['🌧️', 'RAIN']
  if (code <= 77) return ['❄️', 'SNOW']
  if (code >= 95) return ['⛈️', 'STORM']
  return ['☁️', 'CLOUDY']
}

export default function RecruiterIntroPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const rangeRef = useRef<HTMLInputElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loop, setLoop] = useState(false)
  const [error, setError] = useState(false)
  const [greetingIndex, setGreetingIndex] = useState<number | null>(null)
  const [weather, setWeather] = useState<LocalWeather | null>(null)
  const [weatherStatus, setWeatherStatus] = useState<WeatherState>('consent')
  const [localTime, setLocalTime] = useState('')

  const greetings = ['Hi there 👋', 'Hello — nice to meet you ✨', 'Let’s get to know each other ☕', 'Let’s connect 🤝']

  useEffect(() => {
    const updateClock = () => setLocalTime(new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date()))
    updateClock()
    const timer = window.setInterval(updateClock, 15000)
    return () => window.clearInterval(timer)
  }, [])

  const enableLocalWeather = () => {
    if (!navigator.geolocation) {
      setWeatherStatus('unavailable')
      return
    }
    setWeatherStatus('loading')
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const params = new URLSearchParams({ latitude: String(coords.latitude), longitude: String(coords.longitude), current: 'temperature_2m,weather_code', temperature_unit: 'celsius' })
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
        if (!response.ok) throw new Error('Weather request failed')
        const data = await response.json() as { current?: { temperature_2m?: number; weather_code?: number }; timezone?: string }
        const placeResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&zoom=10`)
        const placeData = placeResponse.ok ? await placeResponse.json() as { address?: { city?: string; town?: string; village?: string; county?: string } } : null
        const place = placeData?.address?.city ?? placeData?.address?.town ?? placeData?.address?.village ?? placeData?.address?.county ?? data.timezone?.split('/').at(-1)?.replaceAll('_', ' ') ?? 'LOCAL WEATHER'
        if (data.current?.temperature_2m == null || data.current.weather_code == null) throw new Error('Weather unavailable')
        setWeather({ temperature: Math.round(data.current.temperature_2m), code: data.current.weather_code, place })
        setWeatherStatus('ready')
      } catch {
        setWeatherStatus('unavailable')
      }
    }, () => setWeatherStatus('unavailable'), { enableHighAccuracy: false, maximumAge: 15 * 60 * 1000, timeout: 10000 })
  }

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      setError(false)
      try {
        // Retry a failed/stale resource from the user gesture. This also keeps
        // mobile browsers happy when they deferred loading while off-screen.
        if (audio.error || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) audio.load()
        await audio.play()
      } catch {
        setPlaying(false)
        setError(true)
      }
    } else audio.pause()
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds))
    setTime(audio.currentTime)
  }

  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0

  // Follow the audio clock directly for a fluid seek bar without rerendering
  // the whole player on every animation frame.
  useEffect(() => {
    if (!playing) return
    let frame = 0
    let lastLabelUpdate = 0
    const sync = (now: number) => {
      const audio = audioRef.current
      if (!audio || audio.paused) return
      const nextProgress = audio.duration > 0 ? Math.min(100, (audio.currentTime / audio.duration) * 100) : 0
      if (rangeRef.current) rangeRef.current.value = String(audio.currentTime)
      rangeRef.current?.style.setProperty('--progress', `${nextProgress}%`)
      if (now - lastLabelUpdate > 250) {
        lastLabelUpdate = now
        setTime(audio.currentTime)
      }
      frame = requestAnimationFrame(sync)
    }
    frame = requestAnimationFrame(sync)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  return (
    <section className="recruiter-player" aria-label="Recruiter introduction audio player">
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onPlay={() => { setPlaying(true); setError(false) }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onCanPlay={() => setError(false)}
        onError={() => setError(true)}
      >
        <source src="/recruiter-intro.mp3" type="audio/mpeg" />
      </audio>
      <span className="recruiter-player-sticker recruiter-player-sticker-smile" aria-hidden="true">😎</span>

      <div className={`recruiter-album-art${playing ? ' is-playing' : ''}`} aria-label="Sharik avatar cover art">
        <div className="recruiter-art-main">
          <div className="recruiter-avatar-wrap">
            <button type="button" className="recruiter-art-avatar" aria-label="Say hello to Sharik" onClick={() => setGreetingIndex((current) => current === null ? 0 : (current + 1) % greetings.length)}>
              <Image src="/anime-avatar.png" alt="Anime avatar" fill sizes="(max-width: 639px) 104px, 132px" />
            </button>
            <span className="recruiter-avatar-doodle" aria-hidden="true">😊</span>
            <span className="recruiter-headphone-badge" aria-hidden="true">🎧</span>
          </div>
          <div className="recruiter-art-intro">
            <span className="recruiter-art-greeting" role={greetingIndex === null ? undefined : 'status'} aria-live={greetingIndex === null ? undefined : 'polite'}>
              {greetingIndex === null ? 'Hello — nice to meet you ✨' : greetings[greetingIndex]}
            </span>
            <button type="button" className="recruiter-art-hello" onClick={() => setGreetingIndex((current) => current === null ? 0 : (current + 1) % greetings.length)}>
              Say hello <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
        <aside className="recruiter-art-aside" aria-label="Local weather and decorative showpiece">
          <div className={`recruiter-weather${weather ? ' is-ready' : ''}`}>
            {weatherStatus === 'consent' || weatherStatus === 'unavailable' ? (
              <button type="button" className="recruiter-weather-enable" onClick={enableLocalWeather} aria-label="Enable local weather. Your location is sent to Open-Meteo for the forecast and OpenStreetMap to find the city name.">
                <span aria-hidden="true">☀️</span>
                <span>{weatherStatus === 'consent' ? 'LOCAL WEATHER' : 'RETRY WEATHER'}</span>
                <small>SHARE LOCATION TO VIEW</small>
              </button>
            ) : (
              <div className="recruiter-weather-live">
                <span className="recruiter-weather-sky" aria-hidden="true">{weather ? weatherLabel(weather.code)[0] : '…'}</span>
                <div className="recruiter-weather-copy">
                  <span className="recruiter-weather-reading">{weather ? `${weather.temperature}°` : '––°'}</span>
                  <span className="recruiter-weather-place">{weather?.place ?? 'LOCAL'}</span>
                  <span className="recruiter-weather-condition">{weather ? weatherLabel(weather.code)[1] : 'LOADING'}</span>
                </div>
                <span className="recruiter-weather-lines" aria-hidden="true"><i /><i /><i /></span>
                <span className="recruiter-weather-credit">OPEN-METEO · OSM</span>
              </div>
            )}
          </div>
          <div className="recruiter-showpiece">
            <time className="recruiter-clock-time" aria-label={`Local time ${localTime || 'loading'}`}>{localTime || '--:--'}</time>
          </div>
        </aside>
      </div>

      <div className="recruiter-player-console">
      <div className="recruiter-player-heading">
        <span className="recruiter-player-copy">
          <span className="recruiter-player-kicker"><Volume2 size={12} /> PERSONAL VOICE NOTE</span>
          <span className="recruiter-player-title">Meet Sharik · Intro</span>
        </span>
        <span className={`recruiter-wave${playing ? ' is-playing' : ''}`} aria-hidden="true">
          {bars.slice(0, 14).map((height, index) => <i key={index} style={{ '--bar-height': `${Math.max(8, height * 0.68)}px`, '--bar-delay': `${index * 45}ms` } as CSSProperties} />)}
        </span>
      </div>

      <div className="recruiter-player-progress">
        <input
          ref={rangeRef}
          type="range" min={0} max={duration || 0} step={0.1} value={Math.min(time, duration || time)}
          aria-label="Seek through the recruiter introduction"
          style={{ '--progress': `${progress}%` } as CSSProperties}
          onChange={(event) => {
            const next = Number(event.currentTarget.value)
            if (audioRef.current) audioRef.current.currentTime = next
            setTime(next)
          }}
        />
        <span className="recruiter-player-time" aria-live="off"><time>{formatTime(time)}</time><time>{formatTime(duration)}</time></span>
      </div>

      <div className="recruiter-player-controls">
        <button type="button" className="recruiter-control" aria-label="Back 10 seconds" onClick={() => skip(-10)}><Rewind size={17} /></button>
        <button type="button" className="recruiter-control recruiter-play" aria-label={playing ? 'Pause introduction' : 'Play introduction'} onClick={togglePlayback}>
          {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
        </button>
        <button type="button" className="recruiter-control" aria-label="Forward 10 seconds" onClick={() => skip(10)}><FastForward size={17} /></button>
        <button type="button" className={`recruiter-control recruiter-repeat${loop ? ' is-active' : ''}`} aria-label={loop ? 'Turn repeat off' : 'Repeat introduction'} aria-pressed={loop} onClick={() => {
          const next = !loop
          setLoop(next)
          if (audioRef.current) audioRef.current.loop = next
        }}><Repeat size={16} /></button>
      </div>
      {error && <p className="recruiter-player-error" role="status">Couldn’t play the voice note here. <a href="/recruiter-intro.mp3" download="Sharik-Intro.mp3">Download the audio</a>.</p>}
      </div>
    </section>
  )
}
