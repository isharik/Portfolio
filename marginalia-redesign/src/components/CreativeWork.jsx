import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../data'
import './creative-work.css'

const clips = [
  { title: 'First Transmission', file: 'first-transmission', duration: '0:58' },
  { title: 'A2A', file: 'pharos-a2a', duration: '0:40' },
  { title: 'Curve Volt Value', file: 'world-to-value', duration: '0:44' },
  { title: 'Human', file: 'human', duration: '0:47' },
  { title: 'The New Ledger', file: 'pharos-cinematic', duration: '0:25' },
  { title: 'Value, Unframed', file: 'pharos-value-unframed', duration: '0:22' },
]
const editingTools = [
  { name: 'Plotr', icon: 'plotr.jpg' },
  { name: 'Codex', icon: 'codex.svg' },
  { name: 'After Effects', icon: 'after-effects.svg' },
  { name: 'DaVinci Resolve', icon: 'davinci.svg' },
  { name: 'Filmora', icon: 'filmora.svg' },
  { name: 'Claude', icon: 'claude.svg' },
  { name: 'Photoshop', icon: 'photoshop.svg' },
  { name: 'HyperFrames', icon: 'hyperframes.svg' },
]

function CreativeClip({ clip, index, onSelect, duplicate = false }) {
  const video = useRef(null)
  const hovered = useRef(false)
  const [previewing, setPreviewing] = useState(false)
  const [audible, setAudible] = useState(false)

  useLayoutEffect(() => { if (video.current) video.current.muted = true }, [])

  const stopPreview = () => {
    hovered.current = false
    const player = video.current
    if (!player) return
    player.pause()
    player.currentTime = 0
    player.muted = true
    setPreviewing(false)
    setAudible(false)
  }

  const startPreview = event => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    hovered.current = true
    const player = video.current
    if (!player) return
    player.currentTime = 0
    player.volume = 0.1
    player.muted = false
    player.play().then(() => setAudible(!player.muted)).catch(() => {
      if (!hovered.current) return
      // Browsers may block audible autoplay before the first click. Keep the
      // visual preview available there; opening the film enables full audio.
      player.muted = true
      setAudible(false)
      player.play().catch(() => setPreviewing(false))
    })
  }

  const togglePreviewSound = () => {
    const player = video.current
    if (!player) return
    player.volume = 0.1
    player.muted = !player.muted
    setAudible(!player.muted)
    if (player.paused) {
      hovered.current = true
      player.play().catch(() => setPreviewing(false))
    }
  }

  return (
    <li className="creative-item" onPointerLeave={stopPreview}>
      <button type="button" className={`creative-cut ${previewing ? 'is-previewing' : ''}`}
        aria-haspopup="dialog" tabIndex={duplicate ? -1 : undefined}
        onPointerEnter={startPreview}
        onClick={() => { stopPreview(); onSelect(clip) }}>
        <span className="creative-preview">
          <img src={`/videos/${clip.file}.jpg`} alt="" width="640" height="360" loading="eager" decoding="async" />
          <video ref={video} src={`/videos/${clip.file}.mp4`} playsInline loop preload={duplicate ? 'none' : 'metadata'}
            poster={`/videos/${clip.file}.jpg`} aria-hidden="true" tabIndex={-1}
            onPlaying={event => { if (hovered.current) setPreviewing(true); else event.currentTarget.pause() }}
            onPause={() => setPreviewing(false)}
            onTimeUpdate={event => { if (event.currentTarget.currentTime >= 8) event.currentTarget.currentTime = 0 }} />
          <span className="creative-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 4.5v15L20 12z" /></svg></span>
          <span className="creative-preview-label" aria-hidden="true">Preview playing</span>
          <span className="creative-duration">{clip.duration}</span>
        </span>
        <span className="creative-caption">
          <span className="creative-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="creative-title">{clip.title}</span>
        </span>
      </button>
      <button type="button" className="creative-preview-sound" aria-label={audible ? `Mute ${clip.title} preview` : `Enable ${clip.title} preview sound`}
        aria-pressed={audible} tabIndex={duplicate ? -1 : undefined} onClick={togglePreviewSound}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4Z" />
          {audible ? <><path d="M16 9a4 4 0 0 1 0 6" /><path d="M18.5 6.5a8 8 0 0 1 0 11" /></> : <path d="m17 10 4 4m0-4-4 4" />}
        </svg>
      </button>
    </li>
  )
}

