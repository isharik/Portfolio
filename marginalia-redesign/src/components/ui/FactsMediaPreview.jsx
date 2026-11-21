import { useLayoutEffect, useRef, useState } from 'react'
import './facts-media-preview.css'

const musicPreviewSeconds = 11
const tonearmCueMs = 150

export function SpotifyMark({ size = 34 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="currentColor" />
    <path d="M6.2 9c4.5-1.2 8.3-.8 11.7 1.2M7 12.2c3.6-.9 6.9-.5 9.9 1.2M7.8 15.2c2.9-.6 5.5-.3 7.9 1" fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
}

function VinylPreview({ sample }) {
  const audioRef = useRef(null)
  const cueTimer = useRef(0)
  const [status, setStatus] = useState('ready')
  const playing = status === 'playing'
  const cued = playing || status === 'starting'

  useLayoutEffect(() => {
    const audio = audioRef.current
    return () => {
      window.clearTimeout(cueTimer.current)
      audio.pause()
    }
  }, [])

  function togglePlayback() {
    const audio = audioRef.current
    window.clearTimeout(cueTimer.current)
    if (cued) {
      audio.pause()
      setStatus('paused')
      return
    }
    if (status === 'complete') audio.currentTime = 0
    if (status === 'unavailable') audio.load()
    setStatus('starting')
    const animateCue = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    audio.muted = animateCue
    if (animateCue) {
      cueTimer.current = window.setTimeout(() => { audio.muted = false }, tonearmCueMs)
    }
    audio.play().catch(error => {
      if (error.name !== 'AbortError') setStatus('unavailable')
    })
  }

  function finishPreview(event) {
    const audio = event.currentTarget
    audio.pause()
    setStatus('complete')
  }

  const message = {
    starting: 'Starting preview…',
    playing: 'Playing preview',
    paused: 'Preview paused',
    ready: 'Ready to play',
    unavailable: 'The preview is unavailable here.',
    complete: 'Preview complete.',
  }[status]

  return (
    <>
      <div className={`facts-turntable${playing ? ' is-playing' : ''}${cued ? ' is-cued' : ''}`}
        style={{ '--facts-cue-time': `${tonearmCueMs}ms` }} aria-hidden="true">
        <span className="facts-deck-brand" />
        <div className="facts-platter" />
        <div className="facts-record-drop">
          <div className="facts-record">
            <img className="facts-record-surface" src="/images/beyond-vinyl-record.webp" alt="" width="768" height="768" />
            <img className="facts-record-label" src={sample.image} alt="" />
            <i />
          </div>
        </div>
        <div className="facts-tonearm">
          <svg viewBox="0 0 28 108">
            <path d="M23 8v49c0 15-4 21-15 29l-3 8" fill="none" stroke="#c5c7cb" strokeWidth="3.5" />
            <path d="M23 9v48c0 15-4 21-15 29l-3 8" fill="none" stroke="#ececef" strokeWidth="1" />
            <circle cx="23" cy="8" r="6" fill="#26272b" stroke="#a7a8af" strokeWidth="1.5" />
            <path d="m2 91 8 4-4 10-5-3z" fill="#292a2f" stroke="#a7a8af" />
            <path d="m2 103-1 4" stroke="#fff" />
          </svg>
        </div>
        <div className="facts-deck-pitch"><i /></div>
      </div>
      <div className="facts-preview-controls">
        <div className="facts-vinyl-transport">
          <button type="button" className="facts-vinyl-action" data-cue={!cued} onClick={togglePlayback}
            aria-label={status === 'complete' ? 'Replay preview' : cued ? 'Pause preview' : 'Play preview'}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path fill="currentColor" d={cued ? 'M7 5h4v14H7zm6 0h4v14h-4z' : 'M8 5v14l11-7z'} />
            </svg>
          </button>
          <p className="facts-preview-status" role="status">{message}</p>
        </div>
        <a className="facts-preview-source facts-vinyl-source" href={sample.href} target="_blank" rel="noreferrer">
          <SpotifyMark size={16} /> <span>Full track on Spotify</span> <span aria-hidden="true">↗</span>
        </a>
      </div>
      <audio ref={audioRef} src={`https://p.scdn.co/mp3-preview/${sample.previewId}`} preload="auto"
        onPlaying={() => setStatus('playing')}
        onWaiting={event => { if (!event.currentTarget.paused) setStatus('starting') }}
        onPause={() => setStatus(current => current === 'complete' || current === 'unavailable' ? current : 'paused')}
        onTimeUpdate={event => {
          if (!event.currentTarget.paused && event.currentTarget.currentTime >= musicPreviewSeconds) finishPreview(event)
        }}
        onEnded={finishPreview}
        onError={() => setStatus('unavailable')} />
    </>
  )
}

export default function FactsMediaPreview({ sample, onClose }) {
  const dialog = useRef(null)
  const [photoIndex, setPhotoIndex] = useState(0)
  const music = Boolean(sample.track)
  const title = sample.track || sample.label
  const photos = sample.photos ?? []
  const photo = photos[photoIndex]
  const movePhoto = direction => setPhotoIndex(index => Math.min(photos.length - 1, Math.max(0, index + direction)))

  useLayoutEffect(() => {
    dialog.current.showModal()
  }, [])

  return (
    <dialog ref={dialog} className={`facts-preview-dialog${music ? ' is-vinyl' : ''}`}
      aria-labelledby="facts-preview-title" onClose={onClose}
      onKeyDown={event => {
        if (photos.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
          event.preventDefault()
          movePhoto(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
      onClick={event => {
        event.stopPropagation()
        if (event.target === event.currentTarget) dialog.current.close()
      }}>
      <section className="facts-preview-body">
        <header>
          <div>
            {music && <p>{sample.label}</p>}
            {sample.videoId && <p>Gaming · 8-second preview</p>}
            <h3 id="facts-preview-title">{title}</h3>
          </div>
          <button className="facts-preview-close" type="button" onClick={() => dialog.current.close()} aria-label="Close preview">×</button>
        </header>
        {photo && (
          <div className="facts-photo-stage">
            <img src={photo} alt={photos.length > 1 ? `${title}, photo ${photoIndex + 1} of ${photos.length}` : title} />
          </div>
        )}
        {music && <VinylPreview sample={sample} />}
        {sample.videoId && (
          <iframe className="facts-video-preview" title={`${title} preview`}
              src={`https://www.youtube-nocookie.com/embed/${sample.videoId}?autoplay=1&playsinline=1&end=8`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        )}
        {sample.videoId && (
          <a className="facts-preview-source" href={sample.href} target="_blank" rel="noreferrer">
            Full video on YouTube <span aria-hidden="true">↗</span>
          </a>
        )}
        {photos.length > 1 && (
          <div className="facts-preview-pagination" role="group" aria-label="Browse photos">
            <button type="button" onClick={() => movePhoto(-1)} aria-disabled={photoIndex === 0} aria-label="Previous photo">←</button>
            <span role="status">{photoIndex + 1} / {photos.length}</span>
            <button type="button" onClick={() => movePhoto(1)} aria-disabled={photoIndex === photos.length - 1} aria-label="Next photo">→</button>
          </div>
        )}
      </section>
    </dialog>
  )
}
