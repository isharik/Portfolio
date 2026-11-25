import { useCallback, useEffect, useState } from 'react'
import { SiteChrome } from './components/Chrome'
import { About, Cover, Education, Experience, Facts, Footer, Projects, Skills, ThankYou } from './components/Sections'
import Preloader from './components/Preloader'
import CreativeWork from './components/CreativeWork'

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
    const nodes = [...document.querySelectorAll('.reveal, .sheet')]
      .filter(node => node.id !== 'experience')
    nodes.forEach(node => node.classList.add('scroll-reveal'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'))
      return
    }
    // A reveal is a one-way state. Toggling it back off around an
    // intersection threshold made completed sections replay their vertical
    // transition while the reader continued down the page, causing flicker.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '-4% 0px -4%' })
    nodes.forEach(node => observer.observe(node))
    const cover = document.getElementById('home')
    const ambientObserver = new IntersectionObserver(([entry]) => {
      cover.classList.toggle('is-offscreen', !entry.isIntersecting)
    })
    if (cover) ambientObserver.observe(cover)
    return () => {
      observer.disconnect()
      ambientObserver.disconnect()
    }
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
        <CreativeWork />
        <Facts />
        <ThankYou />
      </main>
      <Footer theme={theme} />
    </div>
  )
}
