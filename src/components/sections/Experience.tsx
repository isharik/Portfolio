'use client'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { experiences } from '@/lib/content'

const OUT = [0.23, 1, 0.32, 1] as const

export default function Experience() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const step = (turn: number) => {
    setDirection(turn)
    setActive((current) => (current + turn + experiences.length) % experiences.length)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      step(-1)
    }
  }

  return (
    <section id="experience" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading
          eyebrow="Experience"
          title="Seven roles, one throughline"
          description="One line runs through all of it: staying close to the people that technology is meant to serve, across customer support and AI evaluation."
        />

        <Reveal delay={0.1} className="mt-12">
          <div className="experience-showcase grid gap-8 lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.7fr)] lg:items-start">
            <div className="experience-stack-column">
              <div className="experience-deck" role="region" aria-label="Work experience cards. Use the next and previous buttons to browse." tabIndex={0} onKeyDown={onKeyDown}>
                <AnimatePresence initial={false} custom={direction}>
                  {experiences.map((item, index) => {
                    const depth = direction > 0
                      ? (index - active + experiences.length) % experiences.length
                      : (active - index + experiences.length) % experiences.length
                    const isActive = depth === 0
                    if (!isActive && depth > 2) return null
                    const offset = Math.max(0, depth - 1) * 48

                    return (
                      <motion.article
                        layout
                        key={item.company}
                        className={isActive ? 'experience-role-card is-active' : 'experience-role-card experience-role-preview-card'}
                        aria-hidden={!isActive}
                        style={{
                          zIndex: isActive ? 20 : 10 - depth,
                          top: isActive ? undefined : `calc(100% - 154px + ${offset}px)`,
                          transformOrigin: '50% 80%',
                          transformStyle: 'preserve-3d',
                          backfaceVisibility: 'hidden',
                        }}
                        initial={false}
                        animate={isActive
                          ? { opacity: 1, scale: 1, z: 0, rotateX: 0, rotateY: 0, y: 0 }
                          : { opacity: 1, scale: 1 - depth * 0.025, z: -depth * 22, rotateY: reduce ? 0 : direction * -1.2, y: 0 }}
                        transition={reduce ? { duration: 0.24 } : { type: 'spring', stiffness: 115, damping: 22, mass: 0.8 }}
                        exit={{ opacity: 0, scale: 0.96, y: direction > 0 ? 28 : -28, z: -70, rotateY: direction > 0 ? -7 : 7 }}
                      >
                        <div className="experience-role-summary">
                          <span className="experience-role-logo"><Image src={item.logo} alt="" width={26} height={26} className="h-full w-full object-contain" unoptimized /></span>
                          <span className="experience-role-copy">
                            <strong>{item.company}</strong>
                            <small>{item.role}</small>
                            <small className="experience-role-period">{item.period}</small>
                          </span>
                        </div>
                      </motion.article>
                    )
                  })}
                </AnimatePresence>
              </div>
              <div className="experience-deck-controls" aria-label="Experience navigation">
                <button type="button" className="experience-deck-nav" onClick={() => step(-1)}><ArrowLeft size={16} /><span>Previous</span></button>
                <span className="experience-deck-count" aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(experiences.length).padStart(2, '0')}</span>
                <button type="button" className="experience-deck-nav" onClick={() => step(1)}><span>Next</span><ArrowRight size={16} /></button>
              </div>
            </div>

            {(() => {
              const item = experiences[active]
              return (
                <article className="experience-detail-card glass relative isolate min-h-[420px] self-start overflow-hidden rounded-2xl p-6 sm:p-8">
                  <div className="experience-card-watermark pointer-events-none absolute right-0 top-1/2 z-0 aspect-square w-[min(78%,360px)] -translate-y-1/2" aria-hidden="true">
                    <motion.div key={item.company} className="absolute inset-0" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : 0.32, ease: OUT }}>
                      <Image src={item.logo} alt="" fill sizes="360px" className="object-contain" unoptimized />
                    </motion.div>
                  </div>
                  <motion.div className="relative z-10" key={`${active}-${item.company}`} initial={reduce ? false : { opacity: 0, y: direction * 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.3, ease: OUT }}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-fg">{item.role}</h3>
                        <div className="mt-2 flex items-center gap-2.5 text-sm font-medium text-accent">
                          <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-[var(--elevated)] p-1 shadow-sm"><Image src={item.logo} alt={`${item.company} logo`} width={22} height={22} className="h-[22px] w-[22px] object-contain" unoptimized /></span>
                          {item.company}
                        </div>
                        <div className="mt-0.5 text-xs text-fg-muted">{item.companyDesc}</div>
                      </div>
                      {item.current && <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-600 dark:text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Current</span>}
                    </div>
                    <div className="mt-3 font-mono text-[11px] text-fg-subtle">{item.period} · {item.type}</div>
                    <p className="mt-5 text-sm leading-relaxed text-fg-muted">{item.description}</p>
                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">{item.highlights.map((highlight) => <li key={highlight} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-fg-muted"><Check size={14} className="mt-0.5 shrink-0 text-accent" /><span>{highlight}</span></li>)}</ul>
                    <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-5">{item.tags.map((tag) => <span key={tag} className="rounded-md bg-[var(--surface-muted)] px-2 py-1 font-mono text-[10px] text-fg-muted">{tag}</span>)}</div>
                  </motion.div>
                </article>
              )
            })()}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
