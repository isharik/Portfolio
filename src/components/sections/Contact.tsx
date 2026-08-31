'use client'
import { Twitter, Mail, ArrowUpRight, MapPin, CalendarClock, Download } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { profile, socials, booking } from '@/lib/content'

export default function Contact() {
  const bookingHref = booking.url || `mailto:${profile.email}`
  const bookingExternal = Boolean(booking.url)

  const routes = [
    { icon: Mail, title: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Twitter, title: 'DM on X', value: socials.twitterHandle, href: socials.twitter },
  ]

  return (
    <section id="contact" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-content">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left: pitch */}
          <div>
            <p className="eyebrow mb-4">Contact</p>
            <Reveal>
              <h2 className="text-display-sm font-display font-semibold text-fg">Let&apos;s find a time to talk.</h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-fg-muted">
                Open to roles in customer support, CX, and AI evaluation, plus freelance and ecosystem work.
                Grab a slot and we&apos;ll jump on a quick call.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-fg-muted">
                <MapPin size={14} className="text-accent" />
                {profile.location}
              </div>
            </Reveal>
          </div>

          {/* Right: book a call + direct routes */}
          <div className="flex flex-col gap-3">
            <Reveal>
              <a
                href={bookingHref}
                target={bookingExternal ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group glass relative block overflow-hidden rounded-2xl p-6 transition-transform duration-200 ease-out active:scale-[0.99] sm:p-7"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60 blur-3xl"
                  style={{ background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)' }}
                />
                <div className="relative flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-[var(--accent-fg)]">
                    <CalendarClock size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-fg">{booking.label}</h3>
                      <ArrowUpRight
                        size={17}
                        className="text-fg-subtle transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </div>
                    <p className="mt-1 text-sm text-fg-muted">{booking.detail}</p>
                  </div>
                </div>
              </a>
            </Reveal>

            <Reveal delay={0.08} stagger={0.06} className="grid gap-3 sm:grid-cols-2">
              {routes.map(({ icon: Icon, title, value, href }) => (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="reveal-child group flex items-center gap-3.5 rounded-xl border border-border bg-surface/40 p-4 transition-colors duration-200 hover:border-border-strong hover:bg-surface/70"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--surface-muted)] text-fg-muted transition-colors group-hover:text-accent">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-fg">{title}</div>
                    <div className="truncate text-xs text-fg-muted">{value}</div>
                  </div>
                  <ArrowUpRight size={15} className="shrink-0 text-fg-subtle transition-colors group-hover:text-accent" />
                </a>
              ))}
            </Reveal>

            {profile.resume && (
              <Reveal delay={0.16}>
                <a
                  href={profile.resume}
                  download="Sharik-Hussain-Resume.pdf"
                  className="group flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/40 px-4 py-3.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-border-strong hover:bg-surface/70"
                >
                  <Download size={16} className="text-fg-muted transition-colors group-hover:text-accent" />
                  Download résumé
                  <span className="font-mono text-[10px] text-fg-subtle">PDF</span>
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
