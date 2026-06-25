'use client'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/Stagger'
import { Mail, Linkedin, Twitter, Phone } from 'lucide-react'

const contactLinks = [
  { icon: Mail, label: 'Email', value: 'sharikhussain99@gmail.com', href: 'mailto:sharikhussain99@gmail.com' },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/sharikhussain1', href: 'https://linkedin.com/in/sharikhussain1' },
  { icon: Twitter, label: 'X / Twitter', value: '@isharik99', href: 'https://twitter.com/isharik99' },
  { icon: Phone, label: 'Phone', value: '+91 60056 22259', href: 'tel:+916005622259' },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn>
              <p className="section-label mb-4">Contact</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] tracking-tight mb-6 leading-tight">
                Let&apos;s talk about what you&apos;re building
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm mb-4">
                I&apos;m open to roles in AI operations, LLM evaluation, customer experience, cloud
                administration, and technical operations.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                If you&apos;re a founder, hiring manager, or operator building something worth working on
                — I&apos;d like to hear about it.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 gap-4">
            {contactLinks.map((item) => {
              const Icon = item.icon
              return (
                <StaggerItem key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-primary/40 hover:bg-[var(--card-hover)] transition-all duration-300 group card-lift"
                  >
                    <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-muted)] group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300 flex-shrink-0">
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-[var(--text-muted)] mb-0.5">{item.label}</div>
                      <div className="text-sm font-medium text-[var(--text)] truncate">{item.value}</div>
                    </div>
                  </a>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
