'use client'
import { Reveal } from './Reveal'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: React.ReactNode
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-display-sm font-display font-semibold text-fg">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-fg-muted">{description}</p>}
    </Reveal>
  )
}
