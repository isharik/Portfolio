'use client'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { profile, socials, navLinks } from '@/lib/content'

export default function Footer() {
  const year = new Date().getFullYear()
  const links = [
    { href: socials.github, Icon: Github, label: 'GitHub' },
    { href: socials.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: socials.twitter, Icon: Twitter, label: 'X / Twitter' },
    { href: `mailto:${socials.email}`, Icon: Mail, label: 'Email' },
  ]

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-border px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-[13px] font-bold text-[var(--accent-fg)]">
                {profile.initials}
              </span>
              <span className="font-display text-sm font-semibold text-fg">{profile.name}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              {profile.role} · {profile.location}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-[11px] text-fg-muted">Available for opportunities</span>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-fg-subtle">© {year} {profile.name}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            {links.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full text-fg-muted transition-colors duration-200 hover:bg-[var(--surface-muted)] hover:text-fg"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
