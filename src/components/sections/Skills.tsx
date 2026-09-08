'use client'
import { type CSSProperties } from 'react'
import { Brain, Server, Headset, Wrench, Users, Workflow, type LucideIcon } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { skillGroups } from '@/lib/content'

const ICONS: LucideIcon[] = [Brain, Server, Headset, Wrench, Users, Workflow]
const ROTATIONS = ['-2.4deg', '1.6deg', '-1.4deg', '2deg', '-1.8deg', '1.2deg']

export default function Skills() {
  return (
    <section id="skills" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Skills" title="Tools, capabilities, and craft" description="A few postcards from the toolbox." />

        <Reveal stagger={0.07} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <RevealItem key={group.label}>
                <article
                  className="postcard group relative h-full overflow-hidden rounded-md border border-border bg-surface p-5 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.5)] hover:shadow-[0_26px_55px_-18px_rgba(0,0,0,0.6)]"
                  style={{ '--rot': ROTATIONS[i % ROTATIONS.length] } as CSSProperties}
                >
                  {/* paper warmth + faint grain */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(255,241,214,0.06)] via-transparent to-[rgba(120,120,220,0.04)]" />
                  <div className="pointer-events-none absolute inset-2 rounded-[3px] border border-border/60" />

                  {/* postage stamp */}
                  <div className="absolute right-4 top-4 rotate-6 transition-transform duration-300 group-hover:rotate-[10deg]">
                    <div className="grid h-14 w-11 place-items-center rounded-[3px] bg-white p-[3px] shadow-md">
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-[2px] bg-gradient-to-br from-accent to-[#8b5bd6] text-[var(--accent-fg)]">
                        <Icon size={15} strokeWidth={2} />
                        <span className="mt-0.5 font-mono text-[6px] tracking-wider">Nº0{i + 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* postmark ring, stamped over the corner */}
                  <div aria-hidden className="pointer-events-none absolute right-9 top-9 h-16 w-16 -rotate-12 opacity-25">
                    <div className="absolute inset-0 rounded-full border border-dashed border-fg" />
                    <div className="absolute inset-[5px] rounded-full border border-fg/70" />
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[6px] uppercase tracking-widest text-fg">
                      · air mail ·
                    </div>
                  </div>

                  {/* address block */}
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">Greetings from</p>
                  <h3 className="mt-1 max-w-[70%] font-display text-lg font-semibold leading-tight text-fg">
                    {group.label}
                  </h3>

                  <div className="my-4 border-t border-dashed border-border" />

                  <ul className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-[3px] border border-border bg-surface/60 px-2 py-1 text-[12px] text-fg-muted transition-colors duration-200 group-hover:border-border-strong"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>

                  {/* postmark footer */}
                  <div className="mt-5 flex items-center justify-between font-mono text-[10px] text-fg-subtle">
                    <span>{group.skills.length} stamps</span>
                    <span className="tracking-widest">EST · IN</span>
                  </div>
                </article>
              </RevealItem>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
