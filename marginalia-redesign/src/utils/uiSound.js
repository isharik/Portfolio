// Keep the first press immediate, even if the checked-in WAV files have not decoded yet.
const cues = {
  press: { file: 'ui-press.wav', from: 620, to: 490, duration: .065, level: .20 },
  navigation: { file: 'ui-navigation.wav', from: 520, to: 625, duration: .08, level: .17 },
  toggle: { file: 'ui-toggle.wav', from: 480, to: 380, duration: .1, level: .19 },
  skylineUp: { file: 'ui-skyline-up.wav', from: 365, to: 510, duration: .17, level: .27 },
  skylineDown: { file: 'ui-skyline-down.wav', from: 510, to: 365, duration: .17, level: .27 },
}

const AudioContextClass = typeof window === 'undefined'
  ? null
  : window.AudioContext || window.webkitAudioContext

let context
let buffers

if (AudioContextClass) {
  try {
    context = new AudioContextClass({ latencyHint: 'interactive' })
    buffers = {}

    for (const [kind, cue] of Object.entries(cues)) {
      const sampleRate = context.sampleRate
      const samples = Math.ceil(sampleRate * cue.duration)
      const buffer = context.createBuffer(1, samples, sampleRate)
      const channel = buffer.getChannelData(0)
      let phase = 0
      for (let i = 0; i < samples; i++) {
        const progress = i / samples
        phase += Math.PI * 2 * (cue.from + (cue.to - cue.from) * progress) / sampleRate
        channel[i] = Math.sin(phase) * Math.min(1, i / (sampleRate * .004)) * (1 - progress) ** 3 * cue.level
      }
      buffers[kind] = buffer

      // Replace the fallback with the versioned asset once it is decoded.
      fetch(`/sounds/${cue.file}`)
        .then(response => response.ok ? response.arrayBuffer() : Promise.reject(new Error('Sound unavailable')))
        .then(data => context.decodeAudioData(data))
        .then(decoded => { buffers[kind] = decoded })
        .catch(() => {})
    }

    const unlock = () => {
      if (context.state === 'suspended') void context.resume().catch(() => {})
    }
    window.addEventListener('pointerdown', unlock, { capture: true, once: true, passive: true })
    window.addEventListener('keydown', unlock, { capture: true, once: true })
  } catch {
    context = null
    buffers = null
  }
}

export function playUiSound(kind = 'press', volume = 1) {
  const buffer = buffers?.[kind]
  if (!context || !buffer) return
  try {
    if (context.state === 'suspended') void context.resume().catch(() => {})
    const source = context.createBufferSource()
    const gain = context.createGain()
    source.buffer = buffer
    gain.gain.value = Math.max(0, Math.min(1, volume))
    source.connect(gain).connect(context.destination)
    source.start()
    source.onended = () => { source.disconnect(); gain.disconnect() }
  } catch {
    // Audio restrictions must never delay the button action.
  }
}
