'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'
type ThemeCtx = { theme: Theme; toggleTheme: () => void }

const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  // Sync with the class the inline head script already applied (avoids flash)
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      const root = document.documentElement
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const apply = () => {
        root.classList.toggle('dark', next === 'dark')
        try {
          localStorage.setItem('theme', next)
        } catch {}
      }

      // View Transitions give a single GPU-composited crossfade of the whole
      // page instead of animating color on every element (which janks).
      const startVT = (document as unknown as {
        startViewTransition?: (cb: () => void) => void
      }).startViewTransition

      if (!reduce && typeof startVT === 'function') {
        startVT.call(document, apply)
      } else {
        apply()
      }
      return next
    })
  }, [])

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
