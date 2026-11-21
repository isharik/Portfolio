import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal } from './Chrome'
import { profile } from '../data'
import './creative-work.css'

const clips = [
  { title: 'Pharos — Direct Transition', file: 'pharos-direct-transition', duration: '1:04' },
  { title: 'Pharos A2A', file: 'pharos-a2a', duration: '0:40' },
  { title: 'World to Value', file: 'world-to-value', duration: '0:44' },
]
const editingTools = ['Plotr', 'Codex', 'After Effects', 'DaVinci Resolve', 'Filmora']
const backgroundMarks = ['after-effects', 'davinci', 'filmora']

function centerOf(element) {
  const { left, width } = element.getBoundingClientRect()
  return left + width / 2
}

export default function CreativeWork() {
  const section = useRef(null)
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const activeIndex = useRef(0)

  function updateActive() {
    const row = track.current
    const center = centerOf(row)
    const distances = Array.from(row.children, slide => Math.abs(centerOf(slide) - center))
    const next = distances.indexOf(Math.min(...distances))
    if (next !== activeIndex.current) {
      row.children[activeIndex.current]?.querySelector('video')?.pause()
      activeIndex.current = next
      setActive(next)
    }
  }

  const goTo = useCallback(index => {
    const row = track.current
    const slide = row.children[index]
    if (!slide) return

    row.scrollBy({
      left: centerOf(slide) - centerOf(row),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }, [])

  useEffect(() => {
    const node = section.current
    const desktop = window.matchMedia('(min-width: 761px) and (pointer: fine)')
    let lockUntil = 0
    const onWheel = event => {
      if (!desktop.matches || event.ctrlKey || Math.abs(event.deltaY) < 5 || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return
      const bounds = node.getBoundingClientRect()
      if (bounds.top > innerHeight * .6 || bounds.bottom < innerHeight * .4) return

      const now = performance.now()
      if (now < lockUntil) {
        event.preventDefault()
        return
      }
      const next = activeIndex.current + Math.sign(event.deltaY)
      if (next < 0 || next >= clips.length) return
      event.preventDefault()
      lockUntil = now + 480
      goTo(next)
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [goTo])

  return (
    <section ref={section} id="creative-work" className="sheet paper-sheet creative-work" aria-labelledby="creative-work-title">
      <div className="creative-tool-backdrop" aria-hidden="true">
        {backgroundMarks.map(mark => <img key={mark} src={`/images/creative-${mark}.svg`} alt="" loading="lazy" />)}
      </div>
      <Reveal className="projects-heading creative-heading">
        <h2 id="creative-work-title">Creative Work.</h2>
        <div className="ink-underline short" aria-hidden="true" />
        <span className="scribble">my creative side, in motion</span>
        <p>Video editing and content, from the first storyboard to the final cut. I use sound, pacing, and motion to make complex ideas easier to follow.</p>
        <ul className="creative-tools" aria-label="Editing and creative tools">
          {editingTools.map(tool => <li key={tool}>{tool}</li>)}
        </ul>
      </Reveal>
      <div className="creative-gallery" role="region" aria-roledescription="carousel" aria-label="Selected video work">
        <div className="creative-track" id="creative-track" ref={track} onScroll={updateActive} tabIndex={0} aria-label="Scroll to browse video work">
          {clips.map((clip, index) => (
            <article key={clip.file} className={`creative-slide${index === active ? ' is-current' : ''}`}>
              <div className="creative-card">
                <div className="creative-preview">
                  <video controls controlsList="nodownload" playsInline preload="none"
                    src={`/videos/${clip.file}.mp4`} poster={`/videos/${clip.file}.jpg`} aria-label={clip.title}
                    onContextMenu={event => event.preventDefault()} onPlay={event => {
                    track.current.querySelectorAll('video').forEach(video => {
                      if (video !== event.currentTarget) video.pause()
                    })
                  }} />
                </div>
                <div className="creative-caption">
                  <h3>{clip.title}</h3>
                  <span>{clip.duration}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="creative-controls">
          <button type="button" aria-controls="creative-track" aria-label="Previous video" disabled={active === 0} onClick={() => goTo(active - 1)}>←</button>
          <span aria-live="polite" aria-atomic="true">{active + 1} / {clips.length}</span>
          <button type="button" aria-controls="creative-track" aria-label="Next video" disabled={active === clips.length - 1} onClick={() => goTo(active + 1)}>→</button>
        </div>
        <a className="creative-more" href={profile.socials.x} target="_blank" rel="noreferrer">More on X <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  )
}
