'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = { alt: string }

const greetings = ['Hi there 👋', 'Hello — nice to meet you ✨', 'Let’s get to know each other ☕', 'Let’s connect 🤝']

export default function InteractivePortrait({ alt }: Props) {
  const [greetingIndex, setGreetingIndex] = useState<number | null>(null)

  return (
    <div className="portrait-stage">
      <button
        type="button"
        className="portrait-tilt relative block h-64 w-64 cursor-pointer border-0 bg-transparent p-0 sm:h-72 sm:w-72"
        aria-label="Click avatar to say hello"
        onClick={() => setGreetingIndex((current) => (current === null ? 0 : (current + 1) % greetings.length))}
      >
        <Image
          src="/anime-avatar.png"
          alt={alt}
          fill
          priority
          sizes="(max-width: 640px) 256px, 288px"
          className="portrait-image"
        />
        <span className="portrait-invite" aria-hidden="true">Say hello <span>↖</span></span>
        {greetingIndex !== null && <span className="portrait-greeting" role="status" aria-live="polite">{greetings[greetingIndex]}</span>}
      </button>
    </div>
  )
}
