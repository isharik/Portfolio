'use client'

import { Brain, Code2, Headset, Sparkles, Users, Workflow, type LucideIcon } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { skillGroups } from '@/lib/content'

const ICONS: LucideIcon[] = [Brain, Code2, Headset, Sparkles, Users, Workflow]

/** Postcard styling, organised inside one shared board rather than scattered cards. */
export default function Skills() {
  return (
    <section id="skills" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Skills" title="Tools, capabilities, and craft" description="The practical skills I use to turn complex work into dependable outcomes." />

        <Reveal className="mt-12">
          <div className="skills-postcard-board overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between border-b border-dashed border-border px-5 py-4 sm:px-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Postcards from the toolbox</span>
              <span className="font-mono text-[10px] text-accent">{skillGroups.flatMap((group) => group.skills).length} stamps</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {skillGroups.map((group, index) => {
                const Icon = ICONS[index % ICONS.length]
                return (
                  <article key={group.label} className="skills-postcard group relative overflow-hidden p-5">
                    <div className="pointer-events-none absolute inset-2 rounded-[3px] border border-border/60" />
                    <div className="absolute right-5 top-5 rotate-6 transition-transform duration-300 group-hover:rotate-[10deg]">
                      <div className="grid h-12 w-10 place-items-center rounded-[3px] bg-white p-[3px] shadow-md">
                        <div className="flex h-full w-full flex-col items-center justify-center rounded-[2px] bg-gradient-to-br from-accent to-[#8b5bd6] text-[var(--accent-fg)]">
                          <Icon size={14} strokeWidth={2} />
                          <span className="mt-0.5 font-mono text-[6px] tracking-wider">Nº0{index + 1}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute right-8 top-8 h-14 w-14 -rotate-12 opacity-20">
                      <div className="absolute inset-0 rounded-full border border-dashed border-fg" />
                      <div className="absolute inset-[5px] rounded-full border border-fg/70" />
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">Greetings from</p>
                    <h3 className="mt-1 max-w-[72%] font-display text-lg font-semibold leading-tight text-fg">{group.label}</h3>
                    <div className="my-4 border-t border-dashed border-border" />
                    <ul className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => <li key={skill} className="rounded-[3px] border border-border bg-surface/60 px-2 py-1 text-[12px] text-fg-muted transition-colors duration-200 group-hover:border-border-strong">{skill}</li>)}
                    </ul>
                    <div className="mt-5 flex items-center justify-between font-mono text-[10px] text-fg-subtle"><span>{group.skills.length} stamps</span><span className="tracking-widest">EST · IN</span></div>
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
