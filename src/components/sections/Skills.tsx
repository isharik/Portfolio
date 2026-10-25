'use client'

import { Brain, Code2, FileText, FolderOpen, Headset, Sparkles, Users, Workflow, type LucideIcon } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { skillGroups } from '@/lib/content'

const ICONS: LucideIcon[] = [Brain, Code2, Headset, Sparkles, Users, Workflow]

/** Liquid-glass capability folders, styled to follow the active app theme. */
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
                  <article key={group.label} className="skill-folder group relative">
                    <div className="skill-folder-body">
                      <div className="skill-folder-heading">
                        <span className="skill-folder-symbol"><Icon size={18} strokeWidth={1.7} /></span>
                        <div className="min-w-0">
                          <p className="skill-folder-eyebrow">CAPABILITY FOLDER · Nº 0{index + 1}</p>
                          <h3 className="skill-folder-title">{group.label}</h3>
                        </div>
                        <FolderOpen className="skill-folder-open" size={18} strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <div className="skill-folder-divider" />
                      <ul className="skill-folder-files">
                        {group.skills.map((skill) => (
                          <li key={skill} className="skill-folder-file">
                            <FileText size={13} strokeWidth={1.6} aria-hidden="true" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="skill-folder-footer"><span>{group.skills.length} FILES</span><span>TOOLBOX / 0{index + 1}</span></div>
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
