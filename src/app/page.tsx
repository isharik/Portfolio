import Preloader from '@/components/ui/Preloader'
import Background from '@/components/three/Background'
import ScrollFade from '@/components/ui/ScrollFade'
import ScrollProgress from '@/components/ui/ScrollProgress'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Preloader />
      <Background />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <ScrollFade>
          <About />
        </ScrollFade>
        <ScrollFade>
          <Experience />
        </ScrollFade>
        <ScrollFade>
          <Projects />
        </ScrollFade>
        <ScrollFade>
          <Skills />
        </ScrollFade>
        <ScrollFade>
          <Contact />
        </ScrollFade>
      </main>
      <Footer />
    </>
  )
}
