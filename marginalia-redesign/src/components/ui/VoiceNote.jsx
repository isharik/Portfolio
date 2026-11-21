import { useRef, useState } from 'react'

const glyphs = {
  play: <path d="m9 5 12 7-12 7z" fill="currentColor" stroke="none" />,
  pause: <path d="M9 5v14m6-14v14" strokeWidth="3" />,
  back: <path d="M6 9a7 7 0 1 1-1 7M6 4v5h5" />,
  forward: <path d="M18 9a7 7 0 1 0 1 7m-1-12v5h-5" />,
  repeat: <path d="M4 11V9a3 3 0 0 1 3-3h13m-3-3 3 3-3 3M20 13v2a3 3 0 0 1-3 3H4m3-3-3 3 3 3" />,
}

function Icon({ name }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{glyphs[name]}</svg>
}

function formatTime(seconds) {
  return [Math.floor(seconds / 60), Math.floor(seconds % 60)].map(value => String(value).padStart(2, '0')).join(':')
}

export default function VoiceNote() {
  const dialog = useRef(null)
  const audio = useRef(null)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [time, setTime] = useState(0)
  const [repeat, setRepeat] = useState(false)
  const [error, setError] = useState('')

  const play = () => audio.current.play().catch(() => setError('Playback unavailable. Try the play button.'))
  const seek = seconds => {
    audio.current.currentTime = Math.max(0, Math.min(duration, seconds))
    setTime(audio.current.currentTime)
  }

  return (
    <div className="header-voice-wrap">
      <button type="button" className={`header-voice ${playing ? 'is-playing' : ''}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => {
        dialog.current.showModal()
        setOpen(true)
        setError('')
        play()
      }}>
        <i aria-hidden="true">▶</i><span>voice note</span><b aria-hidden="true"><u /><u /><u /><u /></b>
      </button>
      <dialog ref={dialog} className="voice-note-dialog" aria-labelledby="voice-note-title" onClick={event => {
        if (event.target === event.currentTarget) dialog.current.close()
      }} onClose={() => {
        audio.current.pause()
        seek(0)
        setOpen(false)
      }}>
        <div className="voice-note-player">
          <button className="voice-note-close" type="button" onClick={() => dialog.current.close()} aria-label="Close voice note">×</button>
          <img className={`voice-note-art ${playing ? 'is-spinning' : ''}`} src="/profile-photo.webp" alt="Sharik Hussain" />
          <h2 id="voice-note-title">Meet Sharik</h2>
          <p>Sharik Hussain</p>
          <div className="voice-note-progress">
            <span>{formatTime(time)}</span>
            <input type="range" aria-label="Voice note playback position" min="0" max={duration || 1} step=".1" value={time} disabled={!duration}
              style={{ '--voice-progress': `${duration ? time / duration * 100 : 0}%` }} onChange={event => seek(Number(event.target.value))} />
            <span>{formatTime(duration)}</span>
          </div>
          <div className="voice-note-controls">
            <button type="button" aria-label="Go back 10 seconds" disabled={!duration} onClick={() => seek(time - 10)}><Icon name="back" /></button>
            <button type="button" className="voice-note-play" aria-label={playing ? 'Pause' : 'Play'} onClick={() => playing ? audio.current.pause() : play()}><Icon name={playing ? 'pause' : 'play'} /></button>
            <button type="button" aria-label="Go forward 10 seconds" disabled={!duration} onClick={() => seek(time + 10)}><Icon name="forward" /></button>
            <button type="button" aria-label="Repeat voice note" aria-pressed={repeat} onClick={() => setRepeat(value => !value)}><Icon name="repeat" /></button>
          </div>
          {error && <p role="status">{error}</p>}
          <audio ref={audio} src="/recruiter-intro.mp3" preload="metadata" loop={repeat}
            onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
            onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
            onPlay={() => { setPlaying(true); setError('') }}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)} />
        </div>
      </dialog>
    </div>
  )
}
