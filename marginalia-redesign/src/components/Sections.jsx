import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Reveal } from './Chrome'
import { TextRoll } from './ui/TextRoll'
import { credentials, experiences, languages, profile, projects, skillGroups } from '../data'

function Scribble({ children, className = '' }) {
  return <span className={`scribble ${className}`}>{children}</span>
}

function InkSignature({ children, defer = false }) {
  return <span className={`ink-signature${defer ? ' ink-signature-deferred' : ' is-revealed'}`} aria-label={children}>{children}</span>
}

function PortraitNote({ children, className = '' }) {
  return <Scribble className={`note ${className}`}>{children}<svg viewBox="0 0 42 36" aria-hidden="true"><path d="M2 3 C17 4 27 14 34 29" /><path d="M25 25 L35 30 L36 19" /></svg></Scribble>
}

function MessageSphere({ phase = 'sending' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const size = 156
    const pixelRatio = Math.min(2, window.devicePixelRatio || 1)
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
    const ink = phase === 'complete'
      ? '#49c77a'
      : (styles.getPropertyValue('--ink').trim() || '#f0efeb')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let angle = 0
    let previous = performance.now()

    const draw = now => {
      const delta = Math.min(.04, (now - previous) / 1000)
      previous = now
      if (!reducedMotion) angle += delta * 1.35
      const cosine = Math.cos(angle)
      const sine = Math.sin(angle)
      const tiltCosine = Math.cos(.38)
      const tiltSine = Math.sin(.38)
      const projected = dots.map(dot => {
        const rotatedX = dot.x * cosine + dot.z * sine
        const rotatedZ = dot.z * cosine - dot.x * sine
        const rotatedY = dot.y * tiltCosine - rotatedZ * tiltSine
        const depth = rotatedZ * tiltCosine + dot.y * tiltSine
        return { x: rotatedX, y: rotatedY, depth }
      }).sort((a, b) => a.depth - b.depth)

      context.clearRect(0, 0, size, size)
      context.fillStyle = ink
      projected.forEach(dot => {
        const perspective = 1 / (1.8 - dot.depth * .5)
        const radius = (.65 + (dot.depth + 1) * .65) * perspective
        context.globalAlpha = .18 + ((dot.depth + 1) / 2) * .76
        context.beginPath()
        context.arc(size / 2 + dot.x * 57 * perspective, size / 2 - dot.y * 57 * perspective, radius, 0, Math.PI * 2)
        context.fill()
      })
      context.globalAlpha = 1
      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [phase])

  return <div className={`message-sphere-stage is-${phase}`} aria-hidden="true"><canvas className="message-sphere" ref={canvasRef} /></div>
}

export function Cover() {
  return (
    <section id="home" data-label="Cover" className="sheet cover-sheet paper-sheet">
      <Reveal className="cover-stage">
        <div className="cover-kicker">AI QUALITY · CUSTOMER CLARITY · RELIABLE OPERATIONS</div>
        <h1><TextRoll>Portfolio</TextRoll></h1>
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
        <h2>Hello.</h2>
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
      width: 134,
      margin: 1,
      color: { dark: '#171719', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    })
  }, [])
  return <a className="qr" href="/resume.pdf" download="Sharik-Hussain-CV.pdf" aria-label="Download Sharik Hussain's CV"><canvas ref={canvasRef} /></a>
}

