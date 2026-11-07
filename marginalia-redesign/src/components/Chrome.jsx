import { useEffect, useRef, useState } from 'react'

const sections = [
  ['home', 'Cover', 'home'], ['about', 'Hello', 'user'], ['education', 'Education', 'education'], ['experience', 'Experience', 'briefcase'],
  ['skills', 'Skills', 'layers'], ['projects', 'Projects', 'grid'], ['contact', 'Contact', 'mail'],
]

function NavIcon({ name }) {
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-7h5v7"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5.5 21c.8-4.2 3-6.3 6.5-6.3s5.7 2.1 6.5 6.3"/></>,
    education: <><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M6 11.2V17c3.6 2.4 8.4 2.4 12 0v-5.8"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

export function SiteChrome({ theme, onTheme }) {
  const [active, setActive] = useState('Cover')
  const [open, setOpen] = useState(true)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const lampStartY = useRef(null)
  const lampWasPulled = useRef(false)

  const handleLampPointerDown = event => {
    lampStartY.current = event.clientY
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleLampPointerUp = event => {
    const startY = lampStartY.current
    lampStartY.current = null
    if (startY !== null && event.clientY - startY > 12) {
      lampWasPulled.current = true
      onTheme()
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && setActive(entry.target.dataset.label || 'Cover')),
      { rootMargin: '-35% 0px -55%' },
    )
    sections.forEach(([id]) => {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header className="folio-header">
        <a className="header-year" href="#home">2026</a>
        <button className="index-button" onClick={() => setOpen(value => !value)} aria-expanded={open}>
          Curriculum Vitae <span>{open ? '−' : '+'}</span>
        </button>
        <button
          className={`header-voice ${playing ? 'is-playing' : ''}`}
          onClick={() => {
            const audio = audioRef.current
            if (!audio) return
            if (playing) audio.pause()
            else audio.play()
          }}
        >
          <i aria-hidden>{playing ? 'Ⅱ' : '▶'}</i>
          <span>voice note</span>
          <b aria-hidden><u /><u /><u /><u /></b>
        </button>
        <a className="header-person" href="#about"><i />Sharik Hussain <em>{active}</em></a>
        <audio ref={audioRef} src="/recruiter-intro.mp3" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      </header>
      <nav className={`folio-index ${open ? 'is-open' : ''}`} aria-label="Portfolio index">
        {sections.map(([id, label, icon], index) => (
          <a href={`#${id}`} key={id} aria-label={label} className={active === label ? 'is-active' : ''}>
            <b aria-hidden><NavIcon name={icon} /></b><span>{label}</span><small>{String(index + 1).padStart(2, '0')}</small>
          </a>
        ))}
      </nav>
      <button className={`lamp-toggle ${theme === 'light' ? 'is-lit' : ''}`} onPointerDown={handleLampPointerDown} onPointerUp={handleLampPointerUp} onPointerCancel={() => { lampStartY.current = null }} onClick={() => {
        if (lampWasPulled.current) {
          lampWasPulled.current = false
          return
        }
        onTheme()
      }} aria-label={`Pull down or click to switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
        <span className="lamp-cap" /><span className="lamp-bulb" /><span className="lamp-chain" /><span className="lamp-pull" />
      </button>
    </>
  )
}

export function Reveal({ children, className = '', ...props }) {
  return <div className={`reveal ${className}`} {...props}>{children}</div>
}

