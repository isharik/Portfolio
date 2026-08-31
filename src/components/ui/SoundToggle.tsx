'use client'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from './SoundProvider'

export default function SoundToggle() {
  const { enabled, toggle } = useSound()
  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'Mute click sounds' : 'Enable click sounds'}
      aria-pressed={enabled}
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60 text-fg-muted transition-[transform,color,border-color] duration-200 ease-out hover:border-border-strong hover:text-fg active:scale-95"
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  )
}
