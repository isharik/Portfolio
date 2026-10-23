'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Dot, Github } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { projects, profile, type Project } from '@/lib/content'
import { cn } from '@/lib/utils'

function ProjectPreview({ project, index, active }: { project: Project; index: number; active: boolean }) {
  return (
    <div className="project-showcase-preview">
      <div className="project-showcase-screen">
        {project.image ? (
          <>
            {project.imageFit === 'contain' && <Image src={project.image} alt="" fill sizes="(min-width: 1024px) 48vw, (min-width: 640px) 60vw, 94vw" className="project-showcase-image-backdrop" aria-hidden="true" />}
            <Image
              src={project.image}
              alt={`${project.title} project preview`}
              fill
              sizes="(min-width: 1024px) 48vw, (min-width: 640px) 60vw, 94vw"
              priority={active}
              className={cn('project-showcase-image', project.imageFit === 'contain' ? 'object-contain' : 'object-cover')}
            />
          </>
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

  const step = (turn: number) => {
    setDirection(turn)
    setActive((current) => (current + turn + projects.length) % projects.length)
  }

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
              {projects.map((project, index) => {
                const isActive = index === active
                // Order the deck in the direction of travel so the next card is
                // visibly waiting behind the current one, then animate it forward.
                const depth = direction > 0
                  ? (index - active + projects.length) % projects.length
                  : (active - index + projects.length) % projects.length
                const stackX = ((index * 37 + 11) % 81) - 40
                const stackY = 5 + ((index * 19 + 3) % 25) + depth * 4
                const stackTilt = ((index * 17 + 5) % 27) - 13
                const stackSide = index % 2 === 0 ? -1 : 1
                return (
                  <motion.div
                    key={project.title}
                    className="project-showcase-page"
                    aria-hidden={!isActive}
                    style={{ zIndex: isActive ? 999 : projects.length - depth, transformOrigin: '50% 82%', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                    initial={false}
                    animate={isActive
                      ? { opacity: 1, scale: 1, z: 0, rotate: 0, rotateX: 0, rotateY: 0, x: 0, y: reduce ? 0 : [0, -24, 0] }
                      : { opacity: 1, scale: Math.max(0.84, 1 - depth * 0.026), z: -depth * 54, rotate: stackTilt, rotateX: reduce ? 0 : 2 + depth * 0.7, rotateY: reduce ? 0 : stackSide * (5 + depth), x: stackX, y: stackY }}
                    transition={reduce
                      ? { duration: 0.28, ease: 'easeOut' }
                      : { type: 'spring', stiffness: 95, damping: 20, mass: 0.85 }}
                  >
                    <ProjectPreview project={project} index={index} active={isActive} />
                  </motion.div>
                )
              })}
            </div>

            <article className="project-showcase-details" aria-live="polite" aria-atomic="true">
              <motion.div key={activeProject.title} initial={reduce ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduce ? 0 : 0.36, ease: 'easeOut' }}>
                <div className="project-showcase-kicker">{activeProject.tagline}</div>
                <h3 className="project-showcase-title">{activeProject.title}</h3>
                <p className="project-showcase-description">{activeProject.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {activeProject.tags.map((tag) => <span key={tag} className="rounded-md border border-border bg-surface/50 px-2 py-1 font-mono text-[10px] text-fg-muted">{tag}</span>)}
                </div>
              </motion.div>

              <div className="project-showcase-actions">
                <button type="button" onClick={() => step(-1)} className="project-showcase-nav"><ArrowLeft size={16} /><span>Previous</span></button>
                <button type="button" onClick={() => step(1)} className="project-showcase-nav"><span>Next</span><ArrowRight size={16} /></button>
                {activeProject.link ? <a href={activeProject.link} target="_blank" rel="noopener noreferrer" className="project-showcase-open">Open project <ArrowUpRight size={15} /></a> : activeProject.repo ? <a href={activeProject.repo} target="_blank" rel="noopener noreferrer" className="project-showcase-open">View code <Github size={15} /></a> : <span className="project-showcase-private"><Dot size={16} /> Internal / not public</span>}
              </div>
            </article>
          </div>

        </Reveal>
      </div>
    </section>
  )
}
