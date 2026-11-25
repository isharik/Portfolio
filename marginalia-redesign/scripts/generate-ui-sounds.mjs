import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const sampleRate = 24000
const output = fileURLToPath(new URL('../public/sounds/', import.meta.url))
const cues = {
  'ui-press.wav': [620, 490, .065, .20],
  'ui-navigation.wav': [520, 625, .08, .17],
  'ui-toggle.wav': [480, 380, .1, .19],
  'ui-skyline-up.wav': [365, 510, .17, .27],
  'ui-skyline-down.wav': [510, 365, .17, .27],
}

for (const [name, [from, to, duration, level]] of Object.entries(cues)) {
  const samples = Math.round(sampleRate * duration)
  const wav = Buffer.alloc(44 + samples * 2)
  wav.write('RIFF', 0)
  wav.writeUInt32LE(wav.length - 8, 4)
  wav.write('WAVEfmt ', 8)
  wav.writeUInt32LE(16, 16)
  wav.writeUInt16LE(1, 20)
  wav.writeUInt16LE(1, 22)
  wav.writeUInt32LE(sampleRate, 24)
  wav.writeUInt32LE(sampleRate * 2, 28)
  wav.writeUInt16LE(2, 32)
  wav.writeUInt16LE(16, 34)
  wav.write('data', 36)
  wav.writeUInt32LE(samples * 2, 40)

  let phase = 0
  for (let i = 0; i < samples; i++) {
    const progress = i / samples
    phase += Math.PI * 2 * (from + (to - from) * progress) / sampleRate
    const attack = Math.min(1, i / (sampleRate * .004))
    const envelope = attack * (1 - progress) ** 3
    wav.writeInt16LE(Math.round(Math.sin(phase) * envelope * level * 32767), 44 + i * 2)
  }
  writeFileSync(resolve(output, name), wav)
}
