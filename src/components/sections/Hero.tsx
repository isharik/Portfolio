'use client'
import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import { CanvasText } from '@/components/ui/canvas-text'
import RecruiterIntroPlayer from '@/components/ui/RecruiterIntroPlayer'
import { profile } from '@/lib/content'
import { scrollToSection } from '@/lib/scroll'

const rise = (delay: number): CSSProperties => ({ ['--rise-delay' as string]: `${delay}s` })

export default function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [welcomeComplete, setWelcomeComplete] = useState(false)

  useEffect(() => {
    if (document.documentElement.dataset.welcomeComplete === 'true') {
      setWelcomeComplete(true)
    }
    const onWelcomeComplete = () => setWelcomeComplete(true)
    window.addEventListener('portfolio:welcome-complete', onWelcomeComplete, { once: true })
    return () => window.removeEventListener('portfolio:welcome-complete', onWelcomeComplete)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || reduce) return

    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    const setup = (layers: Array<[string, number]>) => {
      layers.forEach(([selector, yPercent]) => {
        section.querySelectorAll<HTMLElement>(selector).forEach((element) => {
          gsap.to(element, {
            yPercent,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.25,
              invalidateOnRefresh: true,
            },
          })
        })
      })
    }

    media.add('(min-width: 768px)', () => setup([
      ['[data-parallax-layer="1"]', 28],
      ['[data-parallax-layer="2"]', 20],
      ['[data-parallax-layer="3"]', 12],
      ['[data-parallax-layer="4"]', 5],
    ]))
    media.add('(max-width: 767px)', () => setup([
      ['[data-parallax-layer="1"]', 16],
      ['[data-parallax-layer="2"]', 12],
      ['[data-parallax-layer="3"]', 7],
      ['[data-parallax-layer="4"]', 3],
    ]))

    return () => media.revert()
  }, [reduce])

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    scrollToSection(href, Boolean(reduce))
  }

  return (
    <section id="home" ref={sectionRef} className="relative flex min-h-[100svh] items-center px-5 py-24 sm:px-6 sm:py-28">
      <aside className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-cue-dot" />
        <span className="hero-scroll-cue-line" />
        <span className="hero-scroll-cue-label">SCROLL TO EXPLORE</span>
        <svg className="hero-scroll-cue-mouse" viewBox="0 0 24 34" fill="none">
          <rect x="4" y="1" width="16" height="30" rx="8" />
          <path d="M12 7v7" />
        </svg>
      </aside>

      <aside className="hero-ideas-note" aria-label="Ideas, Support, Better Tech">
        <svg viewBox="0 0 150 104" fill="none" aria-hidden="true">
          <circle cx="20" cy="13" r="2.5" />
          <path d="M23 14C51 18 80 32 77 52c-2 14-18 24-34 34" />
          <path d="m43 80-2 7 8-1" />
        </svg>
        <span>Ideas<br />Support<br />Better Tech</span>
      </aside>

      <aside className="hero-current-status" aria-label="Currently here: Building, Learning, Sharing">
        <span className="hero-current-status-accent" />
        <div className="hero-current-status-copy">
          <div className="hero-current-status-heading"><span />Currently here:</div>
          <ul><li>Building</li><li>Learning</li><li>Sharing</li></ul>
        </div>
        <svg className="hero-current-status-bars" viewBox="0 0 28 24" fill="currentColor" aria-hidden="true">
          <rect x="1" y="16" width="4" height="7" rx="1" />
          <rect x="8" y="11" width="4" height="12" rx="1" />
          <rect x="15" y="6" width="4" height="17" rx="1" />
          <rect x="22" y="1" width="4" height="22" rx="1" />
        </svg>
      </aside>

      <div className="hero-layout mx-auto grid w-full max-w-content items-center gap-10 lg:items-start lg:grid-cols-[minmax(480px,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="rise flex justify-center lg:justify-start" style={rise(0.12)}>
          <div data-parallax-layer="1"><RecruiterIntroPlayer /></div>
        </div>

        <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
          <div className="rise mt-4" style={rise(0.2)}>
            <span data-parallax-layer="4" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-[11px] tracking-wide text-fg-muted">{profile.availability}</span>
            </span>
          </div>

          <p className="eyebrow rise mt-3" style={rise(0.28)}><span data-parallax-layer="3" className="inline-block">{profile.eyebrow}</span></p>

          <div data-parallax-layer="2" className="relative mt-1 h-[104px] w-full">
            <h1 className="sr-only">{profile.headlineLead} {profile.headlineAccent}</h1>
            {welcomeComplete && (
              <div aria-hidden="true" className="absolute inset-x-0 -top-2 h-[124px]">
                <CanvasText
                  text={`${profile.headlineLead} ${profile.headlineAccent}`}
                  color="var(--fg)"
                  fontSize={58}
                  fontWeight={600}
                  density={2}
                  particleSize={1.7}
                  scatter={36}
                  loadDuration={1.35}
                  morphDuration={2.8}
                  magnetic={0.22}
                  magneticRadius={84}
                  paused={false}
                  forceMotion
                  className="h-[124px] max-w-none text-fg"
                />
              </div>
            )}
          </div>

          <p className="rise mt-0 max-w-2xl text-[15px] leading-relaxed text-fg-muted [text-wrap:pretty] sm:text-base" style={rise(1.48)}>
            <span data-parallax-layer="3" className="block">{profile.summary}</span>
          </p>

          <div className="rise mt-6" style={rise(1.6)}>
            <div data-parallax-layer="2" className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <MagneticButton href="#contact" onClick={(e) => go(e, '#contact')} variant="primary">Let&apos;s talk <ArrowUpRight size={16} /></MagneticButton>
              <MagneticButton href="#projects" onClick={(e) => go(e, '#projects')} variant="secondary">View my work</MagneticButton>
            </div>
          </div>

          <div className="rise mt-6" style={rise(1.68)}>
            <div data-parallax-layer="4" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] text-fg-subtle lg:justify-start">
              <span>4+ years across support &amp; AI</span><span className="text-border-strong">/</span><span>Remote-first</span><span className="text-border-strong">/</span><span>{profile.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
