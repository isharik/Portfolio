import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const sampleRate = 24000
const outputDir = join(process.cwd(), 'public', 'sounds')

const presets = {
  // Low-volume, tactile glass taps: deliberately short and harmonic rather
  // than game-like bleeps. Each context has a related but distinct timbre.
  click: { duration: 0.045, noise: 0.004, layers: [{ start: 360, end: 325, amp: 0.033, decay: 0.018 }, { start: 1060, end: 880, amp: 0.006, decay: 0.012, delay: 0.002 }] },
  navigation: { duration: 0.052, noise: 0.003, layers: [{ start: 410, end: 365, amp: 0.029, decay: 0.022 }, { start: 1210, end: 940, amp: 0.005, decay: 0.014, delay: 0.003 }] },
  hero: { duration: 0.055, noise: 0.003, layers: [{ start: 440, end: 395, amp: 0.027, decay: 0.024 }, { start: 1320, end: 1080, amp: 0.004, decay: 0.014, delay: 0.004 }] },
  about: { duration: 0.056, noise: 0.003, layers: [{ start: 392, end: 350, amp: 0.028, decay: 0.024 }, { start: 1170, end: 920, amp: 0.004, decay: 0.014, delay: 0.004 }] },
  experience: { duration: 0.06, noise: 0.002, layers: [{ start: 330, end: 305, amp: 0.03, decay: 0.027 }, { start: 990, end: 790, amp: 0.004, decay: 0.017, delay: 0.005 }] },
  projects: { duration: 0.063, noise: 0.002, layers: [{ start: 470, end: 415, amp: 0.027, decay: 0.027 }, { start: 1410, end: 1120, amp: 0.006, decay: 0.018, delay: 0.005 }] },
  skills: { duration: 0.06, noise: 0.002, layers: [{ start: 510, end: 455, amp: 0.026, decay: 0.026 }, { start: 1530, end: 1220, amp: 0.004, decay: 0.017, delay: 0.004 }] },
  contact: { duration: 0.07, noise: 0.002, layers: [{ start: 370, end: 430, amp: 0.026, decay: 0.034 }, { start: 1100, end: 1330, amp: 0.004, decay: 0.02, delay: 0.006 }] },
  player: { duration: 0.052, noise: 0.004, layers: [{ start: 475, end: 405, amp: 0.026, decay: 0.021 }, { start: 1440, end: 1050, amp: 0.005, decay: 0.012, delay: 0.003 }] },
  toggle: { duration: 0.07, noise: 0.002, layers: [{ start: 355, end: 455, amp: 0.026, decay: 0.032 }, { start: 1030, end: 1370, amp: 0.004, decay: 0.019, delay: 0.006 }] },
  welcome: { duration: 0.82, noise: 0, layers: [
    { start: 523.25, end: 523.25, amp: 0.055, decay: 0.34, delay: 0 },
    { start: 659.25, end: 659.25, amp: 0.045, decay: 0.39, delay: 0.12 },
    { start: 783.99, end: 783.99, amp: 0.034, decay: 0.43, delay: 0.25 },
  ] },
}

function wavBuffer(preset, seed) {
  const frameCount = Math.ceil(sampleRate * preset.duration)
  const data = Buffer.alloc(frameCount * 2)
  let randomState = seed >>> 0
  const random = () => {
    randomState = (randomState * 1664525 + 1013904223) >>> 0
    return (randomState / 0xffffffff) * 2 - 1
  }

  for (let i = 0; i < frameCount; i += 1) {
    const time = i / sampleRate
    let sample = 0
    for (const layer of preset.layers) {
      const elapsed = time - (layer.delay ?? 0)
      if (elapsed < 0) continue
      const progress = Math.min(1, elapsed / Math.max(0.02, preset.duration - (layer.delay ?? 0)))
      const frequency = layer.start + (layer.end - layer.start) * progress
      const attack = Math.min(1, elapsed / 0.003)
      const envelope = attack * Math.exp(-elapsed / layer.decay)
      sample += Math.sin(2 * Math.PI * frequency * elapsed) * envelope * layer.amp
    }
    if (preset.noise) sample += random() * preset.noise * Math.exp(-time / 0.008) * Math.min(1, time / 0.0005)
    const value = Math.max(-1, Math.min(1, sample))
    data.writeInt16LE(Math.round(value * 32767), i * 2)
  }

  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + data.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(1, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(sampleRate * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(data.length, 40)
  return Buffer.concat([header, data])
}

mkdirSync(outputDir, { recursive: true })
for (const [name, preset] of Object.entries(presets)) {
  writeFileSync(join(outputDir, `${name}.wav`), wavBuffer(preset, name.length * 941))
}
