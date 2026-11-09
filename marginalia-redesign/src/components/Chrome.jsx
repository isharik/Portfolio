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
  const [voiceOpen, setVoiceOpen] = useState(false)
  const audioRef = useRef(null)
  const lampSoundRef = useRef(null)
  const lampStartY = useRef(null)
  const lampWasPulled = useRef(false)

  const playLampSound = () => {
    const sound = lampSoundRef.current
    if (!sound) return
    sound.volume = .16
    sound.currentTime = 0
    sound.play().catch(() => {})
  }

  const handleLampPointerDown = event => {
    lampStartY.current = event.clientY
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleLampPointerUp = event => {
    const startY = lampStartY.current
    lampStartY.current = null
    if (startY !== null && event.clientY - startY > 12) {
      lampWasPulled.current = true
      playLampSound()
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

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key !== 'Escape' || !voiceOpen) return
      audioRef.current?.pause()
      setVoiceOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [voiceOpen])

  const openVoiceNote = () => {
    setVoiceOpen(true)
    const audio = audioRef.current
    if (!audio) return
    audio.play().catch(() => {})
  }

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  const dismissVoiceNote = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setVoiceOpen(false)
  }

  return (
    <>
      <header className="folio-header">
        <a className="header-year" href="#home">2026</a>
        <button className="index-button" onClick={() => setOpen(value => !value)} aria-expanded={open}>
          Curriculum Vitae <span>{open ? '−' : '+'}</span>
        </button>
        <div className="header-voice-wrap">
          <button className={`header-voice ${playing ? 'is-playing' : ''}`} onClick={openVoiceNote} aria-haspopup="dialog" aria-expanded={voiceOpen}>
            <i aria-hidden>{playing ? 'Ⅱ' : '▶'}</i>
            <span>voice note</span>
            <b aria-hidden><u /><u /><u /><u /></b>
          </button>
          {voiceOpen && (
            <section className={`voice-popover ${playing ? 'is-playing' : ''}`} role="dialog" aria-label="Personal voice note player">
              <div className="voice-vinyl" aria-hidden="true"><i /><b /></div>
              <div className="voice-popover-copy">
                <small>Personal voice note</small>
                <strong>Meet Sharik · Intro</strong>
                <span className="voice-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
              </div>
              <button className="voice-popover-play" onClick={togglePlayback} aria-label={playing ? 'Pause voice note' : 'Play voice note'}><span>{playing ? 'Ⅱ' : '▶'}</span></button>
              <button className="voice-popover-close" onClick={dismissVoiceNote} aria-label="Close voice note player">×</button>
            </section>
          )}
        </div>
        <a className="header-person" href="#about"><i />Sharik Hussain <em>{active}</em></a>
        <audio ref={audioRef} src="/recruiter-intro.mp3" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setVoiceOpen(false) }} />
        <audio ref={lampSoundRef} src="/sounds/theme-toggle.wav" preload="auto" />
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
        playLampSound()
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

