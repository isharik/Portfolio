'use client'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/Stagger'
import { ExternalLink } from 'lucide-react'

const projects = [
  {
    title: 'Pharos Octobot',
    description:
      'An AI-powered assistant built for the Pharos Network ecosystem. Users can query protocol data, explore ecosystem resources, and interact with Pharos documentation through a conversational interface. Built with Python and Streamlit.',
    tags: ['Python', 'Streamlit', 'AI', 'Web3', 'Pharos Network'],
    link: 'https://pharos-octobot-by-echo.streamlit.app/',
    status: 'Live',
  },
  {
    title: 'Pulse OS',
    description:
      'Pulse OS is an AI-powered Business Operating System designed to bring everything a business needs into one unified workspace.',
    tags: [ 'Nextjs 15' , 'TypeScript', 'Tailwind', 'CSS' , 'Framer Motion', 'AI'],
    link: 'https://x.com/isharik99/status/2073390275557474504',
    status: 'WIP',
  },
  {
    title: 'Vortex',
    description:
      'Vortex a real-time network topology & observability system. It turns raw traffic into a live, interactive map of your entire infrastructure.Front End Only',
    tags: ['Next js' , 'CSS' , 'Higgsfield MCP'],
    link: 'https://vortex12.vercel.app/',
    status: 'UI UX Live',
  },

  {
    title: 'Web3 Ecosystem Content Library',
    description:
      'A growing body of educational content, threads, and community posts covering blockchain ecosystems, DeFi protocols, Layer 1 networks, and Web3 onboarding — created under the @isharik99 identity across platforms.',
    tags: ['Content Creation', 'Web3', 'Community', 'Education', 'Threads'],
    link: 'https://twitter.com/isharik99',
    status: 'Ongoing',
  },
  {
    title: 'AI Evaluation Workflow Documentation',
    description:
      'Structured annotation guides, quality rubrics, and feedback templates developed during LLM evaluation work. Designed to bring consistency and calibration to AI output assessment workflows.',
    tags: ['LLM Evaluation', 'Documentation', 'AI Ops', 'Quality Assurance', 'SOPs'],
    link: null,
    status: 'Internal',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="section-label mb-4">Projects</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] tracking-tight mb-14 leading-tight">
            Things I&apos;ve shipped
          </h2>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-5">
          {projects.map((project) => (
            <StaggerItem key={project.title}>
              <div className="group h-full p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] card-lift hover:border-primary/30 transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    project.status === 'Live' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : project.status === 'Ongoing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {project.status}
                  </span>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                      className="text-[var(--text-muted)] hover:text-primary transition-all duration-200 opacity-0 group-hover:opacity-100 hover:-translate-y-0.5 inline-block">
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>

                <h3 className="font-semibold text-[var(--text)] mb-3">{project.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1 mb-6">{project.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
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