export function Education() {
  return (
    <section id="education" data-label="Education" className="sheet paper-sheet education-sheet">
      <Reveal className="education-main">
        <h2>Education</h2><div className="ink-underline short" />
        <p className="section-intro">A computer science foundation strengthened through hands-on AI operations, systems work, and ecosystem contribution.</p>
        <ul className="credential-list">
          {credentials.map(item => <li key={item.title}>
            <a href={item.href || undefined} target={item.href ? '_blank' : undefined} rel={item.href ? 'noreferrer' : undefined} aria-disabled={!item.href}>
              <i aria-hidden>•</i><span className="credential-logo">{item.logo ? <img src={item.logo} alt="" /> : <b className="aws-mark">aws</b>}</span><b>{item.title}</b><span>{item.org}</span><span>{item.period}</span><em>{item.note}</em>{item.href && <u>↗</u>}
            </a>
          </li>)}
        </ul>
      </Reveal>
      <Reveal className="education-aside">
        <div className="education-postcards">
          <div className="education-card cv-card">
            <div className="cv-card-copy"><Scribble>scan me</Scribble><small>CURRICULUM / 2026</small></div>
            <QRPattern />
            <Scribble className="cv-card-title">my curriculum vitae ↗</Scribble>
            <span className="education-stamp" aria-label="Signed by Sharik"><b>✦</b><Scribble>Sharik</Scribble></span>
            <span className="ticket-notch ticket-notch-left" aria-hidden="true" />
            <span className="ticket-notch ticket-notch-right" aria-hidden="true" />
          </div>
          <div className="education-card languages-card">
            <div className="languages-card-head"><Scribble>languages</Scribble><span aria-hidden>☕</span></div>
            <p>Words I use to make technology feel human.</p>
            <div className="language-list">
              {languages.map(lang => <div key={lang.name}><b>{lang.name}</b><span>{lang.level}</span><i><u style={{ width: `${lang.value}%` }} /></i></div>)}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
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
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('resize', positionTrack)
    return () => {
      window.removeEventListener('wheel', handleWheel)
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

    resetEntryFocus()
    window.addEventListener('scroll', resetEntryFocus, { passive: true })
    return () => window.removeEventListener('scroll', resetEntryFocus)
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
        <div className="skill-column"><h3>Customer &amp; support</h3>{supportSkills.map(skill => <div key={skill}><span>•</span>{skill}</div>)}</div>
        <div className="skill-column"><h3>AI &amp; development</h3>{technicalSkills.map(skill => <div key={skill}><span>•</span>{skill}</div>)}</div>
      </div>
      <Scribble className="toolkit-note">there’s always more in the toolkit ✎</Scribble>
    </section>
  )
}

export function Projects() {
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const preload = () => {
      projects.forEach(project => {
        const image = new Image()
        image.decoding = 'async'
        image.src = project.image
      })
    }
    const idle = window.requestIdleCallback?.(preload, { timeout: 1200 })
    if (!idle) {
      const timer = window.setTimeout(preload, 180)
      return () => window.clearTimeout(timer)
    }
    return () => window.cancelIdleCallback?.(idle)
  }, [])

  return (
    <section id="projects" data-label="Projects" className="sheet paper-sheet projects-sheet">
      <Reveal className="projects-heading"><h2>Projects.</h2><div className="ink-underline short" /><Scribble>work that left the notebook</Scribble></Reveal>
      <div className="project-gallery">
        {projects.map((project, index) => {
          const phonePreview = project.title === 'Onchain Wizard' ? '/logos/pharos-network.png' : (project.phoneImage || project.image)
          return (
          <Reveal className="project-item" key={project.title}>
            <Scribble className="project-note">{project.note} ↓</Scribble>
            <button className="device" onClick={() => setSelected(project)} aria-label={`View ${project.title} details`}>
              <div className="device-speaker" />
              <div className={`device-screen project-screen-${index}`}><img src={phonePreview} alt="" /><div className="device-shade" /><div className="device-copy"><span>Open project ↗</span></div></div>
            </button>
            <Scribble className="project-number">{index + 1}. {project.title}</Scribble>
          </Reveal>
          )
        })}
      </div>
      {selected && <div className="project-modal" role="dialog" aria-modal="true" aria-label={`${selected.title} project details`} onClick={() => setSelected(null)}>
        <div className="project-modal-card" onClick={event => event.stopPropagation()}>
          <button className="project-modal-close" onClick={() => setSelected(null)}>close ×</button>
          <Scribble>{selected.note}</Scribble>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
          <img src={selected.image} alt={`${selected.title} preview`} />
          <a href={selected.url} target="_blank" rel="noreferrer">Visit live project ↗</a>
        </div>
      </div>}
    </section>
  )
}

export function Facts() {
  const personalFacts = [
    { icon: '🎮', title: 'Gaming', text: 'Strategy, worlds, and systems that reward curiosity.' },
    { icon: '🎬', title: 'Movies', text: 'Science fiction, thrillers, and stories with something to unpack.' },
    { icon: '₿', title: 'Crypto & Web3', text: 'On-chain products, ecosystems, and the communities forming around them.' },
    { icon: '✎', title: 'Content creation', text: 'Threads and explainers that make emerging technology easier to enter.' },
    { icon: '◉', title: 'Human in the loop', text: 'I care about the judgment behind quality AI systems.' },
    { icon: '☕', title: 'Always learning', text: 'New tools are interesting; knowing when to use them is the real craft.' },
  ]
  return (
    <section data-label="Beyond the CV" className="sheet paper-sheet facts-sheet">
      <Scribble className="facts-note">the things that never fit on a CV ↘</Scribble>
      <Reveal className="facts-heading"><h2>Beyond the CV</h2><div className="ink-underline" /></Reveal>
      <div className="facts-grid">
        {personalFacts.map(fact => <Reveal className="fact" key={fact.title}><strong>{fact.icon}</strong><h3>{fact.title}</h3><p>{fact.text}</p></Reveal>)}
      </div>
    </section>
  )
}

