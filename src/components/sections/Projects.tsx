'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Dot, Github } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { projects, profile, type Project } from '@/lib/content'
import { cn } from '@/lib/utils'

const PAGE_TURN = { duration: 0.38, ease: [0.32, 0.72, 0.18, 1] as const }

function ProjectPreview({ project, index, active }: { project: Project; index: number; active: boolean }) {
  return (
    <div className="project-showcase-preview">
      <div className="project-showcase-backdrop project-showcase-backdrop-back" aria-hidden="true" />
      <div className="project-showcase-backdrop project-showcase-backdrop-front" aria-hidden="true" />
      <div className="project-showcase-screen">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} project preview`}
            fill
            sizes="(min-width: 1024px) 48vw, (min-width: 640px) 60vw, 94vw"
            priority={active}
            className={cn('project-showcase-image', project.imageFit === 'contain' ? 'object-contain' : 'object-cover')}
          />
        ) : (
          <div className="project-showcase-placeholder">
            <span className="project-showcase-placeholder-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{project.title}</span>
          </div>
        )}
        <div className="project-showcase-card-label"><span>{project.title}</span><span>{String(index + 1).padStart(2, '0')} <i>/</i> {String(projects.length).padStart(2, '0')}</span></div>
      </div>
    </div>
  )
}

export default function Projects() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [flipPhase, setFlipPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const pendingIndex = useRef<number | null>(null)
  const isAnimating = flipPhase !== 'idle'
  const activeProject = projects[active]

  useEffect(() => {
    // Warm local project artwork once so a selection change never flashes a blank frame.
    projects.forEach((project) => {
      if (!project.image) return
      const image = new window.Image()
      image.src = project.image
      image.decode?.().catch(() => undefined)
    })
  }, [])

  // Keep the two halves of the page turn on a deterministic timeline. Framer
  // completion callbacks can be skipped when a tab is backgrounded, so the
  // controls must not remain disabled waiting for one.
  useEffect(() => {
    if (flipPhase === 'idle') return
    const timer = window.setTimeout(() => {
      if (flipPhase === 'out') {
        if (pendingIndex.current !== null) setActive(pendingIndex.current)
        pendingIndex.current = null
        setFlipPhase('in')
      } else {
        setFlipPhase('idle')
      }
    }, reduce ? 0 : 430)
    return () => window.clearTimeout(timer)
  }, [flipPhase, reduce])

  const selectProject = (nextIndex: number, turnDirection: number) => {
    if (nextIndex === active || isAnimating) return
    setDirection(turnDirection)
    pendingIndex.current = nextIndex
    setFlipPhase('out')
  }

  const step = (turn: number) => selectProject((active + turn + projects.length) % projects.length, turn)

  return (
    <section id="projects" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Projects" title="Built in my free time" description="The products, tools, and experiments I make when nobody's assigning them, just for the fun of shipping something real. Every one of these is live." />
          {profile.resume && (
            <a href={profile.resume} download="Sharik-Hussain-Resume.pdf" className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-surface/40 px-4 py-2 text-sm font-medium text-fg transition-colors duration-200 hover:border-border-strong hover:bg-surface/70 sm:self-auto">
              <Download size={15} className="text-fg-muted transition-colors group-hover:text-accent" /> Résumé <span className="font-mono text-[10px] text-fg-subtle">PDF</span>
            </a>
          )}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <div className="project-showcase" aria-label="Featured project">
            <div className="project-showcase-visual" aria-label={`${activeProject.title} preview`}>
              <motion.div
                key={activeProject.title}
                className="project-showcase-page"
                initial={flipPhase === 'in' && !reduce ? { rotateY: direction > 0 ? 82 : -82, x: direction > 0 ? 18 : -18, opacity: 0.8 } : false}
                animate={flipPhase === 'out' && !reduce
                  ? { rotateY: direction > 0 ? -82 : 82, x: direction > 0 ? -18 : 18, opacity: 0.78 }
                  : { rotateY: 0, x: 0, opacity: 1 }}
                transition={reduce ? { duration: 0 } : PAGE_TURN}
                style={{ transformOrigin: direction > 0 ? 'left center' : 'right center', backfaceVisibility: 'hidden' }}
              >
                <ProjectPreview project={activeProject} index={active} active />
              </motion.div>
            </div>

            <article className={cn('project-showcase-details', isAnimating && 'is-changing')} aria-live="polite" aria-atomic="true">
              <div>
                <div className="project-showcase-kicker">{activeProject.tagline}</div>
                <h3 className="project-showcase-title">{activeProject.title}</h3>
                <p className="project-showcase-description">{activeProject.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {activeProject.tags.map((tag) => <span key={tag} className="rounded-md border border-border bg-surface/50 px-2 py-1 font-mono text-[10px] text-fg-muted">{tag}</span>)}
                </div>
              </div>

              <div className="project-showcase-actions">
                <button type="button" onClick={() => step(-1)} disabled={isAnimating} className="project-showcase-nav"><ArrowLeft size={16} /><span>Previous</span></button>
                <button type="button" onClick={() => step(1)} disabled={isAnimating} className="project-showcase-nav"><span>Next</span><ArrowRight size={16} /></button>
                {activeProject.link ? <a href={activeProject.link} target="_blank" rel="noopener noreferrer" className="project-showcase-open">Open project <ArrowUpRight size={15} /></a> : activeProject.repo ? <a href={activeProject.repo} target="_blank" rel="noopener noreferrer" className="project-showcase-open">View code <Github size={15} /></a> : <span className="project-showcase-private"><Dot size={16} /> Internal / not public</span>}
              </div>
            </article>
          </div>

        </Reveal>
      </div>
    </section>
  )
}
