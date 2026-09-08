'use client'
import Image from 'next/image'
import { type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import { profile } from '@/lib/content'

const rise = (delay: number): CSSProperties => ({ ['--rise-delay' as string]: `${delay}s` })

export default function Hero() {
  const reduce = useReducedMotion()

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center justify-center px-5 py-28 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Avatar — squarish, minimal rounded frame */}
        <div className="rise relative" style={rise(0.05)}>
          <div className="absolute -inset-5 rounded-[28px] bg-accent-soft opacity-70 blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[20px] border border-border bg-surface p-1.5 shadow-[0_18px_50px_-16px_rgba(0,0,0,0.6)]">
            <div className="relative h-48 w-40 overflow-hidden rounded-[15px] sm:h-56 sm:w-48">
              <Image
                src={profile.photo}
                alt={`${profile.name}, ${profile.role}`}
                fill
                priority
                sizes="192px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-bg">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-bg" />
          </span>
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
