'use client'

import { AudioLines, FastForward, Pause, Play, Repeat, Rewind } from 'lucide-react'
import { type CSSProperties, useRef, useState } from 'react'

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

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
      try {
        await audio.play()
      } catch {
        setError(true)
      }
    } else {
      audio.pause()
    }
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds))
    setTime(audio.currentTime)
  }

  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0

  return (
    <section className="recruiter-player" aria-label="Recruiter introduction voice note">
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

      <div className="recruiter-player-heading">
        <span className="recruiter-player-mark" aria-hidden="true"><AudioLines size={17} /></span>
        <span className="recruiter-player-copy">
          <span className="recruiter-player-kicker">VOICE NOTE · RECRUITER INTRO</span>
          <span className="recruiter-player-title">A quick introduction</span>
        </span>
        <span className={`recruiter-wave${playing ? ' is-playing' : ''}`} aria-hidden="true">
          {[10, 17, 12, 21, 14, 19, 9, 16, 12, 20, 10, 15].map((height, index) => <i key={index} style={{ '--bar-height': `${height}px`, '--bar-delay': `${index * 45}ms` } as CSSProperties} />)}
        </span>
      </div>

      <div className="recruiter-player-progress">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(time, duration || time)}
          aria-label="Seek through the recruiter introduction"
          style={{ '--progress': `${progress}%` } as CSSProperties}
          onChange={(event) => {
            const next = Number(event.currentTarget.value)
            if (audioRef.current) audioRef.current.currentTime = next
            setTime(next)
          }}
        />
        <span className="recruiter-player-time" aria-live="off">
          <time>{formatTime(time)}</time><time>{formatTime(duration)}</time>
        </span>
      </div>

      <div className="recruiter-player-controls">
        <button type="button" className="recruiter-control" aria-label="Back 10 seconds" onClick={() => skip(-10)}>
          <Rewind size={17} />
        </button>
        <button type="button" className="recruiter-control recruiter-play" aria-label={playing ? 'Pause introduction' : 'Play introduction'} onClick={togglePlayback}>
          {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
        </button>
        <button type="button" className="recruiter-control" aria-label="Forward 10 seconds" onClick={() => skip(10)}>
          <FastForward size={17} />
        </button>
        <button type="button" className={`recruiter-control recruiter-repeat${loop ? ' is-active' : ''}`} aria-label={loop ? 'Turn repeat off' : 'Repeat introduction'} aria-pressed={loop} onClick={() => {
          const next = !loop
          setLoop(next)
          if (audioRef.current) audioRef.current.loop = next
        }}>
          <Repeat size={16} />
        </button>
      </div>
      {error && <p className="recruiter-player-error" role="status">The voice note couldn’t be loaded. Please try again.</p>}
    </section>
  )
}
