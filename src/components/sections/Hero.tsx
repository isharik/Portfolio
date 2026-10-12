'use client'
import Image from 'next/image'
import { type CSSProperties, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import { profile } from '@/lib/content'

const rise = (delay: number): CSSProperties => ({ ['--rise-delay' as string]: `${delay}s` })

export default function Hero() {
  const reduce = useReducedMotion()
  const [portraitStyle, setPortraitStyle] = useState<CSSProperties>({})

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  const tiltPortrait = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduce) return
    const box = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - box.left) / box.width - 0.5
    const y = (e.clientY - box.top) / box.height - 0.5
    setPortraitStyle({ transform: `rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateZ(12px) scale(1.025)` })
  }

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center justify-center px-5 py-28 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Frameless, transparent portrait with pointer-driven depth. */}
        <div className="rise portrait-stage" style={rise(0.05)}>
          <button
            type="button"
            className="portrait-tilt relative block h-52 w-52 cursor-pointer border-0 bg-transparent p-0 sm:h-64 sm:w-64"
            aria-label="Interactive profile portrait"
            onPointerMove={tiltPortrait}
            onPointerLeave={() => setPortraitStyle({})}
            onClick={(e) => {
              e.currentTarget.classList.remove('portrait-clicked')
              void e.currentTarget.offsetWidth
              e.currentTarget.classList.add('portrait-clicked')
            }}
          >
            <div className="relative h-full w-full" style={portraitStyle}>
              <Image
                src={profile.photo}
                alt={`${profile.name}, ${profile.role}`}
                fill
                priority
                sizes="(max-width: 640px) 208px, 256px"
                className="object-contain"
              />
            </div>
          </button>
        </div>

        {/* Status */}
        <div
          className="rise mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/40 px-3 py-1"
          style={rise(0.12)}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="font-mono text-[11px] tracking-wide text-fg-muted">{profile.availability}</span>
        </div>

        <p className="eyebrow rise mt-6" style={rise(0.18)}>
          {profile.eyebrow}
        </p>

        <h1
          className="rise mt-4 font-display text-[clamp(2.3rem,6vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-fg [text-wrap:balance]"
          style={rise(0.24)}
        >
          {profile.headlineLead} <span className="text-accent">{profile.headlineAccent}</span>
        </h1>

        <p
          className="rise mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-fg-muted [text-wrap:pretty] sm:text-base"
          style={rise(0.32)}
        >
          {profile.summary}
        </p>

        <div className="rise mt-8 flex flex-wrap items-center justify-center gap-3" style={rise(0.4)}>
          <MagneticButton href="#contact" onClick={(e) => go(e, '#contact')} variant="primary">
            Let&apos;s talk <ArrowUpRight size={16} />
          </MagneticButton>
          <MagneticButton href="#projects" onClick={(e) => go(e, '#projects')} variant="secondary">
            View my work
          </MagneticButton>
        </div>

        <div
          className="rise mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] text-fg-subtle"
          style={rise(0.48)}
        >
          <span>4+ years across support &amp; AI</span>
          <span className="text-border-strong">/</span>
          <span>Remote-first</span>
          <span className="text-border-strong">/</span>
          <span>{profile.location}</span>
        </div>
      </div>
    </section>
  )
}
