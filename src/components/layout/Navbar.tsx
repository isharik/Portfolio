'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import SoundToggle from '@/components/ui/SoundToggle'
import { navLinks, profile } from '@/lib/content'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  // Scroll state: glass after 20px, hide when scrolling down past the hero
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > last && y > 400 && !open)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  // Active section via IntersectionObserver
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? -90 : 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4"
    >
      <nav
        className={cn(
          'flex w-full max-w-content items-center justify-between rounded-full px-4 py-2 transition-[background,border-color,box-shadow,backdrop-filter] duration-300 ease-out sm:px-5',
          scrolled ? 'glass' : 'border border-transparent'
        )}
      >
        <a
          href="#home"
          onClick={(e) => go(e, '#home')}
          className="flex items-center gap-2 rounded-full font-display text-sm font-semibold tracking-tight text-fg"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-[13px] font-bold text-[var(--accent-fg)]">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.slice(1)
            const on = active === id
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200',
                    on ? 'text-fg' : 'text-fg-muted hover:text-fg'
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--surface-muted)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <SoundToggle />
          <ThemeToggle />
          <a
            href="#contact"
            onClick={(e) => go(e, '#contact')}
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition-[filter,transform] duration-200 ease-out hover:brightness-110 active:scale-95 md:inline-flex"
          >
            Get in touch
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60 text-fg-muted transition-colors hover:text-fg md:hidden"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="glass absolute left-4 right-4 top-[64px] rounded-2xl p-2 md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    className="block rounded-xl px-4 py-3 text-sm text-fg-muted transition-colors hover:bg-[var(--surface-muted)] hover:text-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="p-2">
                <a
                  href="#contact"
                  onClick={(e) => go(e, '#contact')}
                  className="block rounded-xl bg-accent px-4 py-3 text-center text-sm font-medium text-[var(--accent-fg)]"
                >
                  Get in touch
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
