// Tiny, locally generated cues. Keeping the clips in memory avoids a request or
// audio graph setup on the press path.
const SAMPLE_RATE = 24000

function makeClip(from, to, length, level) {
  const count = Math.round(SAMPLE_RATE * length)
  const bytes = new Uint8Array(44 + count * 2)
  const view = new DataView(bytes.buffer)
  const word = (offset, value) => view.setUint16(offset, value, true)
  const dword = (offset, value) => view.setUint32(offset, value, true)
  for (const [offset, value] of [[0, 'RIFF'], [8, 'WAVE'], [12, 'fmt '], [36, 'data']]) {
    for (let i = 0; i < 4; i++) bytes[offset + i] = value.charCodeAt(i)
  }
  dword(4, bytes.length - 8)
  dword(16, 16)
  word(20, 1)
  word(22, 1)
  dword(24, SAMPLE_RATE)
  dword(28, SAMPLE_RATE * 2)
  word(32, 2)
  word(34, 16)
  dword(40, count * 2)

  let phase = 0
  for (let i = 0; i < count; i++) {
    const progress = i / count
    phase += (Math.PI * 2 * (from + (to - from) * progress)) / SAMPLE_RATE
    const attack = Math.min(1, i / (SAMPLE_RATE * .003))
    const envelope = attack * Math.pow(1 - progress, 2.6)
    const sample = Math.sin(phase) * .83 + Math.sin(phase * 2) * .17
    view.setInt16(44 + i * 2, Math.round(sample * envelope * level * 32767), true)
  }
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const audio = new Audio(`data:audio/wav;base64,${btoa(binary)}`)
  audio.preload = 'auto'
  audio.load()
  return audio
}

const clips = typeof window === 'undefined' ? null : {
  press: makeClip(690, 480, .075, .34),
  navigation: makeClip(510, 650, .09, .29),
  toggle: makeClip(530, 390, .12, .32),
  skylineUp: makeClip(390, 560, .18, .38),
  skylineDown: makeClip(560, 390, .18, .38),
}

export function playUiSound(kind = 'press', volume = 1) {
  const audio = clips?.[kind]
  if (!audio) return
  try {
    audio.pause()
    audio.currentTime = 0
    audio.volume = Math.max(0, Math.min(1, volume))
    void audio.play().catch(() => {})
  } catch {
    // Audio can be blocked by browser or device settings; the action still runs.
  }
}
