'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = { src: string; alt: string }

const greetings = ['Hi there 👋', 'Hello — nice to meet you ✨', 'Let’s get to know each other ☕', 'Let’s connect 🤝']

export default function InteractivePortrait({ src, alt }: Props) {
  const [greetingIndex, setGreetingIndex] = useState<number | null>(null)

  return (
    <div className="portrait-stage">
      <button
        type="button"
        className="portrait-tilt relative block h-72 w-64 cursor-pointer border-0 bg-transparent p-0 sm:h-80 sm:w-72"
        aria-label="Click profile portrait to say hello"
        onClick={() => setGreetingIndex((current) => (current === null ? 0 : (current + 1) % greetings.length))}
      >
        <span className="portrait-surface absolute inset-0 block">
          <Image src="/profile-clean.png" alt="" fill sizes="(max-width: 640px) 256px, 288px" className="object-contain portrait-light-backing" aria-hidden="true" />
          <Image src="/profile-clean.png" alt={alt} fill priority sizes="(max-width: 640px) 256px, 288px" className="object-contain portrait-light-image" />
          <Image src={src} alt="" fill priority sizes="(max-width: 640px) 256px, 288px" className="object-contain portrait-dark-image" aria-hidden="true" />
        </span>
        <span className="portrait-invite" aria-hidden>Say hello <span>↖</span></span>
        {greetingIndex !== null && <span className="portrait-greeting" role="status" aria-live="polite">{greetings[greetingIndex]}</span>}
      </button>
    </div>
  )
}
