import { useCallback, useEffect, useState } from 'react'
import { SiteChrome } from './components/Chrome'
import { About, Contact, Cover, Education, Experience, Facts, Footer, Projects, Skills } from './components/Sections'
import Preloader from './components/Preloader'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('marginalia-theme') || 'light')
  const [ready, setReady] = useState(false)
  const finishLoading = useCallback(() => setReady(true), [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('marginalia-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!ready) return
    const nodes = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.13, rootMargin: '0px 0px -8%' })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const click = new Audio('/sounds/click.wav')
    const navigation = new Audio('/sounds/navigation.wav')
    click.preload = 'auto'
    navigation.preload = 'auto'
    const play = event => {
      const target = event.target.closest('button,a,[role="button"]')
      if (!target) return
      const source = target.closest('.folio-index') || target.matches('a') ? navigation : click
      const sound = source.cloneNode()
      sound.volume = .11
      sound.play().catch(() => {})
    }
    document.addEventListener('pointerdown', play, true)
    return () => document.removeEventListener('pointerdown', play, true)
  }, [ready])

  if (!ready) return <Preloader onComplete={finishLoading} />

  return (
    <div className="portfolio">
      <SiteChrome theme={theme} onTheme={() => setTheme(value => value === 'light' ? 'dark' : 'light')} />
      <main>
        <Cover />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Projects />
        <Facts />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
