'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { experiences } from '@/lib/content'
import { cn } from '@/lib/utils'

const OUT = [0.23, 1, 0.32, 1] as const

export default function Experience() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const exp = experiences[active]

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, experiences.length - 1))
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    }
  }

  return (
    <section id="experience" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading
          eyebrow="Experience"
          title="Five roles, one throughline"
          description="One line runs through all of it: staying close to the people that technology is meant to serve, across customer support and AI evaluation."
        />

        <Reveal delay={0.1} className="mt-12 grid gap-4 lg:grid-cols-[300px_1fr] lg:gap-8">
          {/* Rail */}
          <div
            ref={listRef}
            role="tablist"
            aria-label="Work history"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible no-scrollbar"
          >
            {experiences.map((e, i) => {
              const on = active === i
              return (
                <button
                  key={e.company}
                  role="tab"
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    'group relative shrink-0 rounded-xl px-4 py-3 text-left transition-colors duration-200 lg:w-full',
                    on ? 'bg-surface' : 'hover:bg-surface/50'
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="exp-rail"
                      className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <div className={cn('text-sm font-medium transition-colors', on ? 'text-fg' : 'text-fg-muted group-hover:text-fg')}>
                    {e.company}
                  </div>
                  <div className="mt-0.5 hidden text-xs text-fg-subtle lg:block">{e.role}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-fg-subtle">{e.period}</div>
                </button>
              )
            })}
          </div>

          {/* Detail */}
          <div className="glass min-h-[420px] rounded-2xl p-6 sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, filter: reduce ? 'none' : 'blur(5px)', y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: reduce ? 'none' : 'blur(5px)' }}
                transition={{ duration: 0.35, ease: OUT }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-fg">{exp.role}</h3>
                    <div className="mt-1 text-sm font-medium text-accent">{exp.company}</div>
                    <div className="mt-0.5 text-xs text-fg-muted">{exp.companyDesc}</div>
                  </div>
                  {exp.current && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-600 dark:text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Current
                    </span>
                  )}
                </div>

                <div className="mt-3 font-mono text-[11px] text-fg-subtle">
                  {exp.period} · {exp.type}
                </div>

                <p className="mt-5 text-sm leading-relaxed text-fg-muted">{exp.description}</p>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-fg-muted">
                      <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-5">
                  {exp.tags.map((t) => (
                    <span key={t} className="rounded-md bg-[var(--surface-muted)] px-2 py-1 font-mono text-[10px] text-fg-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
