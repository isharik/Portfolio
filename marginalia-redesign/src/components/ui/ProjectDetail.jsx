import { useEffect, useRef } from 'react'

const projectFlows = {
  Proxima: {
    context: 'The marketplace gives someone evaluating autonomous agents a path from discovery to hiring. Profiles put the information needed for a decision alongside the next action.',
    flow: ['Discover agents', 'Review agent profiles', 'Choose a workflow'],
  },
  'Pharos Octobot': {
    context: 'The copilot brings Pharos ecosystem context into a conversational interface so visitors can ask questions in their own words and explore the answer in context.',
    flow: ['Ask a question', 'Consult on-chain context', 'Read a guided response'],
  },
  'Onchain Wizard': {
    context: 'The workspace brings network and contract information into one view. It separates inspection and preparation from the wallet authorization step.',
    flow: ['Inspect network data', 'Prepare an action', 'Review in wallet'],
  },
  'Pulse OS': {
    context: 'Pulse OS brings daily business work into a shared view. Structured workflows give AI-assisted tasks a place alongside the operational context people need to act on them.',
    flow: ['Open the workspace', 'Work through a task', 'Review actionable context'],
  },
  'Prosper Atlas': {
    context: 'The atlas uses a navigable 3D map to make relationships across the Prosper ecosystem easier to explore. Visitors can move through the space and follow individual protocol stories.',
    flow: ['Enter the ecosystem map', 'Navigate connected protocols', 'Explore a protocol story'],
  },
}

export default function ProjectDetail({ project, onClose }) {
  const dialog = useRef(null)
  const details = projectFlows[project.title]

  useEffect(() => {
    const panel = dialog.current
    if (!panel.open) panel.showModal()
  }, [])

  return (
    <dialog className="project-detail-dialog" ref={dialog} aria-labelledby="project-detail-title" onClose={onClose}>
      <div className="project-detail-frame">
        <header className="project-detail-bar">
          <span>Projects / {project.title}</span>
          <button type="button" onClick={() => dialog.current.close()} autoFocus>Close <span aria-hidden="true">×</span></button>
        </header>
        <article className="project-detail-content">
          <div className="project-detail-intro">
            <span className="scribble">{project.note}</span>
            <h2 id="project-detail-title">{project.title}</h2>
            <p>{project.description}</p>
            <p>{details.context}</p>
            <a className="project-detail-link" href={project.url}>Visit live project <span aria-hidden="true">↗</span></a>
          </div>
          <figure className="project-detail-image">
            <img src={project.image} alt={`${project.title} interface`} />
            <figcaption>Project preview</figcaption>
          </figure>
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
      </div>
    </dialog>
  )
}