export function Contact() {
  const [messageOpen, setMessageOpen] = useState(false)
  const [messageStatus, setMessageStatus] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [sendPhase, setSendPhase] = useState('sending')

  const wait = milliseconds => new Promise(resolve => window.setTimeout(resolve, milliseconds))

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
    <section id="contact" data-label="Contact" className="sheet paper-sheet contact-sheet">
      <Reveal className="contact-left">
        <img src="/profile-photo.webp" alt="Sharik Hussain" />
        <h2>Thank you</h2><div className="ink-underline" />
        <b>Get in touch:</b>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <div className="contact-links"><a href={profile.socials.github}>GitHub</a><a href={profile.socials.x}>X / Twitter</a><a href={profile.socials.linkedin}>LinkedIn</a></div>
      </Reveal>
      <Reveal className="contact-letter">
        <p>I build where people, systems, and AI meet. If your team needs careful evaluation, dependable operations, clear customer communication, or thoughtful ecosystem content, I would love to hear what you are working on.</p>
        <p>I am comfortable with complex workflows, honest feedback, and the patient work required to make technology more useful.</p>
        <p>Let’s make something clear, reliable, and worth shipping.</p>
        <div className="contact-signature" aria-label="Signed by Sharik"><InkSignature defer>Sharik</InkSignature></div>
      </Reveal>
      <div className="contact-actions">
        <a className="booking-card" href="https://calendly.com/sharikhussain99/30min" target="_blank" rel="noreferrer">
          <span className="booking-icon" aria-hidden="true">◷</span>
          <span><b>Book a 30-min call</b><small>Pick an open slot on Google Meet</small></span>
          <i aria-hidden>↗</i>
        </a>
        <button className="booking-card discord-card" type="button" onClick={() => { setMessageStatus(''); setMessageSent(false); setMessageOpen(true) }}>
          <span className="booking-icon" aria-hidden="true">✦</span>
          <span><b>Email me here</b><small>Send a message or opportunity</small></span>
          <i aria-hidden>↗</i>
        </button>
      </div>
      {messageOpen && <div className="discord-dialog-backdrop" role="presentation" onMouseDown={() => setMessageOpen(false)}>
        <section className="discord-dialog" role="dialog" aria-modal="true" aria-labelledby="discord-message-title" onMouseDown={event => event.stopPropagation()}>
          <button className="discord-dialog-close" type="button" onClick={() => setMessageOpen(false)} aria-label="Close message form">×</button>
          {isSending ? <div className="message-processing" role="status" aria-live="polite">
            <MessageSphere phase={sendPhase} />
            <p>Sending message <span className="sending-dots" aria-hidden="true"><i /> <i /> <i /></span></p>
          </div> : messageSent ? <div className="message-success" role="status">
            <span className="message-success-mark" aria-hidden="true">✓</span>
            <Scribble>received</Scribble>
            <h3 id="discord-message-title">Message sent</h3>
            <p>Thank you — I’ll reply to the email you provided as soon as I can.</p>
            <button className="discord-submit message-back" type="button" onClick={() => { setMessageSent(false); setMessageStatus('') }}>← Send another message</button>
          </div> : <>
          <Scribble>let’s talk</Scribble>
          <h3 id="discord-message-title">Send me a message</h3>
          <p>Tell me what you’re building, hiring for, or hoping to solve. I’ll reply to the email you provide.</p>
          <form onSubmit={sendMessage}>
            <label>Name<input name="name" type="text" required autoComplete="name" maxLength="80" /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" maxLength="160" /></label>
            <label>What is this about?<select name="purpose" defaultValue="Opportunity"><option>Opportunity</option><option>Project collaboration</option><option>Customer support / AI</option><option>Just saying hello</option></select></label>
            <label className="message-field">Message<textarea name="message" required rows="4" maxLength="1500" /><button className="message-send-icon" type="submit" aria-label="Send message"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5 20 12 4 18.5l2.2-5.2L13 12 6.2 10.7z" /></svg></button></label>
            <p className="discord-status" aria-live="polite">{messageStatus}</p>
          </form>
          </>}
        </section>
      </div>}
    </section>
  )
}

export function Footer() {
  return <footer className="folio-footer paper-sheet"><span>Portfolio 2026</span><span>Curriculum Vitae</span><span>Sharik Hussain</span><a href="#home">back to top ↑</a></footer>
}
