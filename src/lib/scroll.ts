export function scrollToSection(selector: string, reducedMotion = false) {
  const target = document.querySelector<HTMLElement>(selector)
  if (!target) return

  if (!reducedMotion) {
    const event = new CustomEvent<HTMLElement>('portfolio:scroll-to', {
      detail: target,
      cancelable: true,
    })
    window.dispatchEvent(event)
    if (event.defaultPrevented) return
  }

  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}
