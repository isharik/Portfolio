'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Dot, Github } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { projects, profile, type Project } from '@/lib/content'
import { cn } from '@/lib/utils'

const FADE_OUT_MS = 240
const FADE_IN_MS = 440

function ProjectPreview({ project, index }: { project: Project; index: number }) {
  return (
    <div className="project-showcase-preview" style={{ '--project-accent': `linear-gradient(135deg, ${project.accent})` } as React.CSSProperties}>
      <div className="project-showcase-backdrop project-showcase-backdrop-back" aria-hidden="true" />
      <div className="project-showcase-backdrop project-showcase-backdrop-front" aria-hidden="true" />
      <div className="project-showcase-screen">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} project preview`}
            fill
            sizes="(min-width: 1024px) 48vw, (min-width: 640px) 60vw, 94vw"
            priority
            className={cn('project-showcase-image', project.imageFit === 'contain' ? 'object-contain' : 'object-cover')}
          />
        ) : (
          <div className="project-showcase-placeholder" style={{ background: `linear-gradient(135deg, ${project.accent})` }}>
            <span className="project-showcase-placeholder-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{project.title}</span>
          </div>
        )}
      </div>
      <div className="project-showcase-screen-foot"><span>{project.title}</span><span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></div>
    </div>
  )
}

export default function Projects() {
  const [active, setActive] = useState(0)
  const [switchPhase, setSwitchPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const fadeOutTimer = useRef<number | null>(null)
  const fadeInTimer = useRef<number | null>(null)
  const activeProject = projects[active]

  useEffect(() => {
    // Warm local project artwork once so a selection change never flashes a blank frame.
    projects.forEach((project) => {
      if (!project.image) return
      const image = new window.Image()
      image.src = project.image
      image.decode?.().catch(() => undefined)
    })
    return () => {
      if (fadeOutTimer.current !== null) window.clearTimeout(fadeOutTimer.current)
      if (fadeInTimer.current !== null) window.clearTimeout(fadeInTimer.current)
    }
  }, [])

  const selectProject = (nextIndex: number) => {
    if (nextIndex === active || switchPhase !== 'idle') return
    if (fadeOutTimer.current !== null) window.clearTimeout(fadeOutTimer.current)
    if (fadeInTimer.current !== null) window.clearTimeout(fadeInTimer.current)
    setSwitchPhase('out')
    fadeOutTimer.current = window.setTimeout(() => {
      setActive(nextIndex)
      setSwitchPhase('in')
      fadeInTimer.current = window.setTimeout(() => setSwitchPhase('idle'), FADE_IN_MS)
    }, FADE_OUT_MS)
  }

  const step = (direction: number) => selectProject((active + direction + projects.length) % projects.length)

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
            <div className={cn('project-showcase-visual', switchPhase === 'out' && 'is-fading-out', switchPhase === 'in' && 'is-fading-in')}>
              <ProjectPreview project={activeProject} index={active} />
            </div>

            <article className={cn('project-showcase-details', switchPhase === 'out' && 'is-fading-out', switchPhase === 'in' && 'is-fading-in')} aria-live="polite" aria-atomic="true">
              <div>
                <div className="project-showcase-kicker">{activeProject.tagline}</div>
                <h3 className="project-showcase-title">{activeProject.title}</h3>
                <p className="project-showcase-description">{activeProject.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {activeProject.tags.map((tag) => <span key={tag} className="rounded-md border border-border bg-surface/50 px-2 py-1 font-mono text-[10px] text-fg-muted">{tag}</span>)}
                </div>
              </div>

              <div className="project-showcase-actions">
                <button type="button" onClick={() => step(-1)} disabled={switchPhase !== 'idle'} className="project-showcase-nav"><ArrowLeft size={16} /><span>Previous</span></button>
                <button type="button" onClick={() => step(1)} disabled={switchPhase !== 'idle'} className="project-showcase-nav"><span>Next</span><ArrowRight size={16} /></button>
                {activeProject.link ? <a href={activeProject.link} target="_blank" rel="noopener noreferrer" className="project-showcase-open">Open project <ArrowUpRight size={15} /></a> : activeProject.repo ? <a href={activeProject.repo} target="_blank" rel="noopener noreferrer" className="project-showcase-open">View code <Github size={15} /></a> : <span className="project-showcase-private"><Dot size={16} /> Internal / not public</span>}
              </div>
            </article>
          </div>

          <div className="project-showcase-pagination" aria-label="Select a project">
            {projects.map((project, index) => (
              <button key={project.title} type="button" aria-label={`Show ${project.title}`} aria-current={index === active ? 'true' : undefined} onClick={() => selectProject(index)} disabled={switchPhase !== 'idle'} className={cn('project-showcase-dot', index === active && 'is-active')} />
            ))}
            <span>{String(active + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(projects.length).padStart(2, '0')}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
