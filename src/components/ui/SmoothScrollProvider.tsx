'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/** Single smooth-scroll clock shared by Lenis and GSAP ScrollTrigger. */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
    })
    const updateScrollTrigger = () => ScrollTrigger.update()
    const ticker = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(ticker)

    const parallaxContext = gsap.context(() => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(#home), footer'))
      sections.forEach((section) => {
        const content = section.querySelector<HTMLElement>(':scope > .mx-auto')
        if (!content) return
        gsap.fromTo(content,
          { y: -14 },
          {
            y: 18,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    })
    ScrollTrigger.refresh()

    const onScrollTo = (event: Event) => {
      const scrollEvent = event as CustomEvent<HTMLElement>
      const target = scrollEvent.detail
      if (!target?.isConnected) return
      scrollEvent.preventDefault()
      lenis.scrollTo(target, { offset: -88, lerp: 0.12 })
    }
    window.addEventListener('portfolio:scroll-to', onScrollTo)

    return () => {
      window.removeEventListener('portfolio:scroll-to', onScrollTo)
      gsap.ticker.remove(ticker)
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
      parallaxContext.revert()
    }
  }, [])

  return children
}
