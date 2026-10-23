'use client'
import { type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import InteractivePortrait from '@/components/ui/InteractivePortrait'
import ParticleTitle from '@/components/ui/ParticleTitle'
import RecruiterIntroPlayer from '@/components/ui/RecruiterIntroPlayer'
import { profile } from '@/lib/content'

const rise = (delay: number): CSSProperties => ({ ['--rise-delay' as string]: `${delay}s` })

export default function Hero() {
  const reduce = useReducedMotion()

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center px-5 py-24 sm:px-6 sm:py-28">
      <div className="hero-layout mx-auto grid w-full max-w-content items-center gap-12 lg:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
        <div className="rise flex justify-center lg:justify-start" style={rise(0.12)}>
          <RecruiterIntroPlayer />
        </div>

        <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
          <div className="rise hero-portrait" style={rise(0.04)}>
            <InteractivePortrait alt="Minimal anime avatar" />
          </div>

          <div className="rise mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-3 py-1" style={rise(0.2)}>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="font-mono text-[11px] tracking-wide text-fg-muted">{profile.availability}</span>
          </div>

          <p className="eyebrow rise mt-5" style={rise(0.28)}>{profile.eyebrow}</p>

          <div className="mt-3 w-full">
            <ParticleTitle lead={profile.headlineLead} accent={profile.headlineAccent} />
          </div>

          <p className="rise mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-muted [text-wrap:pretty] sm:text-base" style={rise(1.48)}>
            {profile.summary}
          </p>

          <div className="rise mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start" style={rise(1.6)}>
            <MagneticButton href="#contact" onClick={(e) => go(e, '#contact')} variant="primary">Let&apos;s talk <ArrowUpRight size={16} /></MagneticButton>
            <MagneticButton href="#projects" onClick={(e) => go(e, '#projects')} variant="secondary">View my work</MagneticButton>
          </div>

          <div className="rise mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] text-fg-subtle lg:justify-start" style={rise(1.68)}>
            <span>4+ years across support &amp; AI</span><span className="text-border-strong">/</span><span>Remote-first</span><span className="text-border-strong">/</span><span>{profile.location}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
