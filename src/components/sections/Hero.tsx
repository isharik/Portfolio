'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Linkedin, Twitter, Mail, MapPin, Download } from 'lucide-react'
import Image from 'next/image'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 px-6 overflow-hidden">
      {/* Ambient background glow */}
      <div className="glow-orb w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/6 top-[-100px] right-[-100px]" />
      <div className="glow-orb w-[400px] h-[400px] bg-indigo-500/8 dark:bg-indigo-500/4 bottom-[-50px] left-[-100px]" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr_340px] gap-16 items-center">

          {/* Left — text content */}
          <div>
            {/* Status badge */}
            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <MapPin size={11} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)] font-medium">India · Open to remote roles</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.2)}
              className="text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.5rem] font-bold tracking-tight text-[var(--text)] leading-[1.05] mb-6"
            >
              Reliable at the edges 
              <br />
              where{' '}
              <span className="gradient-text">Technology</span>
              <br />
              <span className="gradient-text">& People Meet.</span>
            </motion.h1>

            {/* Positioning statement */}
            <motion.p {...fadeUp(0.3)} className="text-lg text-[var(--text-muted)] leading-relaxed mb-4 max-w-2xl">
              I&apos;m <span className="text-[var(--text)] font-semibold">Sharik Fataing</span> — a technology professional specialising in
              customer Support,LLM evaluation, cloud systems,and emerging technology ecosystems.
              Currently working as QA Specialist at{' '}
              <span className="text-[var(--text)] font-medium">Invisible Technologies</span>{' '}
              and serving as a Content Creator for{' '}
              <span className="text-[var(--text)] font-medium">Pharos Network</span>.
            </motion.p>

            <motion.p {...fadeUp(0.35)} className="text-sm text-[var(--text-muted)] leading-relaxed mb-10 max-w-xl">
              BE in Computer Science · 4+ years across AI, cloud, customer support & Web3 ecosystems ·
              Previously at Deloitte, KodeKloud, Datamark
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.45)} className="flex flex-wrap items-center gap-3 mb-12">
              <a
                href="#experience"
                onClick={(e) => { e.preventDefault(); document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                View my work <ArrowRight size={14} />
              </a>
              <a
                href="mailto:sharikhussain99@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] text-[var(--text)] text-sm font-medium rounded-lg hover:bg-[var(--card-hover)] hover:border-[var(--text-muted)] transition-all duration-200"
              >
                <Mail size={14} /> Say hello
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div {...fadeUp(0.55)} className="flex items-center gap-5">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold">Connect</span>
              <div className="w-px h-4 bg-[var(--border)]" />
              <div className="flex items-center gap-4">
                {[
                  { href: 'https://linkedin.com/in/sharikhussain1', Icon: Linkedin, label: 'LinkedIn' },
                  { href: 'https://twitter.com/isharik99', Icon: Twitter, label: 'X / Twitter' },
                  { href: 'mailto:sharikhussain99@gmail.com', Icon: Mail, label: 'Email' },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[var(--text-muted)] hover:text-primary transition-colors duration-200 hover:-translate-y-0.5 inline-block"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex flex-col items-center gap-6"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 blur-xl scale-110" />
              {/* Photo container */}
              <div className="relative w-72 h-80 rounded-2xl overflow-hidden border-2 border-[var(--border)] bg-[var(--bg-secondary)] shadow-2xl shadow-black/10">
                {/* Replace /profile.jpg with your actual photo in the public/ folder */}
                <Image
                  src="/profile.jpg"
                  alt="Sharik Fataing"
                  fill
                  className="object-cover object-top"
                  priority
                  onError={(e) => {
                    // Fallback to initials if photo not found
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                {/* Fallback initials (shown if no photo) */}
                
              </div>
            </div>

            {/* Mini info card below photo */}
            <div className="w-72 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] backdrop-blur-sm">
              <div className="font-semibold text-[var(--text)] text-sm mb-0.5">Sharik Fataing</div>
              <div className="text-xs text-[var(--text-muted)] mb-3">LLM Evaluator · Pharos Storyteller</div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-[var(--text-muted)]">Available for new roles</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-20 pt-8 border-t border-[var(--border)] grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '4+', label: 'Years in tech & AI' },
            { value: '3+', label: 'Years in Web3 ecosystems' },
            { value: '4', label: 'Company roles' },
            { value: '4', label: 'Languages spoken' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.08 }}
            >
              <div className="text-3xl font-bold text-[var(--text)] mb-1">{stat.value}</div>
              <div className="text-sm text-[var(--text-muted)] leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
