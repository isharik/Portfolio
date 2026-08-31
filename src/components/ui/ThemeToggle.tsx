'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/60 text-fg-muted transition-[transform,color,border-color] duration-200 ease-out hover:border-border-strong hover:text-fg active:scale-95"
    >
      <Sun
        size={16}
        className="absolute transition-all duration-300 ease-out"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(-90deg) scale(0.5)' : 'rotate(0) scale(1)',
        }}
      />
      <Moon
        size={16}
        className="absolute transition-all duration-300 ease-out"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0.5)',
        }}
      />
    </button>
  )
}
