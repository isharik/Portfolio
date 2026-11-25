import { useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../data'
import './creative-work.css'

const clips = [
  { title: 'Pharos Network', file: 'pharos-direct-transition', duration: '1:04' },
  { title: 'A2A', file: 'pharos-a2a', duration: '0:40' },
  { title: 'Curve Volt Value', file: 'world-to-value', duration: '0:44' },
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

function CreativeClip({ clip, index, onSelect }) {
  const video = useRef(null)
  const hovered = useRef(false)
  const [previewing, setPreviewing] = useState(false)

  const stopPreview = () => {
    hovered.current = false
    const player = video.current
    if (!player) return
    player.pause()
    player.currentTime = 0
    setPreviewing(false)
  }

  const startPreview = event => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    hovered.current = true
    const player = video.current
    if (!player) return
    player.currentTime = 0
    player.play().catch(() => setPreviewing(false))
  }

  return (
    <li>
      <button type="button" className={`creative-cut ${previewing ? 'is-previewing' : ''}`}
        aria-haspopup="dialog" onPointerEnter={startPreview} onPointerLeave={stopPreview}
        onClick={() => { stopPreview(); onSelect(clip) }}>
        <span className="creative-preview">
          <img src={`/videos/${clip.file}.jpg`} alt="" width="640" height="360" loading="lazy" decoding="async" />
          <video ref={video} src={`/videos/${clip.file}.mp4`} muted playsInline loop preload="metadata"
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
    </li>
  )
}

export default function CreativeWork() {
  const dialog = useRef(null)
  const [selected, setSelected] = useState(null)

  useLayoutEffect(() => {
    if (selected && !dialog.current.open) dialog.current.showModal()
  }, [selected])

  return (
    <section id="creative-work" className="sheet paper-sheet creative-work" aria-labelledby="creative-work-title">
      <header className="creative-heading">
        <h2 id="creative-work-title">Creative Work.</h2>
        <p className="scribble">Video editing, motion design, and visual storytelling.</p>
      </header>
      <ol className="creative-grid" aria-label="Selected video work">
        {clips.map((clip, index) => <CreativeClip key={clip.file} clip={clip} index={index} onSelect={setSelected} />)}
      </ol>
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
              aria-label={selected.title} onContextMenu={event => event.preventDefault()} />
          </div>
        )}
      </dialog>
    </section>
  )
}
