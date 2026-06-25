'use client'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/Stagger'
import { Briefcase } from 'lucide-react'

const experiences = [
  {
    role: 'LLM Evaluator / Quality Assurance Specialist',
    company: 'Invisible Technologies',
    companyDesc: 'AI operations & human-in-the-loop services company',
    period: 'Jul 2025 – Present',
    type: 'Full-time · Remote',
    description:
      'Evaluate outputs from large language models against accuracy, coherence, and task-fitness criteria. Work within structured annotation and quality assurance workflows that feed directly into model improvement pipelines.',
    highlights: [
      'Assess AI-generated outputs across diverse domains including reasoning, coding, and language tasks',
      'Apply structured annotation frameworks to surface systematic model weaknesses and edge cases',
      'Deliver calibrated quality feedback that contributes to LLM fine-tuning and RLHF pipelines',
      'Maintain consistency and rigour across high-volume evaluation workflows in an async remote environment',
    ],
    tags: ['LLM Evaluation', 'AI Quality Assurance', 'Annotation', 'RLHF Feedback', 'Structured Feedback'],
    current: true,
  },
  {
    role: 'Customer Support Specialist — Interpretation Services',
    company: 'Datamark',
    companyDesc: 'Business process outsourcing & customer experience firm',
    period: 'Mar 2025 – May 2025',
    type: 'Full-time · Remote',
    description:
      'Delivered real-time customer communication and interpretation support in high-stakes environments where precision and speed were equally critical. Maintained strict confidentiality and quality standards across every interaction.',
    highlights: [
      'Resolved complex customer queries in live, time-sensitive support environments with zero lag tolerance',
      'Applied and upheld confidentiality protocols across sensitive communication contexts',
      'Maintained quality and consistency across high-volume, fast-paced support flows',
      'Operated across communication channels using Zendesk and internal CRM tooling',
    ],
    tags: ['Customer Support', 'Real-time Communication', 'Zendesk', 'CRM', 'Quality Standards'],
    current: false,
  },
  {
    role: 'System Administrator',
    company: 'KodeKloud',
    companyDesc: 'Online platform for DevOps & cloud engineering training',
    period: 'Jan 2024 – Dec 2024',
    type: 'Full-time · Remote',
    description:
      'Managed cloud-based infrastructure and operational systems across a full year of hands-on system administration. Investigated and resolved technical incidents, performed regular reporting, and contributed to operational analysis across a distributed, remote-first environment.',
    highlights: [
      'Administered AWS-based cloud infrastructure supporting platform operations and learner environments',
      'Investigated and resolved technical incidents, minimising downtime and escalating where appropriate',
      'Produced operational reporting and performance analysis for internal stakeholders',
      'Operated with Slack, Office 365, and HubStaff across fully distributed team workflows',
    ],
    tags: ['AWS', 'Cloud Administration', 'Incident Response', 'Systems Operations', 'Technical Reporting'],
    current: false,
  },
  {
    role: 'Technology Consultant Intern',
    company: 'Deloitte',
    companyDesc: 'Global professional services & consulting firm',
    period: 'May 2020 – Sep 2020',
    type: 'Internship · Remote',
    description:
      'Contributed to cloud readiness assessments and business analysis activities as part of a technology consulting team. Assisted in operational planning and solution documentation for enterprise client engagements.',
    highlights: [
      'Supported cloud readiness assessments and gap analysis activities for enterprise client engagements',
      'Contributed to solution documentation, process recommendations, and planning deliverables',
      'Gained early exposure to enterprise technology consulting workflows and cross-functional team dynamics',
    ],
    tags: ['Cloud Readiness', 'Business Analysis', 'Enterprise Consulting', 'Solution Documentation'],
    current: false,
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="section-label mb-4">Experience</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] tracking-tight mb-3 leading-tight">
            Built across AI, cloud, and customer operations
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-14 max-w-xl">
            Four roles. One consistent thread — operating at the edge of where technology and human judgement meet.
          </p>
        </FadeIn>

        <StaggerContainer className="space-y-5">
          {experiences.map((exp) => (
            <StaggerItem key={exp.company}>
              <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 card-lift ${
                exp.current
                  ? 'border-primary/30 bg-blue-50/50 dark:bg-blue-950/15 hover:border-primary/50'
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-primary/20'
              }`}>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-[var(--text)] text-base md:text-lg">{exp.role}</h3>
                      {exp.current && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-[var(--text)] mb-0.5">{exp.company}</div>
                    <div className="text-xs text-[var(--text-muted)] mb-0.5">{exp.companyDesc}</div>
                    <div className="text-xs text-[var(--text-muted)]">{exp.period} · {exp.type}</div>
                  </div>
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${exp.current ? 'bg-primary/10 text-primary' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                    <Briefcase size={16} />
                  </div>
                </div>

                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">{exp.description}</p>

                <ul className="space-y-2 mb-6">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                      <span className="mt-2 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-xs border border-[var(--border)] text-[var(--text-muted)] rounded-md bg-[var(--bg-secondary)]">
                      {tag}
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
