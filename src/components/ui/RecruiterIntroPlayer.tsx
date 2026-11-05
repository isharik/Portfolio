'use client'

import { Pause, Play, Volume2, X } from 'lucide-react'
import Image from 'next/image'
import { type CSSProperties, useRef, useState } from 'react'

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

const bars = [12, 20, 15, 26, 18, 32, 22, 15, 27, 36, 21, 30, 16, 25, 34, 18, 28, 14]

export default function RecruiterIntroPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      setError(false)
      setExpanded(true)
      try {
        if (audio.error || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) audio.load()
        await audio.play()
      } catch {
        setPlaying(false)
        setExpanded(false)
        setError(true)
      }
    } else {
      audio.pause()
    }
  }

  const dismissPlayer = () => {
    audioRef.current?.pause()
    setExpanded(false)
  }

  return (
    <section className="recruiter-player" data-sound="player" aria-label="Recruiter introduction audio player">
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onPlay={() => { setPlaying(true); setExpanded(true); setError(false) }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setExpanded(false) }}
        onCanPlay={() => setError(false)}
        onError={() => setError(true)}
      >
        <source src="/recruiter-intro.mp3" type="audio/mpeg" />
      </audio>

      <div className="recruiter-profile-panel">
        <div className="recruiter-photo-frame">
          <Image src="/profile-photo.webp" alt="Sharik Hussain" fill priority sizes="(max-width: 639px) 78vw, 390px" className="recruiter-profile-photo" />
          <div className="recruiter-profile-shade" aria-hidden="true" />
          <div className="recruiter-profile-copy">
            <span className="recruiter-availability"><i /> Available</span>
            <div><strong>Sharik Hussain</strong><span>Customer Support · Content · AI</span></div>
          </div>
        </div>
      </div>

      <div className="recruiter-player-console">
        <div className="recruiter-listen-row">
          <span className="recruiter-listen-icon" aria-hidden="true"><Volume2 size={19} strokeWidth={1.6} /></span>
          <span className="recruiter-note-status">
            {expanded ? (
              <span className={`recruiter-wave recruiter-wave-inline${playing ? ' is-playing' : ''}`} aria-label={playing ? 'Audio playing' : 'Audio paused'} role="img">
                {bars.map((height, index) => <i key={index} style={{ '--bar-height': `${Math.max(8, height * 0.62)}px`, '--bar-delay': `${index * 45}ms` } as CSSProperties} />)}
              </span>
            ) : <span className="recruiter-player-kicker">PERSONAL VOICE NOTE</span>}
          </span>
          {!expanded && <time className="recruiter-listen-duration" aria-label={`Clip duration ${formatTime(duration)}`}>{duration > 0 ? formatTime(duration) : '—:—'}</time>}
          <span className="recruiter-inline-actions">
            <button type="button" className="recruiter-listen-button" onClick={togglePlayback} aria-expanded={expanded} aria-label={playing ? 'Pause voice note' : 'Play voice note'}>
              {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}<span>{expanded ? (playing ? 'Pause' : 'Play') : 'Listen'}</span>
            </button>
            {expanded && <button type="button" className="recruiter-dismiss" onClick={dismissPlayer} aria-label="Close audio player"><X size={15} /></button>}
          </span>
        </div>
        {error && <p className="recruiter-player-error" role="status">Couldn’t play the voice note here. <a href="/recruiter-intro.mp3" download="Sharik-Intro.mp3">Download the audio</a>.</p>}
      </div>
    </section>
  )
}
