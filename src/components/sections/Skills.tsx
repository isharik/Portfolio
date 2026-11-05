'use client'

import { Brain, Braces, Code2, Headset, Layers3, Sparkles, Users, Workflow, type LucideIcon } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { skillGroups } from '@/lib/content'

const ICONS: LucideIcon[] = [Brain, Code2, Headset, Layers3, Users, Workflow]
const BENTO_SIZES = ['skills-bento-tall', 'skills-bento-wide', 'skills-bento-wide', 'skills-bento-wide', 'skills-bento-wide', 'skills-bento-tall']
const CARD_COPY = [
  { label: 'Model craft', note: 'Evaluate, annotate, improve', glyph: '✦' },
  { label: 'Build mode', note: 'Code, ship, refine', glyph: '⌘' },
  { label: 'People first', note: 'Resolve with clarity', glyph: '☺' },
  { label: 'Everyday stack', note: 'Tools that keep work moving', glyph: '↗' },
  { label: 'Community notes', note: 'Make new ideas useful', glyph: '✎' },
  { label: 'Systems desk', note: 'Turn repeat work into flow', glyph: '↯' },
]

/** A concise bento view of the tools used across each working discipline. */
export default function Skills() {
  return (
    <section id="skills" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading eyebrow="Skills" title="Tools, capabilities, and craft" description="The practical skills I use to turn complex work into dependable outcomes." />

        <Reveal className="mt-10">
          <div className="skills-postcard-strip flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4 shadow-[0_10px_26px_-22px_rgba(0,0,0,0.55)] sm:px-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Postcards from the toolbox</span>
            <span className="font-mono text-[10px] text-accent">{skillGroups.flatMap((group) => group.skills).length} stamps</span>
          </div>
          <div className="skills-bento mt-5">
            {skillGroups.map((group, index) => {
              const Icon = ICONS[index]
              const card = CARD_COPY[index]
              return (
                <article key={group.label} className={`skills-bento-card skills-bento-card-${index} ${BENTO_SIZES[index]}`}>
                  <div className="skills-bento-art" aria-hidden="true">
                    <span className="skills-bento-sticker">{card.glyph}</span>
                    <span className="skills-bento-paper skills-bento-paper-back" />
                    <span className="skills-bento-paper skills-bento-paper-main"><Icon size={26} strokeWidth={1.45} /></span>
                    <span className="skills-bento-paper skills-bento-paper-note">0{index + 1}<i /></span>
                  </div>
                  <div className="skills-bento-copy">
                    <p className="skills-bento-eyebrow">{card.label}</p>
                    <h3 className="skills-bento-title">{group.label}</h3>
                    <p className="skills-bento-note">{card.note}</p>
                  </div>
                  <div className="skills-bento-tools" aria-label={`${group.label} tools`}>
                    {group.skills.slice(0, 3).map((skill) => <span key={skill} className="skills-bento-tool">{skill}</span>)}
                  </div>
                  <div className="skills-bento-footer"><span>{group.skills.length} capabilities</span><span>View set ↗</span></div>
                </article>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
