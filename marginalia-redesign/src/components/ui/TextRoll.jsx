import { motion } from 'motion/react'

export function TextRoll({ children, className = '', duration = 0.56 }) {
  const letters = children.split('')
  return (
    <span className={className} aria-label={children}>
      {letters.map((letter, index) => (
        <span className="text-roll-letter" aria-hidden="true" key={`${letter}-${index}`}>
          <motion.span
            className="text-roll-face text-roll-front"
            initial={{ rotateX: 0, opacity: 1 }}
            animate={{ rotateX: 90, opacity: .15 }}
            transition={{ duration, delay: index * .055, ease: [.22, .75, .24, 1] }}
          >{letter === ' ' ? '\u00a0' : letter}</motion.span>
          <motion.span
            className="text-roll-face text-roll-back"
            initial={{ rotateX: 90, opacity: .15 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration, delay: index * .055 + .12, ease: [.22, .75, .24, 1] }}
          >{letter === ' ' ? '\u00a0' : letter}</motion.span>
          <span className="text-roll-space">{letter === ' ' ? '\u00a0' : letter}</span>
        </span>
      ))}
    </span>
  )
}
