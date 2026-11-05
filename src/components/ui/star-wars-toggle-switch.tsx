'use client'

import { useTheme } from './ThemeProvider'

/** Compact BB-8 day/night toggle adapted from the supplied reference. */
export default function StarWarsToggleSwitch() {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  return (
    <label className="bb8-theme-toggle" aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} title={`Switch to ${dark ? 'light' : 'dark'} mode`}>
      <input
        className="bb8-theme-checkbox"
        type="checkbox"
        checked={dark}
        onChange={toggleTheme}
        data-sound="toggle"
      />
      <span className="bb8-theme-track" aria-hidden="true">
        <span className="bb8-theme-stars" />
        <span className="bb8-theme-cloud bb8-theme-cloud-one" />
        <span className="bb8-theme-cloud bb8-theme-cloud-two" />
        <span className="bb8-theme-ground" />
        <span className="bb8-theme-droid">
          <span className="bb8-theme-head"><i /></span>
          <span className="bb8-theme-body"><i /></span>
        </span>
      </span>
    </label>
  )
}
