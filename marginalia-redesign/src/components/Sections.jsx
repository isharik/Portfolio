import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import QRCode from 'qrcode'
import { Reveal } from './Chrome'
import { TextRoll } from './ui/TextRoll'
import VoiceNote from './ui/VoiceNote'
import PushpinTearFooter from './ui/pushpin-tear-footer'
import ProjectDetail from './ui/ProjectDetail'
import ContributionSkyline from './ui/ContributionSkyline'
import FactsMediaPreview, { SpotifyMark } from './ui/FactsMediaPreview'
import musicRotation from '../musicRotation.json'
import screenShelf from '../screenShelf.json'
import gameShelf from '../gameShelf.json'
import { credentials, experiences, profile, projects, skillGroups } from '../data'
import { playUiSound } from '../utils/uiSound'
import './gaming-shelf.css'
import './field-guide.css'
import './education-signal.css'

const gameShelfOrder = [
  'Valorant', 'Far Cry 3', 'Ghost of Tsushima', 'Watch Dogs 2', 'Outer Wilds', 'Counter-Strike 2',
  'Cyberpunk 2077', 'Far Cry Primal', 'Control', 'Ghost of Yōtei', 'Watch Dogs', 'Disco Elysium',
  'Far Cry 5', 'Sekiro: Shadows Die Twice', 'Death Stranding', 'Far Cry 2', 'Hollow Knight', 'Watch Dogs: Legion',
  'Elden Ring', 'Far Cry 3: Blood Dragon', 'Red Dead Redemption 2', 'Return of the Obra Dinn', 'Far Cry 6',
  'Deathloop', 'Kingdom Come: Deliverance II', 'Far Cry New Dawn', 'NieR: Automata', 'S.T.A.L.K.E.R. 2',
]
const arrangedGameShelf = gameShelfOrder.map(title => gameShelf.find(game => game.title === title)).filter(Boolean)
const gameNotes = {
  Valorant: '6,000+ hours over six years. The game I keep returning to for precision, teamwork, and the perfect round.',
  'Far Cry 3': 'The Far Cry series is a favorite: open worlds, improvisation, and stories that invite detours.',
  'Watch Dogs 2': 'Watch Dogs is where my love of playful systems and creative problem solving comes through.',
}
const gameNote = game => gameNotes[game.title]
  || (game.title.startsWith('Far Cry') ? 'Part of my favorite series: open-world freedom and room to experiment.'
    : game.title.startsWith('Watch Dogs') ? 'A world that makes hacking, exploration, and creative approaches feel connected.'
      : `${game.genre} is the part of my game library I return to for its world and distinct point of view.`)

function Scribble({ children, className = '' }) {
  return <span className={`scribble ${className}`}>{children}</span>
}

function InkSignature({ children, defer = false }) {
  return <span className={`ink-signature${defer ? ' ink-signature-deferred' : ' is-revealed'}`} aria-label={children}>{children}</span>
}

function GitHubMark({ className = '' }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943" /></svg>
}

function PortraitNote({ children, className = '' }) {
  return <Scribble className={`note ${className}`}>{children}<svg viewBox="0 0 42 36" aria-hidden="true"><path d="M2 3 C17 4 27 14 34 29" /><path d="M25 25 L35 30 L36 19" /></svg></Scribble>
}

function warmImagesNear(element, sources) {
  const load = () => {
    for (const source of new Set(sources.filter(Boolean))) {
      const image = new Image()
      image.decoding = 'async'
      image.fetchPriority = 'low'
      image.src = source
    }
  }
  if (!element || !('IntersectionObserver' in window)) {
    const timer = window.setTimeout(load, 800)
    return () => window.clearTimeout(timer)
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    load()
  }, { rootMargin: '900px 0px' })
  observer.observe(element)
  return () => observer.disconnect()
}

function MessageSphere({ phase = 'sending', size = 188 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const pixelRatio = Math.min(2, window.devicePixelRatio || 1)
    const sphereRadius = size * .367
    canvas.width = size * pixelRatio
    canvas.height = size * pixelRatio
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    const dots = []
    for (let ring = 0; ring <= 15; ring += 1) {
      const latitude = (ring / 15) * Math.PI
      const count = Math.max(5, Math.round(Math.sin(latitude) * 27))
      for (let point = 0; point < count; point += 1) {
        const longitude = (point / count) * Math.PI * 2 + ring * .31
        dots.push({ x: Math.sin(latitude) * Math.cos(longitude), y: Math.cos(latitude), z: Math.sin(latitude) * Math.sin(longitude) })
      }
    }

    const styles = getComputedStyle(document.documentElement)
    const highlight = styles.getPropertyValue('--sphere-highlight').trim() || '#707cff'
    const success = styles.getPropertyValue('--sphere-success').trim() || '#49c77a'
    const ink = phase === 'complete'
      ? success
      : (styles.getPropertyValue('--ink').trim() || '#f0efeb')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let angle = 0
    let previous = performance.now()
    const tiltCosine = Math.cos(.38)
    const tiltSine = Math.sin(.38)
    const projected = dots.map(dot => ({ dot, x: 0, y: 0, depth: 0, waveSeed: dot.x * 5 + dot.y * 8 + dot.z * 3 }))

    const draw = now => {
      const delta = Math.min(.04, (now - previous) / 1000)
      previous = now
      if (!reducedMotion) angle += delta * 1.35
      const cosine = Math.cos(angle)
      const sine = Math.sin(angle)
      for (const point of projected) {
        const { dot } = point
        point.x = dot.x * cosine + dot.z * sine
        const rotatedZ = dot.z * cosine - dot.x * sine
        point.y = dot.y * tiltCosine - rotatedZ * tiltSine
        point.depth = rotatedZ * tiltCosine + dot.y * tiltSine
      }
      projected.sort((a, b) => a.depth - b.depth)

      context.clearRect(0, 0, size, size)
      projected.forEach(dot => {
        const perspective = 1 / (1.8 - dot.depth * .5)
        const radius = (.65 + (dot.depth + 1) * .65) * perspective * (size / 188)
        const wave = phase === 'sending' && !reducedMotion
          ? Math.sin(now * .008 + dot.waveSeed)
          : 0
        const lit = phase === 'sending' && wave > .48
        const verticalOffset = wave * size * .029 * perspective
        context.globalAlpha = .18 + ((dot.depth + 1) / 2) * .76
        context.fillStyle = lit ? highlight : ink
        context.shadowColor = lit ? highlight : 'transparent'
        context.shadowBlur = lit ? 5 : 0
        context.beginPath()
        context.arc(size / 2 + dot.x * sphereRadius * perspective, size / 2 - dot.y * sphereRadius * perspective + verticalOffset, radius + (lit ? .32 : 0), 0, Math.PI * 2)
        context.fill()
      })
      context.globalAlpha = 1
      context.shadowBlur = 0
      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [phase, size])

  return <div className={`message-sphere-stage is-${phase}`} style={{ '--sphere-size': `${size}px` }} aria-hidden="true"><canvas className="message-sphere" ref={canvasRef} /></div>
}

export function Cover() {
  return (
    <section id="home" data-label="Cover" className="sheet cover-sheet paper-sheet">
      <Reveal className="cover-stage">
        <div className="cover-kicker"><span>AI quality</span><i>·</i><span>customer clarity</span><i>·</i><span>reliable operations</span></div>
        <a className="cover-title" href="#about" aria-label="Explore Sharik Hussain's portfolio"><h1><TextRoll>Portfolio</TextRoll></h1></a>
        <div className="orbit-stroke" aria-hidden="true"><i /></div>
        <Scribble className="cover-signature"><InkSignature>Sharik Hussain</InkSignature>
          <svg viewBox="0 0 150 86" aria-hidden="true"><path d="M142 4 C122 18 114 42 86 48 C61 54 42 45 19 67" /><path d="M19 67 L35 64 M19 67 L27 52" /></svg>
        </Scribble>
        <div className="role-pill">Working with AI, support, and quality</div>
        <a className="cover-scroll scribble" href="#about" aria-label="Scroll to explore the portfolio">scroll
          <svg viewBox="0 0 40 76" aria-hidden="true"><path d="M13 3 C29 13 8 25 18 36 C29 47 10 53 20 61" /><path d="M12 58 L20 68 L29 58" /></svg>
        </a>
      </Reveal>
      <div className="sheet-foot"><span>India — 2026</span><span>Customer Support · Content · AI</span></div>
    </section>
  )
}

export function About() {
  return (
    <section id="about" data-label="Hello" className="sheet paper-sheet about-sheet">
      <Reveal className="portrait-notes">
        <div className="portrait-frame"><img src="/profile-photo.webp" alt="Sharik Hussain" /></div>
        <PortraitNote className="n1">clear thinker</PortraitNote>
        <PortraitNote className="n2">detail-oriented</PortraitNote>
        <PortraitNote className="n3">people-first</PortraitNote>
        <PortraitNote className="n4">curious</PortraitNote>
        <PortraitNote className="n5">fast learner</PortraitNote>
        <PortraitNote className="n6">consistent</PortraitNote>
      </Reveal>
      <Reveal className="about-copy">
        <div className="about-copy-head">
          <h2>Hello.</h2>
          <div className="about-voice-row">
            <span>A short introduction, in my own voice</span>
            <VoiceNote />
          </div>
        </div>
        <div className="ink-underline" />
        <p>{profile.summary}</p>
        <p>{profile.intro}</p>
        <Scribble className="circle-note">human judgment matters</Scribble>
      </Reveal>
    </section>
  )
}

function QRPattern() {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, 'https://portfolio-isharik.vercel.app/resume.pdf', {
      width: 300,
      margin: 0,
      color: { dark: '#171719', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    })
  }, [])
  return <a className="qr" href="/resume.pdf" download="Sharik-Hussain-CV.pdf" aria-label="Download Sharik Hussain's CV"><canvas ref={canvasRef} /></a>
}

