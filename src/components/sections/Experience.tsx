'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'
import { experiences } from '@/lib/content'

const SLIDE_DURATION = 6000

export default function Experience() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    experiences.forEach(({ logo }) => {
      const image = new window.Image()
      image.decoding = 'async'
      image.src = logo
      image.decode?.().catch(() => undefined)
    })
  }, [])

  const goTo = useCallback((index: number) => {
    if (index === active) return
    progressRef.current = 0
    setProgress(0)
    setActive(index)
  }, [active])

  const goNext = useCallback(() => goTo((active + 1) % experiences.length), [active, goTo])
  const goPrev = useCallback(() => goTo((active - 1 + experiences.length) % experiences.length), [active, goTo])

  useEffect(() => {
    if (reduce || isPaused) return
    let elapsed = progressRef.current * SLIDE_DURATION / 100
    const interval = window.setInterval(() => {
      elapsed = Math.min(SLIDE_DURATION, elapsed + 50)
      const nextProgress = elapsed / SLIDE_DURATION * 100
      progressRef.current = nextProgress
      setProgress(nextProgress)
      if (elapsed >= SLIDE_DURATION) goNext()
    }, 50)
    return () => window.clearInterval(interval)
  }, [active, goNext, isPaused, reduce])

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      goNext()
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      goPrev()
    }
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }
  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current)
    touchStartX.current = null
    if (Math.abs(delta) > 55) delta > 0 ? goNext() : goPrev()
  }
  const goToProgressItem = (index: number) => {
    goTo(index)
  }

  const item = experiences[active]
  const accent = 'var(--accent)'
  const indexLabel = String(active + 1).padStart(2, '0')
  const totalLabel = String(experiences.length).padStart(2, '0')

  return (
    <section id="experience" className="relative px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-content">
        <h2 className="sr-only">Experience</h2>
        <Reveal delay={0.1}>
          <div
            className={`experience-editorial ${isPaused ? 'is-paused' : ''}`}
            style={{ '--experience-accent': accent } as React.CSSProperties}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false)
            }}
            onKeyDown={onKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Work experience carousel. Use arrow keys, swipe, or the navigation controls to browse."
          >
            <div className="experience-editorial-main">
              <div className="experience-editorial-copy">
                  <motion.div
                    key={item.company}
                    className="experience-editorial-copy-inner"
                    aria-live="polite"
                    initial={reduce ? false : { y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: reduce ? 0 : 0.36, ease: 'easeOut' }}
                  >
                    <div className="experience-editorial-index"><span />{indexLabel} / {totalLabel}</div>
                    <h3 className="experience-editorial-title">{item.company}</h3>
                    <div className="experience-editorial-meta">
                      <p className="experience-editorial-subtitle">{item.role}</p>
                      <p className="experience-editorial-period">{item.period} <span>·</span> {item.type}</p>
                      <p className="experience-editorial-company-desc">{item.companyDesc}</p>
                    </div>
                    <p className="experience-editorial-description">{item.description}</p>
                    <ul className="experience-editorial-highlights" aria-label={`${item.company} responsibilities`}>
                      {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                    </ul>
                  </motion.div>
              </div>

              <div className="experience-editorial-visual" aria-label={`${item.company} visual`}>
                  <motion.div
                    key={item.company}
                    className="experience-editorial-art"
                    style={{ '--experience-accent': accent } as React.CSSProperties}
                    initial={reduce ? false : { y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: reduce ? 0 : 0.36, ease: 'easeOut' }}
                  >
                    <div className="experience-editorial-art-grid" />
                    <span className="experience-editorial-art-number">{indexLabel}</span>
                    <div className="experience-editorial-logo-wrap">
                      <Image src={item.logo} alt={`${item.company} logo`} fill sizes="(max-width: 767px) 90vw, 48vw" className="experience-editorial-logo" unoptimized />
                    </div>
                    <span className="experience-editorial-art-caption">{item.companyDesc}</span>
                  </motion.div>
                <span className="experience-editorial-corner experience-editorial-corner-tl" aria-hidden="true" />
                <span className="experience-editorial-corner experience-editorial-corner-br" aria-hidden="true" />
              </div>
            </div>

            <div className="experience-editorial-footer">
              <div className="experience-editorial-nav" aria-label="Experience controls">
                <button type="button" onClick={goPrev} aria-label="Previous experience"><ArrowLeft size={18} /></button>
                <button type="button" onClick={goNext} aria-label="Next experience"><ArrowRight size={18} /></button>
              </div>
              <div className="experience-editorial-progress" aria-label="Choose an experience">
                {experiences.map((experience, index) => {
                  const isActive = index === active
                  return (
                    <button
                      key={experience.company}
                      type="button"
                      className={`experience-editorial-progress-item${isActive ? ' is-active' : ''}`}
                      onClick={() => goToProgressItem(index)}
                      aria-label={`Show ${experience.company}, ${index + 1} of ${experiences.length}`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <span className="experience-editorial-dot"><span style={{ transform: isActive ? `scaleX(${Math.max(0.32, progress / 100)})` : 'scaleX(0.35)' }} /></span>
                    </button>
                  )
                })}
              </div>
              <span className="experience-editorial-count">{indexLabel}<span>/</span>{totalLabel}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
