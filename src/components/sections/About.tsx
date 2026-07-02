'use client'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/Stagger'

const interests = [
  'AI & LLMs', 'Operations', 'Customer Experience',
  'Front End Dev','Web3 Ecosystems', 'Automation & Tooling', 'Community Building',
  'Content', 'Emerging Technology',
]

const languages = [
  { lang: 'English', level: 'Native' },
  { lang: 'Hindi', level: 'Native' },
  { lang: 'Urdu', level: 'Native' },
  { lang: 'Kashmiri', level: 'Conversational' },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          <div>
            <FadeIn>
              <p className="section-label mb-4">About</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] tracking-tight mb-6 leading-tight">
                Bridging AI precision with human-centered operations
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="space-y-4 text-[var(--text-muted)] leading-relaxed text-sm md:text-base">
                <p>
                  I hold a Bachelor of Computer Science from MIET Jammu & Kashmir and have spent the past
                  four years building experience across AI evaluation, cloud infrastructure, customer
                  operations, and technology community work.
                </p>
                <p>
                  Currently I evaluate large language model outputs at <strong className="text-[var(--text)]">Invisible Technologies</strong>,
                  providing structured quality feedback that shapes how AI systems improve. Before that,
                  I spent a full year as a System Administrator at <strong className="text-[var(--text)]">KodeKloud</strong>, handling
                  AWS-based cloud infrastructure and technical incident resolution in a fully remote environment.
                </p>
                <p>
                  I spent over three years actively participating in blockchain ecosystems — joining community
                  programs, hackathons, governance initiatives, and content campaigns across multiple chains.
                  That work evolved into my current role as a selected <strong className="text-[var(--text)]">Storyteller for Pharos Network</strong>,
                  where I create content and shape the ecosystem narrative heading into mainnet.
                </p>
                <p>
                  I work well in distributed, async, and technically complex environments. I bring
                  reliability, clarity, and genuine curiosity to every role I take on.
                </p>
              </div>
            </FadeIn>
          </div>

          <div>
            <FadeIn delay={0.15}>
              <p className="section-label mb-5">Areas of focus</p>
              <StaggerContainer className="flex flex-wrap gap-2 mb-10">
                {interests.map((item) => (
                  <StaggerItem key={item}>
                    <span className="px-3 py-1.5 text-xs border border-[var(--border)] text-[var(--text-muted)] rounded-full bg-[var(--card)] hover:border-primary hover:text-primary transition-all duration-200 cursor-default inline-block">
                      {item}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p className="section-label mb-4">Education</p>
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] mb-6 card-lift hover:border-primary/30">
                <div className="font-semibold text-[var(--text)] mb-1">Bachelor of Computer Science</div>
                <div className="text-sm text-[var(--text-muted)] mb-2">MIET · Jammu & Kashmir · 2019 – 2023</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">GPA 3.1 / 4.0</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="section-label mb-4">Languages</p>
              <div className="grid grid-cols-2 gap-3">
                {languages.map(({ lang, level }) => (
                  <div key={lang} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--card)] card-lift hover:border-primary/20">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-[var(--text)] font-medium">{lang}</span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">{level}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