export function Education() {
  const [activeCredential, setActiveCredential] = useState(null)
  const active = activeCredential === null ? null : credentials[activeCredential]
  const credentialStories = [
    'Four years of computer science foundations — systems thinking, software practice, and the patience to make complex work understandable.',
    'A focused systems credential built around dependable administration, clear operational ownership, and repeatable support.',
    'A practical cloud foundation covering the services, concepts, and disciplined habits behind reliable digital products.',
    'An ongoing ecosystem practice: turning technical ideas into useful, accessible stories for the people building with them.',
  ]
  const activeImage = activeCredential === 3 ? '/logos/pharos-mark.png' : active?.logo

  useEffect(() => {
    ['/images/micro1-certificate.jpg', '/images/aws-academy-credential.png'].forEach(src => {
      const image = new Image()
      image.src = src
      image.decode?.().catch(() => {})
    })
  }, [])

  useEffect(() => {
    if (activeCredential === null) return undefined
    const onKeyDown = event => { if (event.key === 'Escape') setActiveCredential(null) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeCredential])

  return (
    <>
      <section id="education" data-label="Education" className="sheet education-signal">
        <header className="education-signal-heading">
          <h2>Education</h2>
          <Scribble>2019 → still learning</Scribble>
        </header>
        <div className="education-signal-stage" role="group" aria-label="Education and credentials">
          <button className="education-signal-degree" type="button" onClick={() => { playUiSound('press'); setActiveCredential(0) }}>
            <span className="education-signal-number" aria-hidden="true">01</span>
            <span className="education-signal-degree-content">
              <span className="education-signal-degree-logo"><img src="/logos/miet-autonomous.jpg" alt="MIET Autonomous" /></span>
              <strong>{credentials[0].title}</strong>
              <span className="education-signal-degree-meta"><span>{credentials[0].org} / {credentials[0].period}</span><span>Explore the degree ↗</span></span>
            </span>
          </button>
          <div className="education-signal-directory">
            {credentials.slice(1).map((credential, offset) => <button className="education-signal-entry" type="button" key={credential.title} onClick={() => { playUiSound('press'); setActiveCredential(offset + 1) }}>
              <span className="education-signal-entry-index">0{offset + 2}</span>
              <span className={`education-signal-entry-logo education-signal-logo-${offset + 1}`}><img src={offset === 2 ? '/logos/pharos-mark.png' : credential.logo} alt="" /></span>
              <span className="education-signal-entry-copy"><strong>{credential.title}</strong><small>{credential.org} · {credential.period}</small></span>
              <span className="education-signal-entry-arrow" aria-hidden="true">↗</span>
            </button>)}
          </div>
          <aside className="education-signal-cv" aria-label="Download curriculum vitae">
            <span>Curriculum Vitae</span>
            <QRPattern />
            <Scribble>scan the full record ↗</Scribble>
          </aside>
        </div>
      </section>
      {active && createPortal(
        <div className="education-detail-modal" role="presentation" onPointerDown={event => {
          if (event.target === event.currentTarget) setActiveCredential(null)
        }}>
          <article key={activeCredential} className={`education-detail-sheet${activeCredential > 0 ? ' has-certificate' : ''}${activeCredential === 3 ? ' has-pharos-profile' : ''}`} role="dialog" aria-modal="true" aria-labelledby="education-credential-title" aria-live="polite">
            <header className="education-detail-header education-detail-item"><span>Credential record</span><div><b>0{activeCredential + 1}</b><span>/ 0{credentials.length}</span></div><button type="button" className="education-detail-close" onClick={() => setActiveCredential(null)} aria-label="Close credential details">Close <i aria-hidden="true">×</i></button></header>
            <div className="education-detail-title-row education-detail-item">
              <div className="education-detail-mark">{activeImage ? <img src={activeImage} alt="" /> : <span className="education-detail-aws">aws</span>}</div>
              <div><span>{activeCredential === 0 ? 'Degree / foundation' : 'Credential / practice'}</span><h3 id="education-credential-title">{active.title}</h3></div>
            </div>
            <div className="education-detail-meta education-detail-item"><div><span>Organisation</span><strong>{active.org}</strong></div><div><span>Timeframe</span><strong>{active.period}</strong></div></div>
            {activeCredential === 1 && <figure className="education-detail-certificate education-detail-item"><img src="/images/micro1-certificate.jpg" loading="eager" decoding="sync" alt="Micro1 System Administrator certificate issued to Sharik Hussain on 1 October 2025" /><figcaption>Micro1 · System Administrator · issued 1 October 2025</figcaption></figure>}
            {activeCredential === 2 && <figure className="education-detail-certificate education-detail-item"><img src="/images/aws-academy-credential.png" loading="eager" decoding="sync" alt="AWS Academy Cloud Foundations certificate issued to Sharik Hussain on 21 November 2022" /><figcaption>AWS Academy Cloud Foundations · issued 21 November 2022</figcaption></figure>}
            {activeCredential === 3 && <figure className="education-detail-certificate education-detail-pharos education-detail-item"><img src="/images/pharos-storyteller-profile.png" alt="Illustrated Echo profile with a green active indicator on a deep blue network background" /><figcaption><span>Pharos profile</span><strong>Echo</strong><small>@echoplex99 · StoryTeller</small><em>Building Stuff · PROS</em><p>Hustlin Here to claim what's Mine</p><div className="education-detail-pharos-roles"><b>Elder Storyteller</b><b>Rising Storyteller</b><b>Observer</b></div></figcaption></figure>}
            <div className="education-detail-focus education-detail-item"><span>What this adds</span><strong>{active.note}</strong><p>{credentialStories[activeCredential]}</p></div>
            <footer className="education-detail-footer education-detail-item"><div className="education-detail-nav"><button type="button" disabled={activeCredential === 0} onClick={() => { playUiSound('press'); setActiveCredential(index => index - 1) }} aria-label="Previous credential">←</button><span>Browse record</span><button type="button" disabled={activeCredential === credentials.length - 1} onClick={() => { playUiSound('press'); setActiveCredential(index => index + 1) }} aria-label="Next credential">→</button></div>{active.href ? <a href={active.href} target="_blank" rel="noreferrer">View credential <span aria-hidden="true">⟡</span></a> : <span className="education-detail-complete">Degree completed <b>✓</b></span>}</footer>
          </article>
        </div>, document.body)}
    </>
  )
}

export function Experience() {
  const [expanded, setExpanded] = useState(null)
  const [scrollFocus, setScrollFocus] = useState(0)
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const wheelLockRef = useRef(false)
  const entryLandingRef = useRef(false)
  const previousTopRef = useRef(null)
  const isNearExperience = useRef(true)
  const toggleExperience = index => {
    setExpanded(current => current === index ? null : index)
    setScrollFocus(index)
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const positionTrack = () => {
      const mapViewport = viewportRef.current
      const mapTrack = trackRef.current
      if (mapViewport && mapTrack) {
        const trackTravel = Math.max(0, mapTrack.scrollWidth - mapViewport.clientWidth)
        const progress = experiences.length > 1 ? scrollFocus / (experiences.length - 1) : 0
        // Integer pixel movement avoids sub-pixel text rasterisation inside
        // the cards while the horizontal track is in motion.
        mapTrack.style.transform = `translateX(${-Math.round(trackTravel * progress)}px)`
      }
    }

    const handleWheel = event => {
      const direction = Math.sign(event.deltaY)
      if (!direction) return
      const bounds = section.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      // The first downward gesture that reaches this section is a landing
      // gesture, not a request to skip Invisible Technologies.  This keeps
      // wheel and trackpad input predictable when arriving from Education.
      const isEnteringFromEducation = direction > 0 && bounds.top > 0 && bounds.top <= viewport * .72
      if (isEnteringFromEducation && !entryLandingRef.current) {
        event.preventDefault()
        entryLandingRef.current = true
        if (scrollFocus !== 0) setScrollFocus(0)
        wheelLockRef.current = true
        window.setTimeout(() => { wheelLockRef.current = false }, 420)
        return
      }
      // Capture as soon as the experience stage enters the reading zone —
      // not only when the pointer happens to be over a card.
      const isExperienceInControl = bounds.top <= viewport * .58 && bounds.bottom >= viewport * .42
      if (!isExperienceInControl) return

      if (wheelLockRef.current) {
        event.preventDefault()
        return
      }

      const nextIndex = Math.max(0, Math.min(experiences.length - 1, scrollFocus + direction))
      // At either end, release native scroll so the reader can continue to
      // Skills or back to Education. Everywhere else, the wheel owns the map.
      if (nextIndex === scrollFocus) return

      event.preventDefault()
      wheelLockRef.current = true
      setScrollFocus(nextIndex)
      window.setTimeout(() => { wheelLockRef.current = false }, 680)
    }

    positionTrack()
    const watchWheel = () => window.addEventListener('wheel', handleWheel, { passive: false })
    const unwatchWheel = () => window.removeEventListener('wheel', handleWheel)
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      isNearExperience.current = entry.isIntersecting
      if (entry.isIntersecting) watchWheel()
      else {
        unwatchWheel()
        previousTopRef.current = null
        entryLandingRef.current = false
      }
    }, { rootMargin: '100% 0px' }) : null
    if (observer) observer.observe(section)
    else watchWheel()
    window.addEventListener('resize', positionTrack)
    return () => {
      observer?.disconnect()
      unwatchWheel()
      window.removeEventListener('resize', positionTrack)
    }
  }, [scrollFocus])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const resetEntryFocus = () => {
      const top = section.getBoundingClientRect().top
      const previousTop = previousTopRef.current
      const viewport = window.innerHeight || 1
      // Re-arm the landing gesture once the reader has moved away from the
      // stage, so a future arrival from Education again opens on role one.
      if (top > viewport * .8 || top < -viewport * .4) entryLandingRef.current = false
      if (previousTop !== null) {
        // Entering from Education always starts the map at Invisible.
        if (previousTop > viewport * .62 && top <= viewport * .62) setScrollFocus(0)
        // Entering from Skills in reverse starts at the final role.
        if (previousTop < viewport * .38 && top >= viewport * .38) setScrollFocus(experiences.length - 1)
      }
      previousTopRef.current = top
    }

    let frame = 0
    const onScroll = () => {
      if (frame || !isNearExperience.current) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (isNearExperience.current) resetEntryFocus()
      })
    }
    resetEntryFocus()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section ref={sectionRef} id="experience" data-label="Experience" className="sheet paper-sheet experience-sheet">
      <div className={`experience-pin ${expanded !== null ? 'has-expanded' : ''}`}>
        <Reveal className="experience-heading">
          <h2>Experience</h2><div className="ink-underline" />
          <Scribble>the work behind the work ↓</Scribble>
        </Reveal>
        <div ref={viewportRef} className="experience-map-viewport">
          <span className="experience-map-line" aria-hidden="true" />
          <div ref={trackRef} className="experience-list">
          {experiences.map((item, index) => (
          <article
            className={`experience-row ${expanded === index ? 'is-expanded' : ''} ${scrollFocus === index ? 'is-scroll-focus' : ''} ${index < scrollFocus ? 'is-scroll-past' : 'is-scroll-next'}`}
            key={item.company}
            role="button"
            tabIndex={0}
            aria-expanded={expanded === index}
            aria-controls={`experience-detail-${index}`}
            onClick={() => toggleExperience(index)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                toggleExperience(index)
              }
            }}
          >
            <div className="experience-index">0{index + 1}</div>
            <img src={item.logo} alt="" />
            <div className="experience-title"><h3>{item.company}</h3><b>{item.role}</b><span>{item.period} · {item.type}</span></div>
            <p>{item.copy}</p>
            <span className="experience-open">{expanded === index ? 'close ×' : 'view role +'}</span>
            {expanded === index && <div className="experience-detail" id={`experience-detail-${index}`}>
              <Scribble>what I contributed</Scribble>
              <p>{item.copy} My focus was reliable execution, careful review, clear communication, and work that could stand up to real operational use.</p>
              <div><span>Quality review</span><span>Clear documentation</span><span>Remote collaboration</span></div>
            </div>}
          </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Skills() {
  const [activeSkill, setActiveSkill] = useState(0)
  const [activeCapability, setActiveCapability] = useState('')
  const supportSkills = [
    'Customer Communication', 'Real-time Support', 'Ticket Resolution', 'Technical Troubleshooting',
    'CRM Management', 'Confidentiality Protocols', 'Process Documentation', 'Operational SOPs',
  ]
  const technicalSkills = [
    'AI Quality Assurance', 'LLM Output Evaluation', 'Workflow Optimisation', 'Python',
    'Structured Feedback', 'Annotation & Labeling', 'JavaScript', 'React & Next.js',
  ]
  return (
    <section id="skills" data-label="Skills" className="sheet paper-sheet skills-sheet">
      <Reveal className="skills-top">
        <div><h2>Skills</h2><div className="ink-underline short" /></div>
        <Scribble>tools change — judgment compounds</Scribble>
      </Reveal>
      <Reveal className="skill-icons">
        {skillGroups.slice(0, 5).map((group, index) => <button aria-pressed={activeSkill === index} onClick={() => setActiveSkill(index)} key={group.label} className={`skill-icon ${group.tone}`}><span>{group.short}</span></button>)}
        <Scribble>I’m always studying my tools ↑</Scribble>
        <div className="skill-popover"><b>{skillGroups[activeSkill].label}</b><span>{skillGroups[activeSkill].skills.slice(0,3).join(' · ')}</span></div>
      </Reveal>
      <Reveal className="skill-books">
        <Scribble>my working library</Scribble>
        <span className="coffee-cup" aria-hidden="true"><i /><b /><u /></span>
        {skillGroups.slice(0, 5).map((group, i) => <div key={group.label} className={`book book-${i}`}>{group.label}</div>)}
      </Reveal>
      <p className="skills-copy">Practical capability across AI evaluation, technical operations, customer experience, content, and repeatable process design.</p>
      <div className="skill-columns">
        <div className="skill-column"><h3>Customer &amp; support</h3>{supportSkills.map(skill => <button type="button" key={skill} aria-pressed={activeCapability === skill} className={activeCapability === skill ? 'is-highlighted' : ''} onClick={() => setActiveCapability(skill)}><span>•</span>{skill}</button>)}</div>
        <div className="skill-column"><h3>AI &amp; development</h3>{technicalSkills.map(skill => <button type="button" key={skill} aria-pressed={activeCapability === skill} className={activeCapability === skill ? 'is-highlighted' : ''} onClick={() => setActiveCapability(skill)}><span>•</span>{skill}</button>)}</div>
      </div>
      <Scribble className="toolkit-note">there’s always more in the toolkit ✎</Scribble>
    </section>
  )
}

export function Projects() {
  const [selected, setSelected] = useState(null)
  const [focusedProject, setFocusedProject] = useState(null)
  const projectSection = useRef(null)

  useEffect(() => warmImagesNear(projectSection.current, projects.map(project => project.image)), [])

  return (
    <section ref={projectSection} id="projects" data-label="Projects" className="sheet paper-sheet projects-sheet">
      <Reveal className="projects-heading"><h2>Projects.</h2><div className="ink-underline short" /><Scribble>work that left the notebook</Scribble></Reveal>
      <div className="project-gallery">
        {projects.map((project, index) => {
          const phonePreview = project.title === 'Onchain Wizard' ? '/logos/pharos-network.png' : (project.phoneImage || project.image)
          return (
          <Reveal className="project-item" key={project.title}>
            <Scribble className="project-note">{project.note} ↓</Scribble>
            <button className={`device project-device-${index}${focusedProject === index ? ' is-active' : ''}`} onPointerEnter={() => setFocusedProject(index)} onPointerLeave={() => setFocusedProject(null)} onFocus={() => setFocusedProject(index)} onBlur={() => setFocusedProject(null)} onClick={() => setSelected(project)} aria-label={`Open ${project.title} project details`}>
              <div className="device-speaker" />
              <div className={`device-screen project-screen-${index}`}>
                <img src={phonePreview} alt="" loading="lazy" decoding="async" />
                <div className="device-shade" />
                {project.phoneHeading && <div className="device-wallpaper-title" aria-hidden="true">{project.phoneHeading}</div>}
                <div className="device-copy"><ScrambleProjectLabel active={focusedProject === index} title={project.title} /></div>
              </div>
            </button>
            <Scribble className="project-number">{index + 1}. {project.title}</Scribble>
          </Reveal>
          )
        })}
      </div>
      <ContributionGrid />
      {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

function ContributionGrid() {
  const series = useMemo(() => {
    // Intentional uneven months: the twelve monthly totals add to exactly 626.
    const monthlyTotals = [12, 20, 36, 48, 74, 83, 63, 42, 77, 60, 68, 43]
    const densities = [.32, .42, .54, .62, .75, .79, .69, .54, .76, .67, .71, .58]
    const scatter = (month, cell) => {
      const value = Math.sin((cell + 1) * 12.9898 + month * 78.233) * 43758.5453
      return value - Math.floor(value)
    }
    const monthPattern = monthlyTotals.map((total, month) => {
      const weeks = Array.from({ length: 52 }, (_, week) => week).filter(week => Math.floor(week * 12 / 52) === month)
      const count = weeks.length * 7
      const active = Array.from({ length: count }, (_, cell) => cell).filter(cell => scatter(month, cell) < densities[month])
      const base = Math.floor(total / active.length)
      const extra = total % active.length
      const values = Array(count).fill(0)
      active.forEach((cell, rank) => { values[cell] = base + (rank < extra ? 1 : 0) })
      return { startWeek: weeks[0], values }
    })
    const days = Array.from({ length: 52 * 7 }, (_, index) => {
      const week = Math.floor(index / 7)
      const day = index % 7
      const month = Math.min(11, Math.floor((week * 12) / 52))
      const pattern = monthPattern[month]
      return pattern.values[(week - pattern.startWeek) * 7 + day]
    })
    return [...Array(16).fill(0), ...days]
  }, [])
  return <Reveal className="contribution-trace"><ContributionSkyline title="Contributions" data={series} endDate={new Date()} profileUrl={profile.socials.github} volume={0.35} /></Reveal>
}

function ScrambleProjectLabel({ active, title }) {
  const target = title
  const outputRef = useRef(null)
  useEffect(() => {
    const output = outputRef.current
    if (!output) return undefined
    const write = value => { output.textContent = value }
    if (!active || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      write(target)
      return undefined
    }
    const glyphs = [...target]
    const characters = '01<>[]{}/\\|=~^'
    const settleTimes = glyphs.map((_, index) => {
      const scatter = Math.sin(index * 7.31 + glyphs.length * 1.7) * .5 + .5
      return (index + scatter * 2.5) * 22
    })
    const end = Math.max(...settleTimes)
    let written = -Infinity
    let animationId = 0
    const start = performance.now()
    const tick = now => {
      const elapsed = now - start
      if (elapsed >= end) return write(target)
      if (now - written >= 28) {
        written = now
        write(glyphs.map((glyph, index) => /\s/.test(glyph) || elapsed >= settleTimes[index] ? glyph : characters[Math.floor(Math.random() * characters.length)]).join(''))
      }
      animationId = requestAnimationFrame(tick)
    }
    animationId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationId)
  }, [active, target])
  return <span className="project-scramble" aria-label={target}><span ref={outputRef}>{target}</span></span>
}

function XMark({ className = '' }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.29 19.494h2.039L6.486 3.24H4.298L17.61 20.647Z" /></svg>
}

function instagramSample(label, path, photoCount) {
  const code = path.split('/').at(-1)
  return {
    label,
    href: `https://www.instagram.com/purelyvisual_/${path}/`,
    image: `/images/instagram-${code}.jpg`,
    photos: Array.from({ length: photoCount }, (_, index) => `/images/instagram-${code}-photo-${index + 1}.webp`),
  }
}

function MusicStrip({ samples, onPreview, previewOpen }) {
  const strip = useRef(null)
  const paused = useRef(false)
  const drag = useRef(null)
  const suppressClick = useRef(false)
  const resumeTimer = useRef(0)

  useEffect(() => {
    const node = strip.current
    if (!node || previewOpen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    let last = 0
    let fraction = 0
    let lap = 0
    const measure = () => {
      const gap = Number.parseFloat(getComputedStyle(node).columnGap) || 0
      lap = (node.scrollWidth + gap) / 2
    }
    measure()
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null
    resize?.observe(node)
    if (!resize) window.addEventListener('resize', measure)
    const advance = now => {
      if (last && !paused.current && lap) {
        fraction += Math.min(48, now - last) * .075
        const step = Math.floor(fraction)
        if (step) {
          const next = node.scrollLeft + step
          node.scrollLeft = next >= lap ? next - lap : next
          fraction -= step
        }
      }
      last = now
      frame = requestAnimationFrame(advance)
    }
    frame = requestAnimationFrame(advance)
    return () => {
      cancelAnimationFrame(frame)
      resize?.disconnect()
      if (!resize) window.removeEventListener('resize', measure)
    }
  }, [previewOpen])

  useEffect(() => () => window.clearTimeout(resumeTimer.current), [])

  const browse = direction => {
    const node = strip.current
    if (!node) return
    const lap = node.scrollWidth / 2
    window.clearTimeout(resumeTimer.current)
    paused.current = true
    if (direction < 0 && node.scrollLeft < 220) node.scrollLeft += lap
    node.scrollLeft += direction * 212
    resumeTimer.current = window.setTimeout(() => { paused.current = false }, 550)
  }

  return <div className="facts-music-shelf">
    <div className="facts-music-bar"><span>Artists on rotation <i aria-hidden="true">↝</i></span><div aria-label="Browse artists"><button type="button" onClick={() => browse(-1)} aria-label="Previous artists">←</button><button type="button" onClick={() => browse(1)} aria-label="Next artists">→</button></div></div>
    <div className="facts-music-strip" ref={strip} onFocusCapture={() => { paused.current = true }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) paused.current = false }}
      onPointerDown={event => { if (event.pointerType !== 'mouse' || event.button !== 0) return; drag.current = { x:event.clientX, scroll:strip.current.scrollLeft, moved:false }; paused.current = true }}
      onPointerMove={event => { if (!drag.current) return; const distance=event.clientX-drag.current.x; if (Math.abs(distance)>5 && !drag.current.moved) { drag.current.moved=true; event.currentTarget.setPointerCapture(event.pointerId) } if (drag.current.moved) strip.current.scrollLeft=drag.current.scroll-distance }}
      onPointerUp={event => { if (!drag.current) return; suppressClick.current=drag.current.moved; drag.current=null; paused.current=false; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }}
      onPointerCancel={() => { drag.current=null; paused.current=false }}
      onClickCapture={event => { if (suppressClick.current) { event.stopPropagation(); event.preventDefault(); suppressClick.current=false } }}
      aria-label="Music artists and previews">
      {[...samples, ...samples].map((sample, index) => <button key={`${sample.label}-${index}`} type="button" className="facts-music-record" tabIndex={index >= samples.length ? -1 : 0} aria-hidden={index >= samples.length ? 'true' : undefined} onClick={() => onPreview(sample)}>
        <span className="facts-music-record-art"><img src={sample.image} alt="" loading="lazy" decoding="async" /><i aria-hidden="true">▶</i></span>
        <strong>{sample.label}</strong><small>{sample.track}</small>
      </button>)}
    </div>
  </div>
}

function MovieShelf({ samples }) {
  const columns = Array.from({ length: 10 }, (_, index) => samples.filter((_, sampleIndex) => sampleIndex % 10 === index))
  return <div className="movie-unfurl" aria-label="Movie and TV gallery">
    <div className="movie-unfurl-grid">
      {columns.map((column, index) => <div className="movie-unfurl-column" style={{ '--column-index': index }} key={index}>
        {column.map(sample => <a className="movie-unfurl-frame" href={sample.href} target="_blank" rel="noreferrer" key={sample.title} aria-label={`${sample.title}, ${sample.genre} ${sample.kind} — more details`} title={sample.title}>
          <img src={sample.image} alt="" loading="lazy" decoding="async" />
        </a>)}
      </div>)}
    </div>
  </div>
}

function GamingShelf({ clips, onPreview }) {
  const hideTimer = useRef(null)
  const rail = useRef(null)
  const railPaused = useRef(false)
  const railDrag = useRef(null)
  const suppressRailClick = useRef(false)
  const [gameDetail, setGameDetail] = useState(null)
  useEffect(() => {
    const node = rail.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    let previous = 0
    let remainder = 0
    let lap = 0
    const measure = () => { lap = (node.scrollWidth + (Number.parseFloat(getComputedStyle(node).columnGap) || 0)) / 2 }
    measure()
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null
    resize?.observe(node)
    if (!resize) window.addEventListener('resize', measure)
    const advance = now => {
      if (previous && !railPaused.current && lap) {
        remainder += Math.min(48, now - previous) * .055
        const step = Math.floor(remainder)
        if (step) {
          node.scrollLeft = (node.scrollLeft + step) % lap
          remainder -= step
        }
      }
      previous = now
      frame = requestAnimationFrame(advance)
    }
    frame = requestAnimationFrame(advance)
    return () => { cancelAnimationFrame(frame); resize?.disconnect(); if (!resize) window.removeEventListener('resize', measure) }
  }, [])
  const browseGames = direction => {
    const node = rail.current
    if (!node) return
    const lap = node.scrollWidth / 2
    if (direction < 0 && node.scrollLeft < 190) node.scrollLeft += lap
    node.scrollLeft += direction * 190
    if (node.scrollLeft >= lap) node.scrollLeft -= lap
  }
  const revealGame = game => {
    clearTimeout(hideTimer.current)
    setGameDetail({ game, visible: true })
  }
  const hideGame = () => {
    setGameDetail(detail => detail ? { ...detail, visible: false } : null)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setGameDetail(null), 190)
  }
  useEffect(() => () => clearTimeout(hideTimer.current), [])
  const renderGame = (game, index) => (
    <li key={`${game.title}-${index}`} className="game-library-tile" aria-hidden={index >= arrangedGameShelf.length ? 'true' : undefined}>
      <a href={game.href} target="_blank" rel="noreferrer" tabIndex={index >= arrangedGameShelf.length ? -1 : 0} onMouseEnter={() => { railPaused.current = true; revealGame(game) }} onMouseLeave={() => { hideGame(); railPaused.current = false }} onFocus={() => { railPaused.current = true; revealGame(game) }} onBlur={() => { hideGame(); railPaused.current = false }} onTouchStart={event => { event.preventDefault(); railPaused.current = true; revealGame(game); hideTimer.current = setTimeout(() => { hideGame(); railPaused.current = false }, 2600) }}>
        <img className="game-library-cover" src={game.image} alt="" decoding="async" />
        <span>{game.title}</span>
      </a>
    </li>
  )

  return (
    <div className="game-library">
      <div className="game-library-meta">
        <h4>Game library</h4>
        <nav className="game-library-links" aria-label="Gaming profiles">
          <a href="https://steamcommunity.com/search/users/?text=isharik99" target="_blank" rel="noreferrer"><span className="game-link-icon is-steam"><img src="/logos/brand-steam.svg" alt="" /></span><span className="game-link-label">Steam · iSharik99</span></a>
          <a href="https://tracker.gg/valorant/search?query=Echoplex" target="_blank" rel="noreferrer"><span className="game-link-icon is-valorant"><img src="/logos/brand-valorant.svg" alt="" /></span><span className="game-link-label">Valorant · Echoplex</span></a>
          <a href="https://www.youtube.com/@echoplexfps" target="_blank" rel="noreferrer"><span className="game-link-icon is-youtube"><img src="/logos/brand-youtube.svg" alt="" /></span><span className="game-link-label">EchoPlex FPS on YouTube</span></a>
        </nav>
      </div>
      <div className="game-library-panel">
      <div className="game-rail-heading"><span>On the shelf <i aria-hidden="true">↝</i></span><div><button type="button" aria-label="Previous games" onClick={() => browseGames(-1)}>←</button><button type="button" aria-label="Next games" onClick={() => browseGames(1)}>→</button></div></div>
      <ul className="game-library-rail" ref={rail} aria-label="Scrolling game library" onPointerEnter={() => { railPaused.current = true }} onPointerLeave={() => { railPaused.current = false }} onFocusCapture={() => { railPaused.current = true }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) railPaused.current = false }}
        onPointerDown={event => { if (event.pointerType !== 'mouse' || event.button !== 0) return; railDrag.current = { x: event.clientX, scroll: rail.current.scrollLeft, moved: false }; railPaused.current = true }}
        onPointerMove={event => { if (!railDrag.current) return; const distance = event.clientX - railDrag.current.x; if (Math.abs(distance) > 5 && !railDrag.current.moved) { railDrag.current.moved = true; event.currentTarget.setPointerCapture(event.pointerId) } if (railDrag.current.moved) rail.current.scrollLeft = railDrag.current.scroll - distance }}
        onPointerUp={event => { if (!railDrag.current) return; suppressRailClick.current = railDrag.current.moved; railDrag.current = null; railPaused.current = false; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }}
        onPointerCancel={() => { railDrag.current = null; railPaused.current = false }}
        onClickCapture={event => { if (suppressRailClick.current) { event.stopPropagation(); event.preventDefault(); suppressRailClick.current = false } }}>
        {[...arrangedGameShelf, ...arrangedGameShelf].map(renderGame)}
      </ul>
      <div className="game-clips-heading">From the game room <span>three moments on YouTube</span></div>
      <ul className="game-library-clips" aria-label="Valorant clips">
        {clips.map(clip => (
          <li key={clip.videoId}>
            <button type="button" aria-haspopup="dialog" onClick={() => onPreview(clip)}>
              <span className="game-clip-art">
                <img src={clip.image} alt="" decoding="async" />
                <span className="game-clip-play" aria-hidden="true">▶</span>
              </span>
              <span className="game-clip-caption">{clip.label}</span>
            </button>
          </li>
        ))}
      </ul>
      </div>
      {gameDetail && createPortal(<div className="game-library-detail" data-visible={gameDetail.visible} aria-hidden="true"><div className="game-library-detail-card"><img src={gameDetail.game.image} alt="" /><div><span>{gameDetail.game.genre}</span><strong>{gameDetail.game.title}</strong><p>{gameNote(gameDetail.game)}</p></div></div></div>, document.body)}
    </div>
  )
}

