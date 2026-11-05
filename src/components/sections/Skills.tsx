'use client'

import { Brain, Braces, Code2, Headset, Users, Workflow, type LucideIcon } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { skillGroups } from '@/lib/content'

const ICONS: LucideIcon[] = [Brain, Code2, Headset, Braces, Users, Workflow]
const BENTO_SIZES = ['skills-bento-feature', 'skills-bento-wide', 'skills-bento-compact', 'skills-bento-compact', 'skills-bento-wide', 'skills-bento-feature']
const TOOL_MARKS = [
  [{ mark: 'AI', name: 'AI operations' }, { mark: 'LLM', name: 'Large language models' }, { mark: 'QA', name: 'Quality assurance' }],
  [{ mark: 'Py', name: 'Python' }, { mark: 'JS', name: 'JavaScript' }, { mark: 'TS', name: 'TypeScript' }, { mark: '⚛', name: 'React' }],
  [{ mark: 'Z', name: 'Zendesk' }, { mark: '▦', name: 'Intercom' }, { mark: '#', name: 'Slack' }],
  [{ mark: 'G', name: 'Google Workspace' }, { mark: '365', name: 'Microsoft 365' }, { mark: '↯', name: 'Zapier' }],
  [{ mark: 'X', name: 'X' }, { mark: '◎', name: 'Web3 communities' }, { mark: '✦', name: 'Content storytelling' }],
  [{ mark: '↯', name: 'Zapier' }, { mark: 'A', name: 'Albato' }, { mark: '⌘', name: 'Process systems' }],
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
              const marks = TOOL_MARKS[index]
              return (
                <article key={group.label} className={`skills-bento-card ${BENTO_SIZES[index]}`}>
                  <div className="skills-bento-card-top">
                    <span className="skills-bento-icon"><Icon size={18} strokeWidth={1.65} /></span>
                    <span className="skills-bento-index">0{index + 1}</span>
                  </div>
                  <div>
                    <p className="skills-bento-eyebrow">WORKING SET</p>
                    <h3 className="skills-bento-title">{group.label}</h3>
                  </div>
                  <div className="skills-bento-mark-rail" aria-label={`${group.label} platform marks`}>
                    {marks.map(({ mark, name }) => <span key={name} className="skills-bento-mark" title={name} aria-label={name}>{mark}</span>)}
                  </div>
                  <div className="skills-bento-tools" aria-label={`${group.label} tools`}>
                    {group.skills.slice(0, index === 0 ? 5 : 4).map((skill) => (
                      <span key={skill} className="skills-bento-tool" title={skill}>{skill}</span>
                    ))}
                  </div>
                  <div className="skills-bento-footer"><span>{group.skills.length} capabilities</span><span>↗</span></div>
                </article>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
