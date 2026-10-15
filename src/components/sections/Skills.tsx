'use client'

import { Brain, Code2, Headset, Sparkles, Users, Workflow, type LucideIcon } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { skillGroups } from '@/lib/content'

const ICONS: LucideIcon[] = [Brain, Code2, Headset, Sparkles, Users, Workflow]

/** A single structured board keeps the skill inventory scannable and light. */
export default function Skills() {
  return (
    <section id="skills" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Skills" title="Tools, capabilities, and craft" description="The practical skills I use to turn complex work into dependable outcomes." />

        <Reveal className="mt-12">
          <div className="skills-board overflow-hidden rounded-3xl border border-border bg-surface/70 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Capabilities board</span>
              <span className="font-mono text-[10px] text-accent">{skillGroups.flatMap((group) => group.skills).length} skills</span>
            </div>
            <div className="divide-y divide-border">
              {skillGroups.map((group, index) => {
                const Icon = ICONS[index % ICONS.length]
                return (
                  <article key={group.label} className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(11rem,0.72fr)_1.6fr] sm:items-center sm:px-7">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                        <Icon size={17} />
                      </span>
                      <h3 className="font-display text-base font-semibold text-fg">{group.label}</h3>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <li key={skill} className="rounded-full border border-border bg-[var(--surface-muted)]/60 px-3 py-1.5 text-xs text-fg-muted transition-colors duration-200 hover:border-[var(--accent)] hover:text-fg">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
