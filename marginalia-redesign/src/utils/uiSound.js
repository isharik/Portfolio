// Preload the short, versioned UI cues so button actions never wait on audio.
const files = {
  press: '/sounds/ui-press.wav',
  navigation: '/sounds/ui-navigation.wav',
  toggle: '/sounds/ui-toggle.wav',
  skylineUp: '/sounds/ui-skyline-up.wav',
  skylineDown: '/sounds/ui-skyline-down.wav',
}

const clips = typeof window === 'undefined' ? null : Object.fromEntries(
  Object.entries(files).map(([kind, src]) => {
    const audio = new Audio(src)
    audio.preload = 'auto'
    audio.load()
    return [kind, audio]
  }),
)

export function playUiSound(kind = 'press', volume = 1) {
  const audio = clips?.[kind]
  if (!audio) return
  try {
    audio.pause()
    audio.currentTime = 0
    audio.volume = Math.max(0, Math.min(1, volume))
    void audio.play().catch(() => {})
  } catch {
    // A blocked or muted device should never hold up the button action.
  }
}
