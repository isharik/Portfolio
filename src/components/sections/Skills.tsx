'use client'

import { Brain, Code2, Headset, Sparkles, Users, Workflow, type LucideIcon } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { skillGroups } from '@/lib/content'

const ICONS: LucideIcon[] = [Brain, Code2, Headset, Sparkles, Users, Workflow]

/** Independent toolbox postcards with a light Windows XP-era UI influence. */
export default function Skills() {
  return (
    <section id="skills" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Skills" title="Tools, capabilities, and craft" description="The practical skills I use to turn complex work into dependable outcomes." />

        <Reveal className="mt-12">
          <>
            <div className="skills-postcard-strip flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4 shadow-[0_10px_26px_-22px_rgba(0,0,0,0.55)] sm:px-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Postcards from the toolbox</span>
              <span className="font-mono text-[10px] text-accent">{skillGroups.flatMap((group) => group.skills).length} stamps</span>
            </div>
            <div className="skills-postcard-grid mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skillGroups.map((group, index) => {
                const Icon = ICONS[index % ICONS.length]
                return (
                  <article key={group.label} className="skills-postcard group overflow-hidden rounded-lg border border-border-strong bg-surface shadow-[0_12px_32px_-22px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)]">
                    <div className="skills-postcard-titlebar flex min-h-12 items-center gap-2.5 px-3.5 py-2.5 text-white">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-white/35 bg-white/15 shadow-[inset_0_1px_rgba(255,255,255,0.35)]"><Icon size={15} strokeWidth={2.2} /></span>
                      <h3 className="min-w-0 flex-1 font-mono text-[11px] font-bold uppercase leading-tight tracking-[0.045em]">{group.label}</h3>
                      <span className="skills-window-close" aria-hidden="true">×</span>
                    </div>
                    <div className="skills-postcard-body p-4 sm:p-5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg-subtle">TOOLBOX FILE · {String(index + 1).padStart(2, '0')}</p>
                      <div className="my-3 border-t border-dashed border-border" />
                      <ul className="flex flex-wrap gap-2">
                        {group.skills.map((skill) => <li key={skill} className="skills-postcard-tag rounded border border-border-strong px-2 py-1.5 font-mono text-[10px] leading-tight text-fg-muted transition-colors duration-200 group-hover:border-accent/40">{skill}</li>)}
                      </ul>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-fg-subtle"><span>{group.skills.length} stamps</span><span>XP · {String(index + 1).padStart(2, '0')}</span></div>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        </Reveal>
      </div>
    </section>
  )
}