const fieldGuides = {
  youtube: { cover: 'Gameplay & game shelf', action: 'View clips and games' },
  x: { cover: 'Ecosystem field notes', action: 'Read the dispatches' },
  movies: { cover: 'The screening room', action: 'Browse the poster wall' },
  instagram: { cover: 'The contact sheet', action: 'View the photo stories' },
}

function FieldGuideArtwork({ fact, kind }) {
  if (kind === 'x') return <div className="field-guide-artwork field-guide-artwork--x" aria-hidden="true">
    <img src="/images/x-isharik99.jpg" alt="" decoding="async" />
    <span className="field-guide-profile-caption">@isharik99 <XMark /></span>
  </div>
  if (kind === 'movies') return <div className="field-guide-artwork field-guide-artwork--movies" aria-hidden="true">
    <img src="/images/cinema-stories.jpg" alt="" decoding="async" />
  </div>
  if (kind === 'youtube') return <div className="field-guide-artwork field-guide-artwork--youtube" aria-hidden="true">
    <img src="/images/gaming-controller.jpg" alt="" decoding="async" />
  </div>
  const frames = kind === 'movies' ? fact.samples.slice(0, 4) : fact.samples
  return (
    <div className={`field-guide-artwork field-guide-artwork--${kind}`} aria-hidden="true">
      {frames.map(frame => (
        <div className="field-guide-frame" key={frame.videoId || frame.label || frame.title}>
          <img src={frame.image} alt="" decoding="async" />
        </div>
      ))}
    </div>
  )
}

