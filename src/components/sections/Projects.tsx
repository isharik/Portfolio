'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { flushSync } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Dot, Github } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { projects, profile, type Project } from '@/lib/content'
import { cn } from '@/lib/utils'

const PAGE_TURN_MS = 960

function ProjectPreview({ project, index, active }: { project: Project; index: number; active: boolean }) {
  return (
    <div className="project-showcase-preview">
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
  const [isAnimating, setIsAnimating] = useState(false)
  const [settling, setSettling] = useState(false)
  const pendingIndex = useRef<number | null>(null)
  const timer = useRef<number | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const foldAnimationRef = useRef<Animation | null>(null)
  const activeProject = projects[active]
  const nextIndex = settling
    ? active
    : pendingIndex.current ?? (active + direction + projects.length) % projects.length

  useEffect(() => {
    // Warm local project artwork once so a selection change never flashes a blank frame.
    projects.forEach((project) => {
      if (!project.image) return
      const image = new window.Image()
      image.src = project.image
      image.decode?.().catch(() => undefined)
    })
  }, [])

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
      animationRef.current?.cancel()
      foldAnimationRef.current?.cancel()
    }
  }, [])

  const finishTurn = () => {
    const incoming = pendingIndex.current
    if (incoming === null) return

    // At the end of the turn the reverse face is visible. Update both faces to
    // the incoming project before clearing the animation, so the reset from
    // 180° to 0° is visually seamless (same art on either face).
    flushSync(() => {
      setActive(incoming)
      setSettling(true)
    })
    pendingIndex.current = null
    animationRef.current?.cancel()
    animationRef.current = null
    foldAnimationRef.current?.cancel()
    foldAnimationRef.current = null
    if (pageRef.current) pageRef.current.style.transform = 'none'
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    setSettling(false)
    setIsAnimating(false)
  }

  const selectProject = (nextIndex: number, turnDirection: number) => {
    if (nextIndex === active || isAnimating) return
    if (reduce) { setActive(nextIndex); return }
    setDirection(turnDirection)
    pendingIndex.current = nextIndex
    setIsAnimating(true)
    const page = pageRef.current
    if (!page) { setActive(nextIndex); pendingIndex.current = null; setIsAnimating(false); return }
    const rotation = turnDirection > 0 ? -180 : 180
    page.style.transformOrigin = turnDirection > 0 ? 'left center' : 'right center'
    page.style.transform = 'rotateY(0deg)'
    const animation = page.animate([
      { transform: 'rotateY(0deg) translateZ(0px)', boxShadow: '0 18px 42px rgba(0,0,0,.16)', offset: 0 },
      { transform: `rotateY(${rotation * 0.52}deg) translateZ(12px)`, boxShadow: turnDirection > 0 ? '-30px 8px 42px rgba(0,0,0,.38)' : '30px 8px 42px rgba(0,0,0,.38)', offset: 0.52, easing: 'cubic-bezier(.72,0,.88,.35)' },
      { transform: `rotateY(${rotation}deg) translateZ(0px)`, boxShadow: '0 18px 42px rgba(0,0,0,.16)', offset: 1 },
    ], { duration: PAGE_TURN_MS, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' })
    animationRef.current = animation
    animation.onfinish = finishTurn
    const fold = page.querySelector<HTMLElement>('.project-showcase-page-fold')
    foldAnimationRef.current = fold?.animate(
      [{ opacity: 0 }, { opacity: 0.82, offset: 0.5 }, { opacity: 0 }],
      { duration: PAGE_TURN_MS, easing: 'ease-in-out', fill: 'forwards' },
    ) ?? null
    if (timer.current !== null) window.clearTimeout(timer.current)
    // Safety release in case the browser suppresses the Web Animations finish event.
    timer.current = window.setTimeout(finishTurn, PAGE_TURN_MS + 500)
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
              {/* Fixed neutral leaves remain still; only the foreground page turns. */}
              <div className="project-showcase-backdrop project-showcase-backdrop-back" aria-hidden="true" />
              <div className="project-showcase-backdrop project-showcase-backdrop-front" aria-hidden="true" />
              <motion.div
                ref={pageRef}
                className="project-showcase-page"
                initial={false}
                style={{ transformOrigin: direction > 0 ? 'left center' : 'right center', transformStyle: 'preserve-3d' }}
              >
                <div className="project-showcase-page-face project-showcase-page-front">
                  <ProjectPreview project={activeProject} index={active} active />
                </div>
                <div className="project-showcase-page-face project-showcase-page-back">
                  <ProjectPreview project={projects[nextIndex]} index={nextIndex} active />
                </div>
                <div className="project-showcase-page-fold" aria-hidden="true" />
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
