'use client'
import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Box, Briefcase, Github, MapPin, Wifi, type LucideProps } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import { CanvasText } from '@/components/ui/canvas-text'
import RecruiterIntroPlayer from '@/components/ui/RecruiterIntroPlayer'
import { profile } from '@/lib/content'
import { scrollToSection } from '@/lib/scroll'

const rise = (delay: number): CSSProperties => ({ ['--rise-delay' as string]: `${delay}s` })

function XBrandMark({ size = 24, className, ...props }: LucideProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.49h2.04L6.49 3.24H4.3z" />
    </svg>
  )
}

const featuredWork = [
  { title: 'OctoBot', subtitle: 'Pharos AI Agent', href: 'https://pharos-octobot-by-echo.streamlit.app/', icon: Box },
  { title: 'Content', subtitle: 'Posts & threads on X', href: 'https://x.com/isharik99', icon: XBrandMark },
  { title: 'My Builds', subtitle: 'Code & repositories', href: 'https://github.com/isharik', icon: Github },
]

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

      <div className="hero-layout mx-auto grid w-full max-w-content items-center gap-10 lg:items-start lg:grid-cols-[minmax(480px,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="rise flex justify-center lg:justify-start" style={rise(0.12)}>
          <div className="w-full" data-parallax-layer="1">
            <RecruiterIntroPlayer />
            <div className="hero-featured-work" aria-label="Featured work">
              <h2 className="hero-featured-heading"><span />FEATURED WORK</h2>
              <div className="hero-featured-grid">
                {featuredWork.map(({ title, subtitle, href, icon: Icon }) => (
                  <a key={title} className="hero-featured-card" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${title}: ${subtitle}`}>
                    <Icon className="hero-featured-icon" size={19} strokeWidth={1.6} aria-hidden="true" />
                    <span className="hero-featured-copy"><span className="hero-featured-title">{title}</span><span className="hero-featured-subtitle">{subtitle}</span></span>
                    <ArrowUpRight className="hero-featured-arrow" size={15} strokeWidth={1.7} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center text-center lg:-translate-y-3 lg:self-center lg:items-start lg:text-left">
          <div className="rise mt-4" style={rise(0.2)}>
            <span data-parallax-layer="4" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-[11px] tracking-wide text-fg-muted">{profile.availability}</span>
            </span>
          </div>

          <p className="eyebrow rise mt-3" style={rise(0.28)}><span data-parallax-layer="3" className="inline-block">{profile.eyebrow}</span></p>

          <div data-parallax-layer="2" className="relative mt-1 h-[104px] w-full">
            <h1 className="sr-only">Hi I&apos;m Sharik</h1>
            {welcomeComplete && (
              <div aria-hidden="true" className="absolute inset-x-0 -top-2 h-[124px]">
                <CanvasText
                  text="Hi I'm Sharik"
                  color="var(--fg)"
                  fontSize={58}
                  fontWeight={500}
                  fontFamily="var(--font-orbitron), sans-serif"
                  density={2}
                  particleSize={1.7}
                  scatter={36}
                  loadDuration={1.15}
                  morphDuration={2.5}
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
            <div data-parallax-layer="4" className="hero-fact-row flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-fg-subtle lg:justify-start">
              <span className="hero-fact" role="note" tabIndex={0} aria-label="4+ years across support and AI. Experienced in turning complex support and AI work into clearer customer experiences." data-tooltip="4+ years turning complex support and AI work into clearer customer experiences."><Briefcase size={17} strokeWidth={1.6} aria-hidden="true" /><span>4+ years across support &amp; AI</span></span>
              <span className="text-border-strong">/</span>
              <span className="hero-fact" role="note" tabIndex={0} aria-label="Remote-first. Remote work is my forte, with clear collaboration across teams and time zones." data-tooltip="Remote work is my forte—clear collaboration across teams and time zones."><Wifi size={17} strokeWidth={1.6} aria-hidden="true" /><span>Remote-first</span></span>
              <span className="text-border-strong">/</span>
              <span className="hero-fact" role="note" tabIndex={0} aria-label={`${profile.location}. Based in India and collaborating with teams around the world.`} data-tooltip="Based in India, collaborating with teams around the world."><MapPin size={17} strokeWidth={1.6} aria-hidden="true" /><span>{profile.location}</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
