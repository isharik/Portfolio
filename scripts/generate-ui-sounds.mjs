import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const sampleRate = 24000
const outputDir = join(process.cwd(), 'public', 'sounds')

const presets = {
  click: { duration: 0.055, noise: 0.025, layers: [{ start: 620, end: 460, amp: 0.055, decay: 0.02 }] },
  navigation: { duration: 0.065, noise: 0.018, layers: [{ start: 690, end: 520, amp: 0.05, decay: 0.026 }] },
  hero: { duration: 0.07, noise: 0.016, layers: [{ start: 650, end: 490, amp: 0.046, decay: 0.03 }] },
  about: { duration: 0.07, noise: 0.018, layers: [{ start: 590, end: 450, amp: 0.048, decay: 0.029 }] },
  experience: { duration: 0.075, noise: 0.016, layers: [{ start: 540, end: 410, amp: 0.052, decay: 0.032 }] },
  projects: { duration: 0.078, noise: 0.014, layers: [{ start: 610, end: 505, amp: 0.047, decay: 0.034 }, { start: 910, end: 760, amp: 0.012, decay: 0.028, delay: 0.006 }] },
  skills: { duration: 0.072, noise: 0.014, layers: [{ start: 720, end: 560, amp: 0.043, decay: 0.031 }] },
  contact: { duration: 0.09, noise: 0.012, layers: [{ start: 560, end: 660, amp: 0.042, decay: 0.045 }] },
  player: { duration: 0.06, noise: 0.022, layers: [{ start: 760, end: 540, amp: 0.045, decay: 0.023 }] },
  toggle: { duration: 0.085, noise: 0.012, layers: [{ start: 480, end: 650, amp: 0.045, decay: 0.04 }] },
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
