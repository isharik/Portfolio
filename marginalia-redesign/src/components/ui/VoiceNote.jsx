import { useRef, useState } from 'react'

const glyphs = {
  play: <path d="m8 5 11 7-11 7z" />,
  pause: <path d="M9 6v12m6-12v12" />,
  restart: <path d="M5 6v12m13-12-9 6 9 6z" />,
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
      <button type="button" className={`hello-voice-card ${playing ? 'is-playing' : ''}`} aria-label="Play voice note" aria-haspopup="dialog" aria-expanded={open} onClick={() => {
        dialog.current.showModal()
        setOpen(true)
        setError('')
        play()
      }}>
        <span className="hello-voice-record" aria-hidden="true"><img src="/images/voice-vinyl.png" alt="" /></span>
        <span className="hello-voice-copy"><strong>Listen to Sharik</strong><small>00:40 · voice note</small></span>
        <span className="hello-voice-action" aria-hidden="true"><Icon name="play" /></span>
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
          <img className={`voice-note-art ${playing ? 'is-spinning' : ''}`} src="/images/voice-vinyl.png" alt="Black vinyl record" width="720" height="720" />
          <h2 id="voice-note-title">Meet Sharik</h2>
          <p>Sharik Hussain</p>
          <div className="voice-note-progress">
            <span>{formatTime(time)}</span>
            <input type="range" aria-label="Voice note playback position" min="0" max={duration || 1} step=".1" value={time} disabled={!duration}
              style={{ '--voice-progress': `${duration ? time / duration * 100 : 0}%` }} onChange={event => seek(Number(event.target.value))} />
            <span>{formatTime(duration)}</span>
          </div>
          <div className="voice-note-controls">
            <button type="button" aria-label="Restart voice note" disabled={!duration} onClick={() => seek(0)}><Icon name="restart" /></button>
            <button type="button" aria-label="Go back 10 seconds" disabled={!duration} onClick={() => seek(time - 10)}><Icon name="back" /></button>
            <button type="button" className={`voice-note-play ${playing ? 'is-pause' : 'is-play'}`} aria-label={playing ? 'Pause' : 'Play'} onClick={() => playing ? audio.current.pause() : play()}><Icon name={playing ? 'pause' : 'play'} /></button>
            <button type="button" aria-label="Go forward 10 seconds" disabled={!duration} onClick={() => seek(time + 10)}><Icon name="forward" /></button>
            <button type="button" aria-label="Repeat voice note" aria-pressed={repeat} onClick={() => setRepeat(value => !value)}><Icon name="repeat" /></button>
          </div>
          {error && <p role="status">{error}</p>}
          <audio ref={audio} src="/recruiter-intro.wav" preload="metadata" loop={repeat}
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
