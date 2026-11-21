import { motion, useAnimate, useReducedMotion } from 'motion/react'

// Each letter uses its own keyframes from the Dancing Letters reference.
const effects = [
  [{ scaleX: [1, 1.25, .75, 1.15, .95, 1.05, 1], scaleY: [1, .75, 1.25, .85, 1.05, .95, 1] }, { duration: .8, ease: 'easeInOut' }],
  [{ rotate: [0, 80, 60, 80, 60, 0], y: [0, 10, -5, 5, -2, 0] }, { duration: 1.2, ease: [.175, .885, .32, 1.275] }, 'bottom left'],
  [{ scaleY: [1, .6, 1.2, 1], y: [0, 20, -40, 0] }, { duration: .6, ease: 'easeOut' }, 'bottom center'],
  [{ rotateX: [0, 240, 150, 200, 175, 180, 180, 0], scale: [1, 1.1, 1] }, { duration: 2, ease: 'easeOut', rotateX: { times: [0, .12, .24, .36, .48, .6, .85, 1] } }, '50% 80%'],
  [{ x: [0, -20, 15, -10, 5, 0] }, { duration: .8, ease: 'easeInOut' }],
  [{ x: [0, -5, 5, -5, 5, -2, 2, 0], y: [0, -2, 2, -1, 1, 0], rotate: [0, -1, 1, -.5, .5, 0] }, { duration: .5, ease: 'linear' }],
  [{ scale: [1, 1.4, 1] }, { duration: .5, ease: 'easeInOut' }],
  [{ y: [0, -30, 0], scale: [1, 1.1, 1], textShadow: ['0px 0px 0px rgba(0,0,0,0)', '0px 20px 20px rgba(0,0,0,.2)', '0px 0px 0px rgba(0,0,0,0)'] }, { duration: 1.2, ease: 'easeInOut' }],
]

function DancingLetter({ letter, index }) {
  const [scope, animate] = useAnimate()
  const reducedMotion = useReducedMotion()
  const [keyframes, transition, transformOrigin] = effects[index % effects.length]

  return (
    <motion.span
      className="dancing-letter"
      aria-hidden="true"
      onHoverStart={() => {
        if (!reducedMotion && scope.current) animate(scope.current, keyframes, transition)
      }}
    >
      <span ref={scope} style={{ transformOrigin }}>{letter}</span>
    </motion.span>
  )
}

export function TextRoll({ children }) {
  return (
    <span className="dancing-title" aria-label={children}>
      {Array.from(children, (letter, index) => (
        <DancingLetter key={index} letter={letter} index={index} />
      ))}
    </span>
  )
}
