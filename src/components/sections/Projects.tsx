'use client'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Github, Dot, Download } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { projects, profile } from '@/lib/content'
import { cn } from '@/lib/utils'

const OUT = [0.23, 1, 0.32, 1] as const

function ProjectVisual({ accent, index }: { accent: string; index: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${accent})` }}
      />
      <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <span className="absolute bottom-4 right-5 font-mono text-6xl font-bold text-white/25">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  )
}

export default function Projects() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const p = projects[active]

  return (
    <section id="projects" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Projects"
            title="Built in my free time"
            description="The products, tools, and experiments I make when nobody's assigning them, just for the fun of shipping something real. Every one of these is live."
          />
          {profile.resume && (
            <a
              href={profile.resume}
              download="Sharik-Hussain-Resume.pdf"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-surface/40 px-4 py-2 text-sm font-medium text-fg transition-colors duration-200 hover:border-border-strong hover:bg-surface/70 sm:self-auto"
            >
              <Download size={15} className="text-fg-muted transition-colors group-hover:text-accent" />
              Résumé
              <span className="font-mono text-[10px] text-fg-subtle">PDF</span>
            </a>
          )}
        </div>

        <Reveal delay={0.1} className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
          {/* Featured panel */}
          <div className="glass overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/10] w-full sm:aspect-[2/1]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, filter: reduce ? 'none' : 'blur(6px)', scale: 1.02 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, filter: reduce ? 'none' : 'blur(6px)' }}
                  transition={{ duration: 0.4, ease: OUT }}
                  className="absolute inset-0"
                >
                  <ProjectVisual accent={p.accent} index={active} />
                </motion.div>
              </AnimatePresence>
              <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur-sm">
                {p.status}
              </span>
            </div>

            <div className="p-6 sm:p-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: OUT }}
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                    {p.tagline}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-fg">{p.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">{p.description}</p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-surface/50 px-2 py-1 font-mono text-[10px] text-fg-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition-[filter,transform] duration-200 hover:brightness-110 active:scale-95"
                      >
                        Visit live <ArrowUpRight size={15} />
                      </a>
                    )}
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-fg transition-colors hover:border-border-strong"
                      >
                        <Github size={15} /> Code
                      </a>
                    )}
                    {!p.link && !p.repo && (
                      <span className="inline-flex items-center gap-1 text-sm text-fg-subtle">
                        <Dot size={16} /> Internal / not public
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Album list */}
          <div className="flex flex-col gap-2.5" role="tablist" aria-label="Project list">
            {projects.map((proj, i) => (
              <button
                key={proj.title}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={cn(
                  'group flex items-center gap-4 rounded-2xl border p-3 text-left transition-[border-color,background-color,transform] duration-200 ease-out active:scale-[0.99]',
                  active === i
                    ? 'border-[var(--border-strong)] bg-surface'
                    : 'border-border bg-surface/40 hover:border-border-strong hover:bg-surface/70'
                )}
              >
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                  <ProjectVisual accent={proj.accent} index={i} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-fg">{proj.title}</span>
                  </div>
                  <div className="truncate text-xs text-fg-muted">{proj.tagline}</div>
                </div>
                <ArrowUpRight
                  size={16}
                  className={cn(
                    'shrink-0 transition-[opacity,transform] duration-200',
                    active === i ? 'text-accent opacity-100' : 'text-fg-subtle opacity-0 group-hover:opacity-100'
                  )}
                />
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
