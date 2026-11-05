'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import {
  BriefcaseBusiness,
  Home,
  Layers3,
  Mail,
  PanelsTopLeft,
  UserRound,
  Menu,
  X,
} from 'lucide-react'
import LampToggle from '@/components/ui/LampToggle'
import SoundToggle from '@/components/ui/SoundToggle'
import { navLinks, profile } from '@/lib/content'
import { cn } from '@/lib/utils'
import { scrollToSection } from '@/lib/scroll'

export default function Navbar() {
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  const navIcons = [Home, UserRound, BriefcaseBusiness, PanelsTopLeft, Layers3, Mail]

  // Scroll state: glass after 20px, hide when scrolling down past the hero
  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        setScrolled(y > 20)
        const shouldHide = y > last && y > 400 && !open
        setHidden(shouldHide)
        last = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
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
    scrollToSection(href, Boolean(reduce))
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
          'navbar-shell flex w-full max-w-content items-center justify-between rounded-full px-4 py-2 sm:px-5',
          scrolled && 'is-scrolled'
        )}
      >
        <a
          href="#home"
          data-sound="hero"
          onClick={(e) => go(e, '#home')}
          className="flex items-center gap-2 rounded-full font-display text-sm font-semibold tracking-tight text-fg"
        >
          <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-border bg-surface">
            <Image src="/profile-photo.webp" alt="" fill sizes="32px" className="navbar-profile-image" />
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        <ul
          onMouseLeave={() => setHoveredTab(null)}
          className="navbar-island hidden w-[min(420px,calc(100vw-25rem))] min-w-[380px] items-center justify-between rounded-full p-1.5 md:flex"
        >
          {navLinks.map((link, index) => {
            const id = link.href.slice(1)
            const on = active === id
            const expanded = hoveredTab === id
            const Icon = navIcons[index]
            return (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  data-sound={id === 'home' ? 'hero' : id}
                  onClick={(e) => go(e, link.href)}
                  onMouseEnter={() => setHoveredTab(id)}
                  onFocus={() => setHoveredTab(id)}
                  onBlur={() => setHoveredTab(null)}
                  aria-label={link.label}
                  initial={false}
                  animate={{
                    gap: expanded ? 9 : 0,
                    paddingLeft: expanded ? 16 : 13,
                    paddingRight: expanded ? 16 : 13,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 30, mass: 0.7 }}
                  className={cn(
                    'relative isolate flex h-10 items-center overflow-hidden rounded-full text-sm font-medium transition-colors duration-200',
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
                  <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                  <motion.span
                    initial={false}
                    animate={{ width: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden whitespace-nowrap"
                    aria-hidden="true"
                  >
                    {link.label}
                  </motion.span>
                </motion.a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <SoundToggle />
          <a
            href="#contact"
            data-sound="contact"
            onClick={(e) => go(e, '#contact')}
            className="hidden rounded-full bg-[#22282a] px-4 py-2 text-sm font-medium text-white transition-[filter,transform] duration-200 ease-out hover:brightness-125 active:scale-95 md:inline-flex"
          >
            Get in touch
          </a>
          <LampToggle />
          <button
            data-sound="navigation"
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
                  className="block rounded-xl bg-[#22282a] px-4 py-3 text-center text-sm font-medium text-white"
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
