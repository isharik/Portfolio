'use client'

import { FastForward, Pause, Play, Repeat, Rewind, Volume2 } from 'lucide-react'
import { type CSSProperties, useRef, useState } from 'react'

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

const bars = [12, 20, 15, 26, 18, 32, 22, 15, 27, 36, 21, 30, 16, 25, 34, 18, 28, 14, 24, 32, 18, 27, 15, 22, 30, 17]

export default function RecruiterIntroPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loop, setLoop] = useState(false)
  const [error, setError] = useState(false)

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try { await audio.play() } catch { setError(true) }
    } else audio.pause()
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds))
    setTime(audio.currentTime)
  }

  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0

  return (
    <section className="recruiter-player" aria-label="Recruiter introduction audio player">
      <audio
        ref={audioRef}
        src="/recruiter-intro.mp3"
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onPlay={() => { setPlaying(true); setError(false) }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      />

      <div className={`recruiter-album-art${playing ? ' is-playing' : ''}`} aria-label="Abstract Sharik voice note cover art">
        <div className="recruiter-art-orbit recruiter-art-orbit-one" />
        <div className="recruiter-art-orbit recruiter-art-orbit-two" />
        <div className="recruiter-art-disc"><span>S</span></div>
        <div className="recruiter-art-copy"><span>SHARIK HUSSAIN</span><strong>VOICE<br />INTRO</strong></div>
        <div className="recruiter-art-bars" aria-hidden="true">{bars.slice(0, 16).map((height, index) => <i key={index} style={{ '--bar-height': `${height}px`, '--bar-delay': `${index * 32}ms` } as CSSProperties} />)}</div>
        <span className="recruiter-art-index">01 — 01</span>
      </div>

      <div className="recruiter-player-heading">
        <span className="recruiter-player-copy">
          <span className="recruiter-player-kicker"><Volume2 size={12} /> VOICE NOTE · RECRUITER INTRO</span>
          <span className="recruiter-player-title">A quick introduction</span>
        </span>
        <span className={`recruiter-wave${playing ? ' is-playing' : ''}`} aria-hidden="true">
          {bars.slice(0, 10).map((height, index) => <i key={index} style={{ '--bar-height': `${Math.max(8, height * 0.48)}px`, '--bar-delay': `${index * 45}ms` } as CSSProperties} />)}
        </span>
      </div>

      <div className="recruiter-player-progress">
        <input
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
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        <button type="button" className="recruiter-control" aria-label="Forward 10 seconds" onClick={() => skip(10)}><FastForward size={17} /></button>
        <button type="button" className={`recruiter-control recruiter-repeat${loop ? ' is-active' : ''}`} aria-label={loop ? 'Turn repeat off' : 'Repeat introduction'} aria-pressed={loop} onClick={() => {
          const next = !loop
          setLoop(next)
          if (audioRef.current) audioRef.current.loop = next
        }}><Repeat size={16} /></button>
      </div>
      {error && <p className="recruiter-player-error" role="status">The voice note couldn’t be loaded. Please try again.</p>}
    </section>
  )
}
