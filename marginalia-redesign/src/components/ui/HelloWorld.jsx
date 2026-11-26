import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import VoiceNote from './VoiceNote'
import { playUiSound } from '../../utils/uiSound'
import './hello-world.css'

const facets = [
  {
    number: '01', name: 'AI & quality', mark: '✳',
    detail: 'I evaluate reasoning, edge cases, and real-world usefulness—then turn observations into precise feedback.',
  },
  {
    number: '02', name: 'People first', mark: '◡',
    detail: 'I listen closely, resolve what matters, and make complicated situations easier for people to navigate.',
  },
  {
    number: '03', name: 'Storytelling', mark: '✦',
    detail: 'I translate technical ideas into clear stories that communities can understand, remember, and use.',
  },
]

const reveal = { duration: .32, ease: [.23, 1, .32, 1] }

export default function HelloWorld({ profile }) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(false)
  const [pinned, setPinned] = useState(false)
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      const section = sectionRef.current
      if (!section) return
      const top = section.getBoundingClientRect().top + window.scrollY - 52
      window.scrollTo({ top, behavior: reduceMotion ? 'instant' : 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [open, reduceMotion])

  useEffect(() => {
    if (!open && !preview) return
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        setPreview(false)
        setPinned(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, preview])

  const showMore = () => {
    playUiSound('press', .55)
    setPreview(false)
    setPinned(false)
    setOpen(true)
  }

  return <section ref={sectionRef} id="about" data-label="Hello" className={`sheet paper-sheet hello-world${open ? ' is-open' : ''}${preview ? ' is-preview' : ''}`}>
    <AnimatePresence mode="sync" initial={false}>
      {!open ? <motion.div key="welcome" className="hello-welcome"
        initial={reduceMotion ? false : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
        transition={reduceMotion ? { duration: .1 } : reveal}>
        <span className="hello-world-index">A SHORT INTRODUCTION / SHARIK HUSSAIN</span>
        <h2>Hello<span>.</span></h2>
        <p className="hello-world-scribble">Welcome to my corner of the internet ↘</p>
        <button type="button" className="hello-portrait-scene" aria-label="Meet Sharik"
          onPointerEnter={event => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') setPreview(true) }}
          onClick={() => { setPreview(true); setPinned(true) }}>
          <span className="hello-portrait-disc"><img src="/profile-cutout.png" alt="Sharik Hussain" /></span>
          <span className="hello-portrait-label">Meet Sharik</span>
        </button>
        <p className="hello-welcome-summary">{profile.summary}</p>
      </motion.div> : <motion.div key="details" className="hello-about-detail"
        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
        transition={reduceMotion ? { duration: .1 } : reveal}>
        <button type="button" className="hello-close-button" onClick={() => setOpen(false)} aria-label="Close about Sharik">×</button>
        <div className="hello-about-head">
          <img src="/profile-cutout.png" alt="Sharik Hussain" className="hello-about-portrait" />
          <span className="hello-about-kicker">HELLO / I’M SHARIK HUSSAIN</span>
          <h2>I make complex things<br /><em>clearer for people.</em></h2>
          <p>{profile.intro}</p>
          <VoiceNote />
        </div>
        <div className="hello-facets" aria-label="More about Sharik">
          {facets.map((facet, index) => <motion.article key={facet.number} className={`hello-facet hello-facet-${index + 1}`}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...reveal, delay: reduceMotion ? 0 : .09 + index * .07 }}>
            <span className="hello-facet-number">{facet.number} / 03</span>
            <span className="hello-facet-mark" aria-hidden="true">{facet.mark}</span>
            <h3>{facet.name}</h3>
            <p>{facet.detail}</p>
          </motion.article>)}
        </div>
      </motion.div>}
    </AnimatePresence>
    <AnimatePresence>
      {!open && preview && <motion.div className="hello-preview-backdrop"
        initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? .1 : .2 }}
        onPointerMove={event => { if (!pinned && event.target === event.currentTarget && (event.pointerType === 'mouse' || event.pointerType === 'pen')) setPreview(false) }}
        onPointerLeave={event => { if (!pinned && (event.pointerType === 'mouse' || event.pointerType === 'pen')) setPreview(false) }}
        onClick={() => { setPreview(false); setPinned(false) }}>
        <motion.div className="hello-preview-card"
          initial={reduceMotion ? false : { opacity: 0, y: 22, scale: .93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .97 }}
          transition={reduceMotion ? { duration: .1 } : reveal}
          onClick={event => { event.stopPropagation(); setPinned(true) }}>
          <button type="button" className="hello-preview-close" aria-label="Close Sharik preview"
            onClick={event => { event.stopPropagation(); setPreview(false); setPinned(false) }}>×</button>
          <div className="hello-preview-art">
            <span className="hello-sticker hello-sticker-top-left">AI &amp; quality <b>✳</b></span>
            <span className="hello-sticker hello-sticker-top-right">people first <b>◡</b></span>
            <span className="hello-sticker hello-sticker-bottom-left">clear thinker <b>✦</b></span>
            <span className="hello-sticker hello-sticker-bottom-right">curious by default <b>✳</b></span>
            <img src="/profile-cutout.png" alt="" />
          </div>
          <h3>Hello, I’m Sharik.</h3>
          <p>I work where people, systems, and AI meet.</p>
          <button type="button" className="hello-read-button" onClick={event => { event.stopPropagation(); showMore() }}>Read about me <span aria-hidden="true">↗</span></button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>
}
