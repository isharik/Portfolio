'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Dot, Github } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { projects, profile, type Project } from '@/lib/content'
import { cn } from '@/lib/utils'

const OUT = [0.23, 1, 0.32, 1] as const

function ProjectVisual({ project, index }: { project: Project; index: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--surface-muted)]">
      {project.image ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 48vw, (min-width: 640px) 65vw, 88vw"
          className="object-cover object-center"
        />
      ) : (
        <>
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${project.accent})` }} />
          <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:32px_32px]" />
          <span className="absolute bottom-5 right-5 font-mono text-5xl font-bold text-white/25">{String(index + 1).padStart(2, '0')}</span>
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
    </div>
  )
}

export default function Projects() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const activeProject = projects[active]
  const rail = useMemo(() => [...projects.slice(active), ...projects.slice(0, active)], [active])
  const step = (direction: number) => setActive((current) => (current + direction + projects.length) % projects.length)

  return (
    <section id="projects" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Projects" title="Built in my free time" description="The products, tools, and experiments I make when nobody's assigning them, just for the fun of shipping something real. Every one of these is live." />
          {profile.resume && (
            <a href={profile.resume} download="Sharik-Hussain-Resume.pdf" className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-surface/40 px-4 py-2 text-sm font-medium text-fg transition-colors duration-200 hover:border-border-strong hover:bg-surface/70 sm:self-auto">
              <Download size={15} className="text-fg-muted transition-colors group-hover:text-accent" />
              Résumé <span className="font-mono text-[10px] text-fg-subtle">PDF</span>
            </a>
          )}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <div className="mb-4 flex justify-end gap-2">
            <button type="button" aria-label="Previous project" onClick={() => step(-1)} className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-fg transition-colors hover:border-border-strong hover:bg-surface-muted"><ArrowLeft size={18} /></button>
            <button type="button" aria-label="Next project" onClick={() => step(1)} className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-fg transition-colors hover:border-border-strong hover:bg-surface-muted"><ArrowRight size={18} /></button>
          </div>

          <div className="project-rail" role="tablist" aria-label="Featured projects">
            {rail.map((project, railIndex) => {
              const actualIndex = projects.indexOf(project)
              return (
                <button key={project.title} type="button" role="tab" aria-selected={actualIndex === active} aria-label={`Show ${project.title}`} onClick={() => setActive(actualIndex)} className={cn('project-rail-panel', railIndex === 0 && 'project-rail-panel-active')}>
                  {railIndex === 0 ? (
                    <motion.div key={project.title} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.42, ease: OUT }} className="absolute inset-0">
                      <ProjectVisual project={project} index={actualIndex} />
                    </motion.div>
                  ) : <ProjectVisual project={project} index={actualIndex} />}
                  {railIndex === 0 && <span className="absolute bottom-5 left-5 font-mono text-xs font-semibold text-white drop-shadow-sm">{project.title}</span>}
                </button>
              )
            })}
          </div>

          <motion.article key={activeProject.title} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.32, ease: OUT }} className="mt-7 grid gap-5 rounded-2xl border border-border bg-surface/45 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-6">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-accent">{activeProject.tagline}</div>
              <h3 className="mt-2 font-display text-2xl font-semibold text-fg">{activeProject.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-muted">{activeProject.description}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {activeProject.tags.map((tag) => <span key={tag} className="rounded-md border border-border bg-surface/50 px-2 py-1 font-mono text-[10px] text-fg-muted">{tag}</span>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 sm:justify-end">
              {activeProject.link && <a href={activeProject.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition-[filter,transform] duration-200 hover:brightness-110 active:scale-95">Visit live <ArrowUpRight size={15} /></a>}
              {activeProject.repo && <a href={activeProject.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-fg transition-colors hover:border-border-strong"><Github size={15} /> Code</a>}
              {!activeProject.link && !activeProject.repo && <span className="inline-flex items-center gap-1 text-sm text-fg-subtle"><Dot size={16} /> Internal / not public</span>}
            </div>
          </motion.article>
        </Reveal>
      </div>
    </section>
  )
}
