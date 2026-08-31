'use client'
import { Brain, Cloud, Headset, Globe, PenTool, Workflow, GraduationCap } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { profile, languages, credentials } from '@/lib/content'

const focus = [
  { icon: Brain, label: 'AI & LLM Evaluation', note: 'Structured QA & RLHF feedback' },
  { icon: Cloud, label: 'Cloud & Systems', note: 'AWS administration & incident response' },
  { icon: Headset, label: 'Customer Operations', note: 'Real-time, high-stakes support' },
  { icon: Globe, label: 'Web3 Ecosystems', note: '3+ years across L1 communities' },
  { icon: PenTool, label: 'Content & Storytelling', note: 'Pharos Network storyteller' },
  { icon: Workflow, label: 'Automation', note: 'Zapier & Albato workflows' },
]

export default function About() {
  return (
    <section id="about" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left: narrative */}
          <div>
            <p className="eyebrow mb-4">About</p>
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-fg">
                Bridging AI precision with human-centered operations.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-fg-muted">
                <p>{profile.intro}</p>
                <p>
                  I work well in distributed, async, and technically complex environments — bringing
                  reliability, clarity, and genuine curiosity to every role. Whether it&apos;s calibrating an
                  LLM&apos;s output, resolving a customer&apos;s issue, or explaining a protocol to a new community,
                  the throughline is the same: make the complex dependable.
                </p>
              </div>
            </Reveal>

            {/* Languages */}
            <Reveal delay={0.1} className="mt-10">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-fg-subtle">Languages</p>
              <div className="flex flex-wrap gap-2">
                {languages.map(({ lang, level }) => (
                  <div
                    key={lang}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1.5 text-sm"
                  >
                    <span className="text-fg">{lang}</span>
                    <span className="text-fg-subtle">·</span>
                    <span className="text-xs text-fg-muted">{level}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: focus grid + credentials */}
          <div>
            <Reveal stagger={0.06} className="grid gap-3 sm:grid-cols-2">
              {focus.map(({ icon: Icon, label, note }) => (
                <RevealItem key={label}>
                  <GlassCard interactive className="h-full p-5">
                    <Icon size={18} className="text-accent" />
                    <div className="mt-4 text-sm font-medium text-fg">{label}</div>
                    <div className="mt-1 text-xs leading-relaxed text-fg-muted">{note}</div>
                  </GlassCard>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal delay={0.1} className="mt-4 space-y-2.5">
              {credentials.map((c) => (
                <div
                  key={c.title}
                  className="surface-card flex items-center gap-4 rounded-xl p-4"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                    <GraduationCap size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-fg">{c.title}</div>
                    <div className="truncate text-xs text-fg-muted">
                      {c.org} · {c.period}
                    </div>
                  </div>
                  <div className="hidden shrink-0 rounded-md bg-[var(--surface-muted)] px-2 py-1 font-mono text-[10px] text-fg-muted sm:block">
                    {c.note}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
