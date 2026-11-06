'use client'

import { useEffect, useState } from 'react'
import { Brain, Code2, Headset, Layers3, Users, Workflow, X, type LucideIcon } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { skillGroups } from '@/lib/content'

const ICONS: LucideIcon[] = [Brain, Code2, Headset, Layers3, Users, Workflow]
const BENTO_SIZES = ['skills-bento-tall', 'skills-bento-wide', 'skills-bento-wide', 'skills-bento-wide', 'skills-bento-wide', 'skills-bento-tall']
const CARD_COPY = [
  { label: 'Model craft', note: 'Evaluate, annotate, improve', glyph: '✦', detail: 'I assess model outputs for accuracy, consistency, safety, and usefulness—then turn the findings into structured feedback that improves future responses.', proof: 'Applied across high-volume evaluation, annotation, and human-in-the-loop QA workflows.' },
  { label: 'Build mode', note: 'Code, ship, refine', glyph: '⌘', detail: 'I build practical web tools and portfolio projects with a focus on clear interfaces, maintainable code, and dependable delivery.', proof: 'Used to ship projects including Pharos OctoBot and the Pharos Onchain Wizard.' },
  { label: 'People first', note: 'Resolve with clarity', glyph: '☺', detail: 'I resolve time-sensitive customer needs with clear communication, careful context handling, and a calm path to the next step.', proof: 'Developed through remote support, CRM workflows, and interpretation-led customer conversations.' },
  { label: 'Everyday stack', note: 'Tools that keep work moving', glyph: '↗', detail: 'I connect the everyday tools that teams rely on, keeping updates, handoffs, and repetitive tasks organized and traceable.', proof: 'Hands-on with support platforms, workplace suites, and no-code automation tools.' },
  { label: 'Community notes', note: 'Make new ideas useful', glyph: '✎', detail: 'I translate emerging technology into useful stories, onboarding material, and community content people can act on.', proof: 'Created ecosystem storytelling and education for Web3 communities and product audiences.' },
  { label: 'Systems desk', note: 'Turn repeat work into flow', glyph: '↯', detail: 'I document repeatable processes and connect workflows so teams can move faster without losing operational clarity.', proof: 'Applied through Zapier and Albato automations, SOPs, and workflow optimization.' },
]

/** A concise bento view of the tools used across each working discipline. */
export default function Skills() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selected = selectedIndex === null ? null : skillGroups[selectedIndex]
  const selectedCard = selectedIndex === null ? null : CARD_COPY[selectedIndex]
  const SelectedIcon = selectedIndex === null ? null : ICONS[selectedIndex]

  useEffect(() => {
    if (selectedIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIndex])

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
                    {group.skills.length > 3 && <span className="skills-bento-tool skills-bento-tool-more">+{group.skills.length - 3} more</span>}
                  </div>
                  <div className="skills-bento-footer"><span>{group.skills.length} capabilities</span><button type="button" onClick={() => setSelectedIndex(index)} aria-haspopup="dialog">View set <span aria-hidden="true">↗</span></button></div>
                </article>
              )
            })}
          </div>
        </Reveal>
      </div>
      {selected && selectedCard && SelectedIcon && (
        <div className="skills-set-backdrop" role="presentation" onMouseDown={() => setSelectedIndex(null)}>
          <section className={`skills-set-dialog skills-set-dialog-${selectedIndex}`} role="dialog" aria-modal="true" aria-labelledby="skills-set-title" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="skills-set-close" onClick={() => setSelectedIndex(null)} aria-label={`Close ${selected.label} skill set`}><X size={18} /></button>
            <div className="skills-set-visual" aria-hidden="true">
              <span className="skills-set-sheet skills-set-sheet-back" />
              <span className="skills-set-sheet skills-set-sheet-middle" />
              <span className="skills-set-sheet skills-set-sheet-front"><SelectedIcon size={38} strokeWidth={1.35} /></span>
              <span className="skills-set-mark">0{(selectedIndex ?? 0) + 1}</span>
            </div>
            <div className="skills-set-content">
              <p className="skills-set-kicker">Capability set · {selected.skills.length} skills</p>
              <h3 id="skills-set-title">{selected.label}</h3>
              <p className="skills-set-detail">{selectedCard.detail}</p>
              <p className="skills-set-proof">{selectedCard.proof}</p>
              <div className="skills-set-list" aria-label={`${selected.label} skills`}>
                {selected.skills.map((skill, skillIndex) => <span key={skill}><b>0{skillIndex + 1}</b>{skill}</span>)}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
