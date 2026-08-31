'use client'
import GlassCard from '@/components/ui/GlassCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { skillGroups } from '@/lib/content'

export default function Skills() {
  return (
    <section id="skills" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Skills" title="Tools, capabilities, and craft" />

        <Reveal stagger={0.06} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <RevealItem key={group.label}>
              <GlassCard interactive className="h-full p-6">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] text-fg-subtle">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-mono text-[11px] font-medium uppercase tracking-widest text-accent">
                    {group.label}
                  </h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="cursor-default rounded-full border border-border bg-surface/50 px-3 py-1.5 text-[13px] text-fg-muted transition-[color,border-color,background-color] duration-200 hover:border-accent hover:bg-accent-soft hover:text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
