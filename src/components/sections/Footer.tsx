export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-[var(--text)] mb-0.5">Sharik Fataing</div>
          <div className="text-xs text-[var(--text-muted)]">LLM Evaluator · Pharos Storyteller · India</div>
        </div>
        <div className="flex items-center gap-6">
          {[
            { href: 'https://linkedin.com/in/sharikhussain1', label: 'LinkedIn' },
            { href: 'https://twitter.com/isharik99', label: 'X / Twitter' },
            { href: 'mailto:sharikhussain99@gmail.com', label: 'Email' },
          ].map(({ href, label }) => (
            <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200">
              {label}
            </a>
          ))}
        </div>
        <div className="text-xs text-[var(--text-muted)]">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  )
}
