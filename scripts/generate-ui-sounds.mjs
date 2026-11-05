import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const sampleRate = 24000
const outputDir = join(process.cwd(), 'public', 'sounds')

const presets = {
  click: { duration: 0.075, noise: 0.12, layers: [{ start: 1500, end: 1030, amp: 0.12, decay: 0.026 }] },
  navigation: { duration: 0.12, noise: 0.035, layers: [{ start: 1320, end: 1110, amp: 0.105, decay: 0.055 }] },
  hero: { duration: 0.14, noise: 0.025, layers: [{ start: 920, end: 720, amp: 0.09, decay: 0.065 }, { start: 1480, end: 1250, amp: 0.032, decay: 0.045, delay: 0.012 }] },
  about: { duration: 0.12, noise: 0.045, layers: [{ start: 1120, end: 900, amp: 0.085, decay: 0.052 }] },
  experience: { duration: 0.13, noise: 0.04, layers: [{ start: 760, end: 590, amp: 0.09, decay: 0.06 }, { start: 1540, end: 1260, amp: 0.027, decay: 0.035, delay: 0.008 }] },
  projects: { duration: 0.15, noise: 0.03, layers: [{ start: 1240, end: 1480, amp: 0.075, decay: 0.075 }, { start: 1860, end: 1580, amp: 0.025, decay: 0.045, delay: 0.015 }] },
  skills: { duration: 0.14, noise: 0.025, layers: [{ start: 1680, end: 1120, amp: 0.065, decay: 0.07 }, { start: 2240, end: 1800, amp: 0.024, decay: 0.05, delay: 0.01 }] },
  contact: { duration: 0.19, noise: 0.018, layers: [{ start: 880, end: 1040, amp: 0.075, decay: 0.11 }, { start: 1320, end: 1560, amp: 0.04, decay: 0.1, delay: 0.035 }] },
  player: { duration: 0.09, noise: 0.1, layers: [{ start: 1880, end: 1420, amp: 0.075, decay: 0.035 }] },
  toggle: { duration: 0.17, noise: 0.015, layers: [{ start: 690, end: 920, amp: 0.07, decay: 0.09 }, { start: 1380, end: 1720, amp: 0.03, decay: 0.075, delay: 0.025 }] },
  welcome: { duration: 0.72, noise: 0, layers: [
    { start: 784, end: 784, amp: 0.085, decay: 0.24, delay: 0 },
    { start: 988, end: 988, amp: 0.075, decay: 0.31, delay: 0.11 },
    { start: 1175, end: 1175, amp: 0.052, decay: 0.36, delay: 0.24 },
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
