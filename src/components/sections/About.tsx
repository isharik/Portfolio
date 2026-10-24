'use client'
import { Brain, Code2, Headset, Globe, PenTool, Workflow, GraduationCap, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import GlassCard from '@/components/ui/GlassCard'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { profile, languages, credentials } from '@/lib/content'
import { cn } from '@/lib/utils'

const focus = [
  { icon: Brain, label: 'AI & LLM Evaluation', note: 'Structured QA & RLHF feedback' },
  { icon: Code2, label: 'Coding & Development', note: 'Python, JavaScript, TypeScript & modern web apps' },
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
                  I thrive in distributed, async, and technically demanding environments—combining reliability,
                  clarity, and curiosity in every role. Whether calibrating LLM outputs, resolving customer issues,
                  or making new protocols accessible to a community, I focus on one thing: making complex systems
                  dependable for the people who rely on them.
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
              {credentials.map((c) => {
                const card = (
                  <>
                    <div className={cn('relative grid shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-white text-accent', c.org === 'Micro1' ? 'h-9 w-9' : 'h-12', c.logo?.includes('pharos-network') ? 'w-[76px] px-1' : c.org === 'Micro1' ? '' : 'w-12')}>
                      {c.logo ? <Image src={c.logo} alt={`${c.org} logo`} fill sizes={c.logo.includes('pharos-network') ? '76px' : '48px'} unoptimized className={cn(c.logo.includes('miet') ? 'object-contain' : 'object-contain p-1')} /> : <GraduationCap size={17} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={cn('text-sm font-medium text-fg', c.org === 'Micro1' ? 'line-clamp-2 text-[13px] leading-tight' : 'truncate')}>{c.title}</div>
                      <div className="truncate text-xs text-fg-muted">
                        {c.org} · {c.period}
                      </div>
                    </div>
                    {c.org === 'Micro1' && c.href ? (
                      <ExternalLink size={14} className="shrink-0 text-fg-subtle" aria-hidden />
                    ) : (
                      <div className="hidden shrink-0 items-center gap-1 rounded-md bg-[var(--surface-muted)] px-2 py-1 font-mono text-[10px] text-fg-muted sm:flex">
                        {c.note} {c.href && <ExternalLink size={11} aria-hidden />}
                      </div>
                    )}
                  </>
                )

                if (c.org === 'Micro1' && c.href) {
                  return (
                    <div key={c.title} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noreferrer"
                        className="surface-card flex min-h-[84px] min-w-0 items-center gap-3 rounded-xl p-3 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[var(--accent)]"
                        aria-label={`Verify ${c.title}`}
                      >
                        {card}
                      </a>
                      <a
                        href="https://www.credly.com/badges/f77ea8b0-a683-4d04-97f4-34a61a49076f/print"
                        target="_blank"
                        rel="noreferrer"
                        className="surface-card inline-flex min-h-[84px] min-w-0 items-center justify-center gap-3 rounded-xl p-3 text-xs font-medium text-fg transition-[border-color,transform,background-color] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-surface"
                        aria-label="View AWS Academy Graduate badge on Credly"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-white" aria-hidden="true">
                          <svg viewBox="0 0 40 28" className="h-6 w-8" role="img" aria-label="AWS logo">
                            <text x="3" y="17" fill="#232f3e" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" letterSpacing="-1.2">aws</text>
                            <path d="M7 21.5c7 4.2 17 4.2 25-.5" fill="none" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" />
                            <path d="m29.5 18.8 3 2.2-3.5 1.5" fill="none" stroke="#ff9900" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="min-w-0 flex-1 text-left text-[13px] leading-tight">AWS Academy Graduate</span>
                        <ExternalLink size={14} className="shrink-0 text-fg-subtle" aria-hidden />
                      </a>
                    </div>
                  )
                }

                return c.href ? (
                  <a
                    key={c.title}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="surface-card flex items-center gap-4 rounded-xl p-4 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[var(--accent)]"
                    aria-label={`Verify ${c.title}`}
                  >
                    {card}
                  </a>
                ) : (
                  <div key={c.title} className="surface-card flex items-center gap-4 rounded-xl p-4">
                    {card}
                  </div>
                )
              })}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
