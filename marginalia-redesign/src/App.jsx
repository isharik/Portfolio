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
    // Experience owns its full-height scroll stage. Applying the generic
    // section fade to that sticky container can hide it before its map ends.
    const nodes = [...document.querySelectorAll('.reveal, .sheet, .folio-footer')]
      .filter(node => node.id !== 'experience')
    nodes.forEach(node => node.classList.add('scroll-reveal'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      })
    }, { threshold: 0.08, rootMargin: '-4% 0px -4%' })
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
