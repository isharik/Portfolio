import { useEffect, useRef, useState } from 'react'

const greetings = ['Hello', 'नमस्ते', 'سلام', 'Bonjour', 'Hola', 'Ciao']

export default function Preloader({ onComplete }) {
  const [index, setIndex] = useState(0)
  const welcomeRef = useRef(null)

  useEffect(() => {
    welcomeRef.current = new Audio('/sounds/welcome.mp3')
    welcomeRef.current.preload = 'auto'
    welcomeRef.current.load()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (index < greetings.length - 1) {
        setIndex(value => value + 1)
        return
      }
      const audio = welcomeRef.current
      if (audio) {
        audio.volume = .28
        audio.currentTime = 0
        audio.play().catch(() => {
          const resume = () => { audio.play().catch(() => {}); window.removeEventListener('pointerdown', resume) }
          window.addEventListener('pointerdown', resume, { once: true })
        })
      }
      onComplete()
    }, 430)
    return () => window.clearTimeout(timer)
  }, [index, onComplete])

  return (
    <div className="welcome-screen" aria-label="Loading portfolio">
      <div className="welcome-index"><span>Portfolio 2026</span><span>Sharik Hussain</span></div>
      <div className="welcome-word" key={greetings[index]}>{greetings[index]}</div>
      <div className="welcome-line"><i style={{ width: `${((index + 1) / greetings.length) * 100}%` }} /></div>
    </div>
  )
}
