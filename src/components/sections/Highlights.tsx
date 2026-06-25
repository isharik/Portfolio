'use client'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/Stagger'
import { Brain, Cloud, Users, Globe, Mic, Zap, Award } from 'lucide-react'

const highlights = [
  {
    icon: Brain,
    title: 'AI & LLM Evaluation',
    description: 'Evaluating large language model outputs at Invisible Technologies, contributing structured quality feedback to AI improvement pipelines across multiple task domains.',
    meta: 'Invisible Technologies · Jul 2025–Present',
    featured: false,
  },
  {
    icon: Mic,
    title: 'Pharos Network Storyteller',
    description: 'Selected as an official Storyteller for Pharos Network — a high-performance EVM Layer 1 blockchain backed by former Ant Group executives. Creating content and shaping the ecosystem narrative ahead of mainnet.',
    meta: 'Pharos Network · 2025–Present',
    featured: true,
  },
  {
    icon: Cloud,
    title: 'Cloud & System Operations',
    description: 'Year-long hands-on system administration at KodeKloud: AWS cloud infrastructure management, incident response, and operational analysis in a fully distributed environment.',
    meta: 'KodeKloud · 2024',
    featured: false,
  },
  {
    icon: Users,
    title: 'Customer Experience',
    description: 'Delivered precision customer communication and interpretation support at Datamark in high-stakes, time-sensitive environments requiring speed, accuracy, and strict confidentiality.',
    meta: 'Datamark · 2025',
    featured: false,
  },
  {
    icon: Globe,
    title: 'Web3 Ecosystem Participation',
    description: '3+ years of active participation across blockchain ecosystems: hackathons, community programs, ecosystem events, content campaigns, and governance initiatives across multiple chains.',
    meta: '2022–Present',
    featured: false,
  },
  {
    icon: Zap,
    title: 'Community Building & Content',
    description: 'Built educational threads, ecosystem onboarding content, and community engagement material across crypto and technology communities. Active public presence at @isharik99.',
    meta: '@isharik99 · X / Twitter',
    featured: false,
  },
  {
    icon: Award,
    title: 'Technology Consulting',
    description: 'Early-career internship at Deloitte supporting cloud readiness assessments and business analysis for enterprise client engagements — building a foundation in structured problem-solving.',
    meta: 'Deloitte · 2020',
    featured: false,
  },
]

export default function Highlights() {
  return (
    <section id="highlights" className="py-24 px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="section-label mb-4">Selected Highlights</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] tracking-tight mb-4 leading-tight">
            Contributions across every layer
          </h2>
          <p className="text-[var(--text-muted)] mb-14 max-w-xl leading-relaxed text-sm">
            A curated view of roles, initiatives, and moments across AI, operations, and emerging technology.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <StaggerItem key={item.title}>
                <div className={`h-full p-6 rounded-2xl border transition-all duration-300 card-lift ${
                  item.featured
                    ? 'border-primary/40 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-blue-950/25 dark:to-indigo-950/15 hover:border-primary/60'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-primary/20'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${item.featured ? 'bg-primary/15 text-primary' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                      <Icon size={15} />
                    </div>
                    {item.featured && (
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Featured</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[var(--text)] mb-2 text-sm">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{item.description}</p>
                  <p className="text-xs text-[var(--text-muted)] font-medium">{item.meta}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
