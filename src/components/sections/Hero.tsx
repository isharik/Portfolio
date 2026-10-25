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

          <p className="eyebrow rise mt-5" style={rise(0.28)}><span data-parallax-layer="3" className="inline-block">{profile.eyebrow}</span></p>

          <div data-parallax-layer="2" className="mt-3 min-h-[160px] w-full">
            <h1 className="sr-only">{profile.headlineLead} {profile.headlineAccent}</h1>
            {welcomeComplete && (
              <div aria-hidden="true">
              <CanvasText
                text={`${profile.headlineLead} ${profile.headlineAccent}`}
                fontSize={58}
                fontWeight={600}
                density={2}
                particleSize={1.55}
                scatter={54}
                loadDuration={0.95}
                morphDuration={1.45}
                magnetic={0.22}
                magneticRadius={84}
                className="h-[160px] max-w-none text-fg"
              />
              </div>
            )}
          </div>

          <p className="rise mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-muted [text-wrap:pretty] sm:text-base" style={rise(1.48)}>
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
