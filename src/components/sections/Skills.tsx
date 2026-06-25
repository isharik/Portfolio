'use client'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/Stagger'

const skillGroups = [
  {
    label: 'AI & LLM Operations',
    color: 'text-blue-600 dark:text-blue-400',
    skills: ['LLM Output Evaluation', 'Annotation & Labeling', 'AI Quality Assurance', 'Structured Feedback', 'RLHF Workflow Support', 'Model Behaviour Analysis'],
  },
  {
    label: 'Cloud & Systems',
    color: 'text-indigo-600 dark:text-indigo-400',
    skills: ['AWS Cloud Administration', 'System Administration', 'Incident Response & Resolution', 'Operational Reporting', 'Technical Troubleshooting', 'Infrastructure Monitoring'],
  },
  {
    label: 'Customer Success',
    color: 'text-sky-600 dark:text-sky-400',
    skills: ['Real-time Customer Support', 'Ticket Handling & Resolution', 'Customer Communication', 'Confidentiality Protocols', 'Interpretation Services', 'CRM Management'],
  },
  {
    label: 'Tools & Platforms',
    color: 'text-violet-600 dark:text-violet-400',
    skills: ['Zendesk', 'Intercom', 'Slack', 'Hubstaff', 'Office 365', 'Google Workspace', 'Zapier', 'Albato'],
  },
  {
    label: 'Community & Content',
    color: 'text-teal-600 dark:text-teal-400',
    skills: ['Ecosystem Storytelling', 'Community Building', 'Educational Content', 'Web3 Ecosystems', 'Content Threads & Campaigns', 'Onboarding Materials'],
  },
  {
    label: 'Automation & Process',
    color: 'text-emerald-600 dark:text-emerald-400',
    skills: ['Zapier Workflows', 'Albato Integrations', 'Process Documentation', 'Workflow Optimisation', 'Operational SOPs'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="section-label mb-4">Skills</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] tracking-tight mb-14 leading-tight">
            Tools, capabilities, and craft
          </h2>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => (
            <StaggerItem key={group.label}>
              <div className="h-full p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] card-lift hover:border-primary/25 transition-all duration-300">
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-5 ${group.color}`}>
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1.5 text-xs text-[var(--text-muted)] border border-[var(--border)] rounded-full bg-[var(--bg-secondary)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition-colors duration-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