function FieldGuideSamples({ kind, samples, onPreview }) {
  return (
    <ul className={`field-guide-samples field-guide-samples--${kind}`} aria-label={kind === 'x' ? 'Posts on X' : 'Photo stories'}>
      {samples.map(sample => {
        const caption = <span className="field-guide-caption">{sample.label}<span aria-hidden="true">{kind === 'x' ? '↗' : '+'}</span></span>
        return (
          <li key={sample.label}>
            {kind === 'x' ? (
              <a href={sample.href} target="_blank" rel="noreferrer">
                <img src={sample.image} alt="" decoding="async" />
                {caption}
              </a>
            ) : (
              <button type="button" aria-haspopup="dialog" onClick={() => onPreview(sample)}>
                <img src={sample.image} alt="" decoding="async" />
                {caption}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

const web3Articles = [
  { image: '/images/web3-article-apt.png', title: 'APT on Pharos: From Yield Vault to Evolving On-Chain Asset', date: 'Oct 2', href: 'https://x.com/isharik99/status/2105933520300560461' },
  { image: '/images/web3-article-beyond-hype.png', title: 'Pharos Beyond the Hype', date: 'Jul 22', href: 'https://x.com/isharik99/status/2079838304409911448' },
  { image: '/images/web3-article-pulse-os.png', title: 'Introducing Pulse OS', date: 'Jul 4', href: 'https://x.com/isharik99/status/2073390275557474504' },
]

function Web3DominoGallery({ samples }) {
  return <div className="web3-writing">
  <ul className="web3-domino-gallery" aria-label="Posts on X">
    {samples.map((sample, index) => <li key={sample.label} style={{ '--domino-index': index }}>
      <a href={sample.href} target="_blank" rel="noreferrer" aria-label={`Read ${sample.label} on X`}>
        <span className="web3-domino-image"><img src={sample.image} alt="" decoding="async" /></span>
        <span className="web3-domino-caption"><strong>{sample.label}</strong><span aria-hidden="true">↗</span></span>
      </a>
    </li>)}
  </ul>
  <div className="web3-article-heading"><span>From the notebook</span><small>Articles · @isharik99 on X</small></div>
  <ul className="web3-article-gallery" aria-label="Articles by Sharik Hussain">
    {web3Articles.map((article, index) => <li key={article.title} style={{ '--domino-index': index + 3 }}>
      <a href={article.href} target="_blank" rel="noreferrer" aria-label={`Read ${article.title} on X`}><div className="web3-article-art"><img src={article.image} alt={article.title} decoding="async" /></div></a>
    </li>)}
  </ul>
  </div>
}

function PhotoLiftGallery({ samples, onPreview }) {
  const [active, setActive] = useState(1)
  const select = index => index === active ? onPreview(samples[index]) : setActive(index)
  const onKeyDown = event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); setActive(index => Math.min(samples.length - 1, index + 1)) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); setActive(index => Math.max(0, index - 1)) }
  }
  return <div className="photo-lift-gallery" role="region" aria-roledescription="carousel" aria-label="Photography stories" onKeyDown={onKeyDown}>
    <div className="photo-lift-row">
      {samples.map((sample, index) => <button type="button" className={`photo-lift-card${index === active ? ' is-active' : ''}`} key={sample.label} style={{ '--photo-index': index }} aria-label={`${sample.label}, ${index === active ? 'open photo' : 'select photo'}`} aria-current={index === active ? 'true' : undefined} onClick={() => select(index)}>
        <img src={sample.image} alt="" decoding="async" draggable="false" />
        <span>{sample.label}<b aria-hidden="true">{index === active ? '↗' : '+'}</b></span>
      </button>)}
    </div>
    <div className="photo-lift-controls">
      <button type="button" aria-label="Previous photo" disabled={active === 0} onClick={() => setActive(index => index - 1)}>←</button>
      <span aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(samples.length).padStart(2, '0')}</span>
      <button type="button" aria-label="Next photo" disabled={active === samples.length - 1} onClick={() => setActive(index => index + 1)}>→</button>
    </div>
  </div>
}

function FactCover({ fact }) {
  const kind = fact.brand || fact.artwork
  const image = kind === 'spotify' ? '/images/spotify-album-the-beatles.webp' : fact.samples[0]?.image
  if (fieldGuides[kind]) {
    return (
      <div className="field-guide-cover">
        <div className="field-guide-copy">
          <span>{fact.handle}</span>
          <h3>{fact.title}</h3>
          <p>{fact.text}</p>
        </div>
        <FieldGuideArtwork fact={fact} kind={kind} />
      </div>
    )
  }
  return <div className={`facts-cover facts-cover-${kind}`}>
    <div className="facts-cover-copy"><span className="facts-cover-kicker">{fact.handle}</span><h3>{fact.title}</h3><p>{fact.text}</p></div>
    {kind === 'spotify' && <div className="facts-cover-visual facts-cover-record"><div className="facts-cover-equalizer" aria-hidden="true">{[22, 45, 76, 38, 92, 58, 28, 65, 34].map((height, index) => <b key={index} style={{ height: `${height}%` }} />)}</div><span className="facts-cover-spotify-mark" aria-hidden="true"><SpotifyMark size={20} /></span><img src={image} alt="Album art on the music shelf" /><i aria-hidden="true" /><span className="facts-cover-record-note">different artists in the mix</span></div>}
  </div>
}

export function Facts() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [exploring, setExploring] = useState(false)
  const [previewSample, setPreviewSample] = useState(null)
  const factsRef = useRef(null)
  const pointerRef = useRef({ x: null, y: null })
  const personalFacts = useMemo(() => [
    {
      icon: '🎮', eyebrow: 'Channel 01', title: 'Gaming', handle: 'EchoPlex FPS',
      text: 'FPS sessions, strategy worlds, and game systems worth learning. A small corner for sharp gameplay and rabbit holes.',
      highlights: ['Tactical focus', 'Long-form worlds', 'Cult discoveries'],
      href: 'https://www.youtube.com/@echoplexfps', action: 'Visit YouTube', brand: 'youtube',
      background: 'https://unavatar.io/youtube/echoplexfps',
      samples: [
        { label: "Can't Aim Use My Sens", videoId: 'H0FTvvO9M-M' },
        { label: 'High Sens — 0.5 800 DPI', videoId: 'WXv7XTAmK7Q' },
        { label: 'Neon Needs a Nerf', videoId: 'ZXEWtwVu60M' },
      ].map(sample => ({
        ...sample,
        href: `https://youtu.be/${sample.videoId}`,
        image: `https://i.ytimg.com/vi/${sample.videoId}/hqdefault.jpg`,
      })),
    },
    {
      icon: 'x', eyebrow: 'Profile 02', title: 'Web3', handle: '@isharik99',
      text: 'Short, useful explainers about support, AI, and emerging ecosystems — written so technical ideas stay human.',
      highlights: ['Customer support notes', 'AI & Web3 explainers', 'Community stories'],
      href: 'https://x.com/isharik99', action: 'Open X profile', brand: 'x', background: '/images/x-isharik99.jpg',
      samples: [
        { label: 'On-chain notes', href: 'https://x.com/isharik99/status/2123675012360200555?a=SJDCaqTyoIG-m6XNx90&s=20', image: '/images/x-on-chain-notes.webp' },
        { label: 'Field note', href: 'https://x.com/isharik99/status/2123051684117221601?a=yb_y-BeWPxAbcVs0mXI&s=20', image: '/images/x-field-note.webp' },
        { label: 'Community update', href: 'https://x.com/isharik99/status/2065086696459489600?a=4AWLdCKWWVJZCl4MS2c&s=20', image: '/images/x-community-update.webp' },
      ],
    },
    { icon: '🎬', eyebrow: 'Archive 03', title: 'Movies & TV shows', handle: 'A movie nerd, always watching', text: 'Strange worlds, sharp stories, and the ones I keep returning to.', highlights: ['Science fiction', 'Drama & thrillers', 'Series worth unpacking'], action: 'Film shelf', artwork: 'movies', background: '/movies-collage.png', samples: screenShelf },
    {
      icon: <SpotifyMark />,
      eyebrow: 'Playlist 04',
      title: 'Music',
      handle: 'SPOTSICK · Spotify',
      text: 'The records I keep coming back to.',
      highlights: ['R&B', 'Alternative rock', 'On rotation'],
      href: 'https://open.spotify.com/playlist/0XaLZ6o0QcPYsjzqeUa0wM?si=23875b7f4d704e99',
      action: 'Open SPOTSICK on Spotify',
      brand: 'spotify',
      background: '/images/spotify-spotsick.jpg',
      samples: [
        { label: 'keshi', track: 'like i need u', href: 'https://open.spotify.com/track/7ivYWXqrPLs66YwakDuSim', previewId: '7155cf57d50392b853aea96a7befaace69cd6e01', image: '/images/spotify-album-keshi.jpg' },
        { label: 'ZAYN', track: 'Tightrope', href: 'https://open.spotify.com/track/44ngiCPfS8FfdJOqN0eULl', previewId: 'df236bbecfa0a1ede504f501c5b50cca29fbcfa6', image: '/images/spotify-album-zayn.jpg' },
        { label: 'Radiohead', track: 'Creep', href: 'https://open.spotify.com/track/70LcF31zb1H0PyJoS1Sx1r', previewId: 'f3d864283774529a2378100c912bfacb614db751', image: '/images/spotify-album-radiohead.jpg' },
        { label: 'Aerosmith', track: 'Dream On', href: 'https://open.spotify.com/track/5Ih9gbqyxCzTJ43nuSuKnC', previewId: 'a7af61cf950a1014dad001a35a21329211050aaa', image: '/images/spotify-album-aerosmith.jpg' },
        { label: 'Nirvana', track: 'Smells Like Teen Spirit', href: 'https://open.spotify.com/track/4CeeEOM32jQcH3eN9Q2dGj', previewId: '91219ebc0d0505a1001c4b854f8b2451fcec95b8', image: '/images/spotify-album-nirvana.jpg' },
        { label: 'Drake', track: 'Chicago Freestyle (feat. Giveon)', href: 'https://open.spotify.com/track/4wVOKKEHUJxHCFFNUWDn0B', previewId: 'b185a4dc8c70ad2fe9a8846fab83241ea3418921', image: '/images/spotify-album-drake.jpg' },
        { label: 'Tame Impala', track: 'Loser', href: 'https://open.spotify.com/track/7bxaFZ1O3cHkgLKMsdC3xR', previewId: '0015e9347a45b62215447eba657b2fc3ce279d2d', image: '/images/spotify-album-tame-impala.jpg' },
        { label: 'Magnus Ferrell', track: 'Asleep Talking', href: 'https://open.spotify.com/track/5dBXBY5CsYxEjC20ewA9EU', previewId: 'b6b92667f8443403c5c961fffe0de457e1fc5dc8', image: '/images/spotify-album-magnus-ferrell.jpg' },
      ].concat(musicRotation.map(sample => ({ ...sample, href: `https://open.spotify.com/search/${encodeURIComponent(`${sample.label} ${sample.track}`)}` }))),
    },
    {
      icon: 'instagram', eyebrow: 'Photography 05', title: 'Photography & Content', handle: '@purelyvisual_',
      text: 'A space for photography, visual stories, and content — noticing the details and sharing a different perspective.',
      highlights: ['Photography', 'Visual storytelling', 'Creative content'],
      href: 'https://www.instagram.com/purelyvisual_/', action: 'Open Instagram', brand: 'instagram',
      background: '/photography-background.webp',
      samples: [
        instagramSample('Cloud 9', 'p/DcyNHViCezh', 4),
        instagramSample('Side questing', 'p/DWYhfPdkYNm', 5),
        instagramSample('The Long Way Round', 'reel/DWWNV1TkW1U', 1),
      ],
    },
  ], [])
  const activeFact = personalFacts[activeIndex]
  const kind = activeFact.brand || activeFact.artwork
  const fieldGuide = fieldGuides[kind]
  useEffect(() => warmImagesNear(factsRef.current, personalFacts.map(fact => fact.background)), [])
  useEffect(() => {
    if (!exploring || previewSample) return undefined
    const onKeyDown = event => event.key === 'Escape' && setExploring(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [exploring, previewSample])
  const accordionImages = ['/images/gaming-wallpaper.jpg', '/images/web3-wallpaper.png', '/movies-collage.png', '/images/spotify-album-the-beatles.webp', '/images/photography-architecture.jpg']
  const accordionLabels = ['Gaming', 'Web3', 'Movies', 'Music', 'Photography']
  return (
    <section ref={factsRef} id="beyond-cv" data-label="Beyond the CV" className="sheet paper-sheet facts-sheet">
      <Scribble className="facts-note">the things that never fit on a CV ↘</Scribble>
      <Reveal className="facts-heading"><h2>Beyond the <em>CV</em></h2><div className="ink-underline" /><p>A glimpse into what drives me — beyond work, beyond code.</p></Reveal>
      <div className="facts-accordion" aria-label="Beyond the CV interests" onPointerMove={event => {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
        const previous = pointerRef.current
        if (previous.x !== null && Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 6) return
        pointerRef.current = { x: event.clientX, y: event.clientY }
        const card = event.target.closest('.facts-accordion-card')
        if (card) setActiveIndex(Number(card.dataset.index))
      }} onPointerLeave={() => { pointerRef.current = { x: null, y: null } }}>
        {personalFacts.map((fact, index) => <div
          key={fact.title}
          data-index={index}
          className={`facts-accordion-card is-${fact.brand || fact.artwork}${activeIndex === index ? ' is-active' : ''}`}
          style={{ '--accordion-image': `url("${accordionImages[index]}")` }}
        >
          <button type="button" className="facts-accordion-select" onFocus={() => setActiveIndex(index)} onClick={() => { setActiveIndex(index); setExploring(true) }} onKeyDown={event => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault()
              const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + personalFacts.length) % personalFacts.length
              factsRef.current?.querySelectorAll('.facts-accordion-select')[next]?.focus()
            }
          }} aria-label={`Open ${fact.title} details`} aria-expanded={activeIndex === index} aria-haspopup="dialog" />
          <span className="facts-accordion-image" aria-hidden="true" />
          {index === 3 && <span className="facts-accordion-equalizer" aria-hidden="true">{[12, 25, 18, 34, 21, 29, 15, 23, 11].map((height, bar) => <i key={bar} style={{ height }} />)}</span>}
          <span className="facts-accordion-vertical" aria-hidden="true">{accordionLabels[index]}</span>
          <span className="facts-accordion-content">
            <span className="facts-accordion-index">{String(index + 1).padStart(2, '0')} / {String(personalFacts.length).padStart(2, '0')}</span>
            <span className="facts-accordion-details">{index === 3 && <span className="facts-accordion-handle"><SpotifyMark size={19} /> Spotify</span>}<span className="facts-accordion-description">{fact.text}</span><span className="facts-accordion-tags">{fact.highlights.map(item => <span key={item}>{item}</span>)}</span></span>
            <span className="facts-accordion-meta"><span className="facts-accordion-title">{fact.title}</span><button type="button" className="facts-accordion-cta" tabIndex={activeIndex === index ? 0 : -1} aria-label={`Explore ${fact.title}`} aria-haspopup="dialog" onClick={() => { setActiveIndex(index); setExploring(true) }}>{index === 1 ? '@isharik99' : 'Explore'} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5" /><path d="m9 15 6-6" /></svg></button></span>
          </span>
        </div>)}
      </div>
      {exploring && createPortal(
        <div className="facts-modal" role="dialog" aria-modal="true" aria-label={`${activeFact.title} highlights`} onClick={() => setExploring(false)}>
          <section className={`facts-modal-card is-${kind}${fieldGuide ? ' field-guide-dialog' : ''}`} onClick={event => event.stopPropagation()}>
            <button type="button" className="facts-modal-close" onClick={() => setExploring(false)} aria-label="Close highlights">×</button>
            <header><span className="facts-modal-index">{activeFact.eyebrow} / Beyond the CV</span><Scribble>{activeFact.handle}</Scribble><h3>{activeFact.title}</h3><p>{activeFact.text}</p>{activeFact.href && kind !== 'youtube' && <a className="facts-modal-brand" href={activeFact.href} target="_blank" rel="noreferrer" aria-label={activeFact.action}>
              {activeFact.brand === 'spotify' ? <SpotifyMark size={21} /> : activeFact.brand === 'x' ? <XMark /> : activeFact.brand === 'instagram' ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.7" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg> : <span className="facts-modal-brand-icon is-video" aria-hidden="true">▶</span>}
              <span>{activeFact.brand === 'spotify' ? 'SPOTSICK on Spotify' : activeFact.brand === 'youtube' ? 'EchoPlex FPS on YouTube' : activeFact.brand === 'x' ? '@isharik99 on X' : '@purelyvisual_ on Instagram'} <i aria-hidden="true">↗</i></span>
            </a>}</header>
            {kind === 'spotify' ? <MusicStrip samples={activeFact.samples} onPreview={setPreviewSample} previewOpen={Boolean(previewSample)} />
              : kind === 'youtube' ? <GamingShelf clips={activeFact.samples} onPreview={setPreviewSample} />
              : kind === 'movies' ? <MovieShelf samples={activeFact.samples} />
              : kind === 'x' ? <Web3DominoGallery samples={activeFact.samples} />
              : kind === 'instagram' ? <PhotoLiftGallery samples={activeFact.samples} onPreview={setPreviewSample} />
              : <FieldGuideSamples kind={kind} samples={activeFact.samples} onPreview={setPreviewSample} />}
          </section>
          {previewSample && (
            <FactsMediaPreview sample={previewSample} onClose={() => setPreviewSample(null)} />
          )}
        </div>, document.body)}
    </section>
  )
}

export function ThankYou() {
  return (
    <section id="thank-you" className="sheet paper-sheet thank-you-sheet" aria-labelledby="thank-you-title">
      <Reveal className="thank-you-content">
        <div className="contact-left">
          <img src="/profile-photo.webp" alt="Sharik Hussain" />
          <h2 id="thank-you-title">Thank you</h2>
          <div className="ink-underline" aria-hidden="true" />
        </div>
        <div className="contact-letter">
          <p>I build where people, systems, and AI meet. If your team needs careful evaluation, dependable operations, clear customer communication, or thoughtful ecosystem content, I would love to hear what you are working on.</p>
          <p>I am comfortable with complex workflows, honest feedback, and the patient work required to make technology more useful.</p>
          <p>Let’s make something clear, reliable, and worth shipping.</p>
          <div className="contact-signature" aria-label="Signed by Sharik"><InkSignature defer>Sharik</InkSignature></div>
        </div>
      </Reveal>
    </section>
  )
}

export function Footer({ theme }) {
  const [messageOpen, setMessageOpen] = useState(false)
  const [messageStatus, setMessageStatus] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [sendPhase, setSendPhase] = useState('sending')

  useEffect(() => {
    if (!isSending && !messageSent) return undefined

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [isSending, messageSent])

  const wait = milliseconds => new Promise(resolve => window.setTimeout(resolve, milliseconds))
  const closeMessage = () => {
    setMessageOpen(false)
    setMessageSent(false)
    setMessageStatus('')
  }
  const returnToPortfolio = () => {
    closeMessage()
    window.setTimeout(() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const sendMessage = async event => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const startedAt = performance.now()
    setIsSending(true)
    setSendPhase('sending')
    setMessageStatus('')
    try {
      const response = await fetch('/api/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form)),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Message could not be sent.')
      }
      // Let the compact send-orbit complete even when the endpoint responds
      // instantly, so the confirmation never feels like a visual flash.
      await wait(Math.max(0, 2700 - (performance.now() - startedAt)))
      setSendPhase('complete')
      await wait(680)
      formElement.reset()
      setMessageSent(true)
    } catch (error) {
      setMessageStatus(error.message || 'Unable to send right now. Please email me directly.')
    } finally {
      setIsSending(false)
      setSendPhase('sending')
    }
  }

  return (
    <>
      <PortfolioFooter theme={theme} onEmail={() => setMessageOpen(true)} />
      {messageOpen && ((isSending || messageSent) ? createPortal(<div className={`message-sending-screen${messageSent ? ' is-sent' : ''}`} role="status" aria-live="polite">
        {isSending ? <><MessageSphere phase={sendPhase} size={264} />
          <p>Sending message <span className="sending-dots" aria-hidden="true"><i /> <i /> <i /></span></p>
        </> : <div className="message-sent-popover">
          <button className="message-success-close" type="button" onClick={closeMessage} aria-label="Close message confirmation">×</button>
          <span className="message-success-mark" aria-hidden="true">✓</span>
          <Scribble>received</Scribble>
          <h3 id="discord-message-title">Message sent</h3>
          <p>Thank you — I’ll reply to the email you provided as soon as I can.</p>
          <div className="message-sent-actions">
            <button className="discord-submit message-back" type="button" onClick={() => { setMessageSent(false); setMessageStatus('') }}>← Send another message</button>
            <button className="message-home" type="button" onClick={returnToPortfolio}>Back to portfolio ↑</button>
          </div>
        </div>}
      </div>, document.body) : createPortal(<div
        className="discord-dialog-backdrop"
        role="presentation"
        onPointerDown={event => {
          if (event.target === event.currentTarget) closeMessage()
        }}
      >
        <section
          className="discord-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="discord-message-title"
          onPointerDown={event => event.stopPropagation()}
          onClick={event => event.stopPropagation()}
        >
          <button className="discord-dialog-close" type="button" onPointerDown={event => { event.preventDefault(); event.stopPropagation(); closeMessage() }} onClick={event => { event.stopPropagation(); closeMessage() }} aria-label="Close message form">×</button>
          <>
          <Scribble>let’s talk</Scribble>
          <h3 id="discord-message-title">Send me a message</h3>
          <p>Tell me what you’re building, hiring for, or hoping to solve. I’ll reply to the email you provide.</p>
          <form onSubmit={sendMessage} onPointerDown={event => event.stopPropagation()}>
            <label>Name<input name="name" type="text" required autoComplete="name" maxLength="80" /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" maxLength="160" /></label>
            <label>What is this about?<select name="purpose" defaultValue="Opportunity"><option>Opportunity</option><option>Project collaboration</option><option>Customer support / AI</option><option>Just saying hello</option></select></label>
            <label className="message-field">Message<textarea name="message" required rows="4" maxLength="1500" /><button className="message-send-icon" type="submit" aria-label="Send message" onPointerDown={event => event.stopPropagation()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5 20 12 4 18.5l2.2-5.2L13 12 6.2 10.7z" /></svg></button></label>
            <p className="discord-status" aria-live="polite">{messageStatus}</p>
          </form>
          </>
        </section>
      </div>, document.body))}
    </>
  )
}

function PortfolioFooter({ theme, onEmail }) {
  const dark = theme === 'dark'

  return (
    <PushpinTearFooter
      id="contact"
      className="tpf-portfolio"
      brand="Portfolio."
      name={profile.name}
      logo={<span className="tpf-portfolio-monogram" aria-hidden="true">SH</span>}
      logoHref="#home"
      primaryLink={{ label: 'Download resume', href: '/resume.pdf', download: true }}
      timeZone={null}
      contactActions={
        <>
          <button type="button" className="tpf-contact-primary" aria-haspopup="dialog" onClick={() => { playUiSound('press'); onEmail() }}>Email me here</button>
          <a href="https://calendly.com/sharikhussain99/30min" target="_blank" rel="noreferrer" onClick={() => playUiSound('press')}>Schedule a call <span aria-hidden="true">↗</span></a>
        </>
      }
      socials={[
        { icon: 'github', label: 'GitHub', href: profile.socials.github, mark: <GitHubMark className="tpf-ico" /> },
        { icon: 'linkedin', label: 'LinkedIn', href: profile.socials.linkedin },
        { icon: 'x', label: 'X', href: profile.socials.x },
      ]}
      copyright="© 2026 Sharik Hussain"
      handle={{ label: '@isharik99', href: profile.socials.x }}
      sheet={dark ? '#303443' : '#44495d'}
      paper={dark ? '#15151b' : '#f4f3ef'}
      sheetInk="#f5f3ee"
      paperInk={dark ? '#f0efeb' : '#282831'}
      fontSans="var(--sans)"
      height="clamp(410px, 54svh, 540px)"
      seed={23}
    />
  )
}
