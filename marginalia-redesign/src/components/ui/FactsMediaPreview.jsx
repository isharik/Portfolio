import { useLayoutEffect, useRef, useState } from 'react'
import './facts-media-preview.css'

const musicPreviewSeconds = 11

export function SpotifyMark({ size = 34 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="currentColor" />
    <path d="M6.2 9c4.5-1.2 8.3-.8 11.7 1.2M7 12.2c3.6-.9 6.9-.5 9.9 1.2M7.8 15.2c2.9-.6 5.5-.3 7.9 1" fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
}

function VinylPreview({ sample }) {
  const audioRef = useRef(null)
  const [status, setStatus] = useState('ready')
  const playing = status === 'playing'
  const cued = playing || status === 'starting'

  useLayoutEffect(() => {
    const audio = audioRef.current
    return () => audio.pause()
  }, [])

  function togglePlayback() {
    const audio = audioRef.current
    if (cued) {
      audio.pause()
      setStatus('paused')
      return
    }
    if (status === 'complete') audio.currentTime = 0
    if (status === 'unavailable') audio.load()
    setStatus('starting')
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
      <div className={`facts-turntable${playing ? ' is-playing' : ''}${cued ? ' is-cued' : ''}`} aria-hidden="true">
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

export default function FactsMediaPreview({ sample, onClose, gallery }) {
  const dialog = useRef(null)
  const music = Boolean(sample.track)
  const title = sample.track || sample.label
  const hasPrevious = gallery?.index > 0
  const hasNext = gallery?.index < gallery?.count - 1
  const instagramPath = gallery && new URL(sample.href).pathname.match(/\/(?:p|reel)\/[^/]+/)?.[0]

  useLayoutEffect(() => {
    dialog.current.showModal()
  }, [])

  return (
    <dialog ref={dialog} className={`facts-preview-dialog${music ? ' is-vinyl' : ''}`}
      aria-labelledby="facts-preview-title" onClose={onClose}
      onKeyDown={event => {
        if (!gallery) return
        if (event.key === 'ArrowLeft' && hasPrevious) {
          event.preventDefault()
          gallery.onNavigate(-1)
        }
        if (event.key === 'ArrowRight' && hasNext) {
          event.preventDefault()
          gallery.onNavigate(1)
        }
      }}
      onClick={event => {
        event.stopPropagation()
        if (event.target === event.currentTarget) dialog.current.close()
      }}>
      <section className="facts-preview-body">
        <header>
          <div>
            <p>{gallery ? 'Instagram' : music ? `${sample.label} · 11-second preview` : 'Gaming · 8-second preview'}</p>
            <h3 id="facts-preview-title">{title}</h3>
          </div>
          <button className="facts-preview-close" type="button" onClick={() => dialog.current.close()} aria-label="Close preview">×</button>
        </header>
        {instagramPath && (
          <iframe key={instagramPath} className="facts-instagram-preview" title={`${title} on Instagram`}
            src={`https://www.instagram.com${instagramPath}/embed/captioned/`}
            allow="encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        )}
        {music && <VinylPreview sample={sample} />}
        {sample.videoId && (
          <iframe className="facts-video-preview" title={`${title} preview`}
              src={`https://www.youtube-nocookie.com/embed/${sample.videoId}?autoplay=1&playsinline=1&end=8`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        )}
        {!music && <footer className="facts-preview-footer">
          <a className="facts-preview-source" href={sample.href} target="_blank" rel="noreferrer">
            {gallery ? 'Open post on Instagram' : 'Full video on YouTube'} <span aria-hidden="true">↗</span>
          </a>
          {gallery && (
            <div className="facts-preview-pagination" aria-label="Browse posts">
              <button type="button" onClick={() => gallery.onNavigate(-1)} disabled={!hasPrevious} aria-label="Previous post">←</button>
              <span role="status">{gallery.index + 1} / {gallery.count}</span>
              <button type="button" onClick={() => gallery.onNavigate(1)} disabled={!hasNext} aria-label="Next post">→</button>
            </div>
          )}
        </footer>}
      </section>
    </dialog>
  )
}