export default function CreativeWork() {
  const dialog = useRef(null)
  const loop = useRef(null)
  const navigationFrame = useRef(null)
  const [selected, setSelected] = useState(null)

  const moveFilm = direction => {
    const viewport = loop.current
    const track = viewport?.querySelector('.creative-track')
    const firstList = track?.querySelector('.creative-grid')
    const firstCard = firstList?.querySelector('.creative-item')
    if (!viewport || !track || !firstList || !firstCard) return
    const step = firstCard.getBoundingClientRect().width + parseFloat(getComputedStyle(firstList).gap || 0)
    const animation = track.getAnimations({ subtree: false })[0]
    if (!animation || window.matchMedia('(max-width: 640px), (prefers-reduced-motion: reduce)').matches) {
      viewport.scrollBy({ left: direction * step, behavior: 'smooth' })
      return
    }
    const duration = parseFloat(getComputedStyle(track).animationDuration) * 1000
    const phaseShift = direction * step / firstList.getBoundingClientRect().width * duration
    const burstDuration = 620
    const peakDelta = phaseShift * Math.PI / (2 * burstDuration)
    window.cancelAnimationFrame(navigationFrame.current)
    const start = performance.now()
    const glide = now => {
      const progress = Math.min((now - start) / burstDuration, 1)
      animation.playbackRate = 1 + peakDelta * Math.sin(progress * Math.PI)
      if (progress < 1) navigationFrame.current = window.requestAnimationFrame(glide)
      else navigationFrame.current = null
    }
    navigationFrame.current = window.requestAnimationFrame(glide)
  }

  useEffect(() => {
    const element = loop.current
    if (!element) return
    if (!('IntersectionObserver' in window)) {
      element.classList.add('is-in-view')
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      element.classList.toggle('is-in-view', entry.isIntersecting)
    }, { threshold: 0.05 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(navigationFrame.current)
      element.querySelector('.creative-track')?.getAnimations({ subtree: false })[0]?.updatePlaybackRate(1)
    }
  }, [])

  useLayoutEffect(() => {
    if (selected && !dialog.current.open) dialog.current.showModal()
  }, [selected])

  return (
    <section id="creative-work" className="sheet paper-sheet creative-work" aria-labelledby="creative-work-title">
      <header className="creative-heading">
        <h2 id="creative-work-title">Creative Work.</h2>
        <p className="scribble">Video editing, motion design, and visual storytelling.</p>
      </header>
      <div className="creative-loop" ref={loop}>
        <div className="creative-track">
          <ol className="creative-grid" aria-label="Selected video work">
            {clips.map((clip, index) => <CreativeClip key={clip.file} clip={clip} index={index} onSelect={setSelected} />)}
          </ol>
          <ol className="creative-grid creative-grid-clone" aria-hidden="true">
            {clips.map((clip, index) => <CreativeClip key={`${clip.file}-loop`} clip={clip} index={index} onSelect={setSelected} duplicate />)}
          </ol>
        </div>
      </div>
      <div className="creative-navigation" aria-label="Browse creative films">
        <button type="button" onClick={() => moveFilm(-1)} aria-label="Previous film">←</button>
        <span aria-hidden="true">explore the films</span>
        <button type="button" onClick={() => moveFilm(1)} aria-label="Next film">→</button>
      </div>
      <div className="creative-footer">
        <ul className="creative-tools" aria-label="Editing and creative tools">
          {editingTools.map(({ name, icon }) => (
            <li key={name} tabIndex={0} data-tool={name} aria-label={name}>
              <img src={`/images/creative-${icon}`} alt="" width="28" height="28" />
            </li>
          ))}
        </ul>
        <a className="creative-more" href={profile.socials.x} target="_blank" rel="noreferrer">More on X <span aria-hidden="true">↗</span></a>
      </div>
      <dialog ref={dialog} className="creative-dialog" aria-labelledby="creative-film-title" onClose={() => setSelected(null)}
        onClick={event => { if (event.target === event.currentTarget) dialog.current.close() }}>
        {selected && (
          <div className="creative-player">
            <header>
              <h3 id="creative-film-title">{selected.title}</h3>
              <button type="button" onClick={() => dialog.current.close()} aria-label="Close video">×</button>
            </header>
            <video controls controlsList="nodownload" playsInline autoPlay
              src={`/videos/${selected.file}.mp4`} poster={`/videos/${selected.file}.jpg`}
              aria-label={selected.title} onLoadedMetadata={event => { event.currentTarget.muted = false; event.currentTarget.volume = 1 }}
              onPlay={event => { event.currentTarget.muted = false; event.currentTarget.volume = 1 }}
              onContextMenu={event => event.preventDefault()} />
          </div>
        )}
      </dialog>
    </section>
  )
}
