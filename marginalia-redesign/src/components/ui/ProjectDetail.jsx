import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const projectFlows = {
  Proxima: {
    theme: 'proxima',
    context: 'The marketplace gives someone evaluating autonomous agents a path from discovery to hiring. Profiles put the information needed for a decision alongside the next action.',
    flow: ['Discover agents', 'Review agent profiles', 'Choose a workflow'],
  },
  'Pharos Octobot': {
    theme: 'octobot',
    context: 'The copilot brings Pharos ecosystem context into a conversational interface so visitors can ask questions in their own words and explore the answer in context.',
    flow: ['Ask a question', 'Consult on-chain context', 'Read a guided response'],
  },
  'Onchain Wizard': {
    theme: 'wizard',
    context: 'The workspace brings network and contract information into one view. It separates inspection and preparation from the wallet authorization step.',
    flow: ['Inspect network data', 'Prepare an action', 'Review in wallet'],
  },
  'Pulse OS': {
    theme: 'pulse',
    context: 'Pulse OS brings daily business work into a shared view. Structured workflows give AI-assisted tasks a place alongside the operational context people need to act on them.',
    flow: ['Open the workspace', 'Work through a task', 'Review actionable context'],
  },
  'Prosper Atlas': {
    theme: 'atlas',
    context: 'The atlas uses a navigable 3D map to make relationships across the Prosper ecosystem easier to explore. Visitors can move through the space and follow individual protocol stories.',
    flow: ['Enter the ecosystem map', 'Navigate connected protocols', 'Explore a protocol story'],
  },
}

export default function ProjectDetail({ project, onClose }) {
  const dialog = useRef(null)
  const [visible, setVisible] = useState(true)
  const reducedMotion = useReducedMotion()
  const details = projectFlows[project.title]

  useEffect(() => {
    const panel = dialog.current
    if (!panel.open) panel.showModal()
  }, [])

  return (
    <dialog className="project-detail-dialog" data-project-theme={details.theme} ref={dialog} aria-label={`${project.title} project details`} onClose={onClose} onCancel={event => {
      event.preventDefault()
      setVisible(false)
    }}>
      <AnimatePresence onExitComplete={() => dialog.current?.close()}>
      {visible && (
      <motion.div className="project-detail-frame" key="frame"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 46, scale: .98, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 34, scale: .98, rotateX: 5 }}
        transition={{ duration: reducedMotion ? .12 : .32, ease: [.23, 1, .32, 1] }}
      >
        <header className="project-detail-bar">
          <span>Projects / {project.title}</span>
          <button type="button" onClick={() => setVisible(false)} autoFocus>Close <span aria-hidden="true">×</span></button>
        </header>
        <article className="project-detail-content">
          <div className="project-detail-intro">
            <span className="scribble">{project.note}</span>
            <h2 id="project-detail-title">{project.title}</h2>
            <p>{project.description}</p>
            <p>{details.context}</p>
            <a className="project-detail-link" href={project.url}>Visit live project <span aria-hidden="true">↗</span></a>
          </div>
          <motion.figure className="project-detail-image"
            initial={reducedMotion ? false : { y: 42, scale: .96 }}
            animate={{ y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { y: 34, scale: .96 }}
            transition={{ duration: reducedMotion ? 0 : .36, ease: [.23, 1, .32, 1] }}
          >
            <img src={project.image} alt={`${project.title} interface`} />
            <figcaption>Project preview</figcaption>
          </motion.figure>
          <section className="project-detail-flow">
            <h3>User flow</h3>
            <ol>{details.flow.map(step => <li key={step}>{step}</li>)}</ol>
          </section>
          <section className="project-detail-list">
            <h3>Technology & design</h3>
            <ul>{project.stack.map(item => <li key={item}>{item}</li>)}</ul>
          </section>
          <section className="project-detail-list">
            <h3>Inside the project</h3>
            <ul>{project.highlights.map(item => <li key={item}>{item}</li>)}</ul>
          </section>
        </article>
      </motion.div>
      )}
      </AnimatePresence>
    </dialog>
  )
}
