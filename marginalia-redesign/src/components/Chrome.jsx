import { useEffect, useRef, useState } from 'react'

const sections = [
  ['home', 'Cover', 'home'], ['about', 'Hello', 'user'], ['education', 'Education', 'education'], ['experience', 'Experience', 'briefcase'],
  ['skills', 'Skills', 'layers'], ['projects', 'Projects', 'grid'], ['creative-work', 'Creative Work', 'play'], ['beyond-cv', 'Beyond the CV', 'spark'], ['contact', 'Contact', 'mail'],
]

function NavIcon({ name }) {
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-7h5v7"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5.5 21c.8-4.2 3-6.3 6.5-6.3s5.7 2.1 6.5 6.3"/></>,
    education: <><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M6 11.2V17c3.6 2.4 8.4 2.4 12 0v-5.8"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    play: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 9 5 3-5 3V9Z"/></>,
    spark: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

export function SiteChrome({ theme, onTheme }) {
  const [active, setActive] = useState('Cover')
  const [open, setOpen] = useState(true)
  const [isScrolledAway, setIsScrolledAway] = useState(false)
  const [isPeekOpen, setIsPeekOpen] = useState(false)
  const lampSoundRef = useRef(null)
  const lampStartY = useRef(null)
  const lampWasPulled = useRef(false)
  const sectionScroll = useRef(0)

  const keepIndexOpenWhileScrolling = () => {
    window.clearTimeout(sectionScroll.current)
    sectionScroll.current = window.setTimeout(() => { sectionScroll.current = 0 }, 180)
  }

  const followSectionLink = (event, label) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    setActive(label)
    setIsScrolledAway(false)
    setIsPeekOpen(false)
    keepIndexOpenWhileScrolling()
  }

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
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      entries => {
        if (sectionScroll.current) return
        const visible = entries.find(entry => entry.isIntersecting)
        if (visible) setActive(visible.target.dataset.label || 'Cover')
      },
      { rootMargin: '-35% 0px -55%' },
    )
    sections.forEach(([id]) => {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let previousY = window.scrollY
    let frame = 0
    const updateVisibility = () => {
      const currentY = window.scrollY
      const delta = currentY - previousY
      if (sectionScroll.current) {
        keepIndexOpenWhileScrolling()
      } else if (currentY < 72 || delta < -4) {
        setIsScrolledAway(false)
        setIsPeekOpen(false)
      } else if (delta > 4 && currentY > 120) {
        setIsScrolledAway(true)
        setIsPeekOpen(false)
      }
      previousY = currentY
      frame = 0
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateVisibility)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(sectionScroll.current)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])


  const isDormant = isScrolledAway && !isPeekOpen

  return (
    <>
      <button
        className={`cv-peek ${isScrolledAway ? 'is-visible' : ''} ${isPeekOpen ? 'is-awake' : ''}`}
        onPointerEnter={() => setIsPeekOpen(true)}
        onFocus={() => setIsPeekOpen(true)}
        onClick={() => { setIsPeekOpen(true); setOpen(true) }}
        aria-label="Reveal portfolio navigation"
      >
        <span aria-hidden="true">SH</span><b>Sharik Hussain</b>
      </button>
      <header className={`folio-header ${isDormant ? 'is-dormant' : ''} ${isPeekOpen ? 'is-peek-open' : ''}`} onPointerLeave={() => { if (isScrolledAway) setIsPeekOpen(false) }}>
        <a className="header-year" href="#home">2026</a>
        <button className="index-button" onClick={() => setOpen(value => !value)} aria-expanded={open}>
          Curriculum Vitae <span>{open ? '−' : '+'}</span>
        </button>
        <a className="header-person" href="#about"><i />Sharik Hussain <em>{active}</em></a>
        <audio ref={lampSoundRef} src="/sounds/theme-toggle.wav" preload="auto" />
      </header>
      <nav className={`folio-index ${open && !isDormant ? 'is-open' : ''}`} inert={!open || isDormant} aria-label="Portfolio index">
        {sections.map(([id, label, icon]) => (
          <a href={`#${id}`} key={id} aria-label={label} aria-current={active === label ? 'location' : undefined}
            className={active === label ? 'is-active' : ''} onClick={event => followSectionLink(event, label)}>
            <b aria-hidden="true"><NavIcon name={icon} /></b><span className="folio-index-label"><span>{label}</span></span>
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

