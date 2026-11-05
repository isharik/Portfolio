'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { FastForward, Pause, Play, Repeat, Rewind, Volume2, X } from 'lucide-react'
import Image from 'next/image'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

const bars = [12, 20, 15, 26, 18, 32, 22, 15, 27, 36, 21, 30, 16, 25, 34, 18, 28, 14]

export default function RecruiterIntroPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const rangeRef = useRef<HTMLInputElement>(null)
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loop, setLoop] = useState(false)
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
      setExpanded(false)
    }
  }

  const dismissPlayer = () => {
    audioRef.current?.pause()
    setExpanded(false)
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds))
    setTime(audio.currentTime)
  }

  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0

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
    <section className="recruiter-player" data-sound="player" aria-label="Recruiter introduction audio player">
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onPlay={() => { setPlaying(true); setExpanded(true); setError(false) }}
        onPause={() => { setPlaying(false); setExpanded(false) }}
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
          <span className="recruiter-player-kicker">PERSONAL VOICE NOTE</span>
          <time className="recruiter-listen-duration" aria-label={`Clip duration ${formatTime(duration)}`}>{duration > 0 ? formatTime(duration) : '—:—'}</time>
          <button type="button" className="recruiter-listen-button" onClick={togglePlayback} aria-expanded={expanded} aria-label={playing ? 'Pause voice note' : 'Listen to voice note'}>
            {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}<span>{playing ? 'Pause' : 'Listen'}</span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div className="recruiter-expanded-controls" initial={{ height: 0, opacity: 0, y: -4 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -3 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
              <div className="recruiter-expanded-topline">
                <span className={`recruiter-wave${playing ? ' is-playing' : ''}`} aria-label={playing ? 'Audio playing' : 'Audio paused'} role="img">
                  {bars.map((height, index) => <i key={index} style={{ '--bar-height': `${Math.max(8, height * 0.68)}px`, '--bar-delay': `${index * 45}ms` } as CSSProperties} />)}
                </span>
                <button type="button" className="recruiter-dismiss" onClick={dismissPlayer} aria-label="Close audio player"><X size={15} /></button>
              </div>
              <div className="recruiter-player-progress">
                <input ref={rangeRef} type="range" min={0} max={duration || 0} step={0.1} value={Math.min(time, duration || time)} aria-label="Seek through the recruiter introduction" style={{ '--progress': `${progress}%` } as CSSProperties} onChange={(event) => {
                  const next = Number(event.currentTarget.value)
                  if (audioRef.current) audioRef.current.currentTime = next
                  setTime(next)
                }} />
                <span className="recruiter-player-time" aria-live="off"><time>{formatTime(time)}</time><time>{formatTime(duration)}</time></span>
              </div>
              <div className="recruiter-player-controls">
                <button type="button" className="recruiter-control" aria-label="Back 10 seconds" onClick={() => skip(-10)}><Rewind size={17} /></button>
                <button type="button" className="recruiter-control recruiter-play" aria-label={playing ? 'Pause introduction' : 'Play introduction'} onClick={togglePlayback}>{playing ? <Pause size={21} fill="currentColor" /> : <Play size={21} fill="currentColor" />}</button>
                <button type="button" className="recruiter-control" aria-label="Forward 10 seconds" onClick={() => skip(10)}><FastForward size={17} /></button>
                <button type="button" className={`recruiter-control recruiter-repeat${loop ? ' is-active' : ''}`} aria-label={loop ? 'Turn repeat off' : 'Repeat introduction'} aria-pressed={loop} onClick={() => {
                  const next = !loop
                  setLoop(next)
                  if (audioRef.current) audioRef.current.loop = next
                }}><Repeat size={16} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {error && <p className="recruiter-player-error" role="status">Couldn’t play the voice note here. <a href="/recruiter-intro.mp3" download="Sharik-Intro.mp3">Download the audio</a>.</p>}
      </div>
    </section>
  )
}
