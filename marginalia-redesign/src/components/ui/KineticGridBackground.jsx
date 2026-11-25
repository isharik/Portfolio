import { useEffect, useRef } from 'react'
import './kinetic-grid-background.css'

const CELL_SIZE = 55
const INFLUENCE_RADIUS = 260
const MAX_WARP = 24
const DOT_SPACING = 28
const LERP_SPEED = .08

const smooth = value => value * value * (3 - 2 * value)
const blend = (a, b, t) => a + (b - a) * t

export default function KineticGridBackground({ hostRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!host || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mouse = { x: -9999, y: -9999 }
    const target = { x: -9999, y: -9999 }
    const ripples = []
    let width = 0
    let height = 0
    let visible = false
    let raf = 0
    let colors

    const dotTile = document.createElement('canvas')
    dotTile.width = DOT_SPACING
    dotTile.height = DOT_SPACING
    const dotCtx = dotTile.getContext('2d')
    dotCtx.fillStyle = '#fff'
    dotCtx.beginPath()
    dotCtx.arc(DOT_SPACING / 2, DOT_SPACING / 2, .7, 0, Math.PI * 2)
    dotCtx.fill()
    const dots = ctx.createPattern(dotTile, 'repeat')

    const readColors = () => {
      const style = getComputedStyle(host)
      colors = {
        line: style.getPropertyValue('--skills-grid-line').trim(),
        node: style.getPropertyValue('--skills-grid-node').trim(),
        active: style.getPropertyValue('--skills-grid-active').trim(),
        dot: style.getPropertyValue('--skills-grid-dot').trim(),
        ripple: style.getPropertyValue('--skills-grid-ripple').trim(),
      }
    }

    const draw = now => {
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.fillStyle = colors.dot
      ctx.globalAlpha = 1
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = dots
      ctx.fillRect(0, 0, width, height)
      ctx.restore()

      for (let i = ripples.length - 1; i >= 0; i--) {
        const age = (now - ripples[i].born) / 1000
        ripples[i].radius = Math.max(0, age * 400)
        ripples[i].opacity = Math.max(0, 1 - age * 1.2)
        if (!ripples[i].opacity) ripples.splice(i, 1)
      }

      const cols = Math.max(2, Math.ceil(width / CELL_SIZE)) + 1
      const rows = Math.max(2, Math.ceil(height / CELL_SIZE)) + 1
      const cellW = width / (cols - 1)
      const cellH = height / (rows - 1)
      const points = Array.from({ length: rows }, () => Array(cols))
      const proximity = Array.from({ length: rows }, () => Array(cols))

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * cellW
          const y = row * cellH
          const edge = Math.min(col / 1.5, (cols - 1 - col) / 1.5, 1) ** 2 *
            Math.min(row / 1.5, (rows - 1 - row) / 1.5, 1) ** 2
          const dx = x - mouse.x
          const dy = y - mouse.y
          const distance = Math.hypot(dx, dy)
          const near = Math.max(0, 1 - distance / INFLUENCE_RADIUS) * edge
          let px = x
          let py = y

          if (distance < INFLUENCE_RADIUS && distance > 0 && edge) {
            const falloff = (1 - distance / INFLUENCE_RADIUS) ** 2 * Math.min(1, distance / 60)
            const amount = falloff * MAX_WARP * edge
            px -= dx / distance * amount
            py -= dy / distance * amount
          }
          for (const ripple of ripples) {
            const rx = x - ripple.x
            const ry = y - ripple.y
            const radius = Math.hypot(rx, ry)
            const diff = radius - ripple.radius
            if (Math.abs(diff) >= 55 || !radius) continue
            const amount = (1 - Math.abs(diff) / 55) * ripple.opacity * 18 * edge * (diff < 0 ? 1 : -1)
            px += rx / radius * amount
            py += ry / radius * amount
          }
          points[row][col] = [px, py]
          proximity[row][col] = near
        }
      }

      // One pass for the resting mesh, then a smaller pass for illuminated edges.
      ctx.beginPath()
      const lit = []
      const segment = (a, b, strength) => {
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
        if (strength > .015) lit.push([a, b, strength])
      }
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (col < cols - 1) segment(points[row][col], points[row][col + 1], (proximity[row][col] + proximity[row][col + 1]) / 2)
          if (row < rows - 1) segment(points[row][col], points[row + 1][col], (proximity[row][col] + proximity[row + 1][col]) / 2)
        }
      }
      ctx.lineWidth = .8
      ctx.strokeStyle = colors.line
      ctx.stroke()
      for (const [a, b, strength] of lit) {
        ctx.beginPath()
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
        ctx.lineWidth = blend(.8, 1.5, smooth(strength))
        ctx.strokeStyle = colors.active.replace('ALPHA', String(.9 * smooth(strength)))
        ctx.stroke()
      }

      ctx.beginPath()
      for (const row of points) for (const [x, y] of row) {
        ctx.moveTo(x + 1.8, y)
        ctx.arc(x, y, 1.8, 0, Math.PI * 2)
      }
      ctx.fillStyle = colors.node
      ctx.fill()
      for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
        const strength = smooth(proximity[row][col])
        if (strength <= .015) continue
        const [x, y] = points[row][col]
        const radius = blend(1.8, 3.2, strength)
        if (strength > .3) {
          const glow = ctx.createRadialGradient(x, y, radius * .5, x, y, radius + 6 * strength)
          glow.addColorStop(0, colors.active.replace('ALPHA', String(.25 * strength)))
          glow.addColorStop(1, colors.active.replace('ALPHA', '0'))
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(x, y, radius + 6 * strength, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = colors.active.replace('ALPHA', String(strength))
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const ripple of ripples) {
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.strokeStyle = colors.ripple.replace('ALPHA', String(ripple.opacity * .28))
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    const schedule = () => {
      if (visible && !raf) raf = requestAnimationFrame(frame)
    }
    const frame = now => {
      raf = 0
      const dx = target.x - mouse.x
      const dy = target.y - mouse.y
      const moving = Math.abs(dx) + Math.abs(dy) > .4 && target.x > -100
      if (moving) {
        mouse.x += dx * LERP_SPEED
        mouse.y += dy * LERP_SPEED
      } else if (target.x > -100) {
        mouse.x = target.x
        mouse.y = target.y
      }
      draw(now)
      if (moving || ripples.length) schedule()
    }
    const resize = () => {
      width = host.clientWidth
      height = host.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      schedule()
    }
    const pointerMove = event => {
      if (reduced.matches || event.pointerType === 'touch') return
      const rect = host.getBoundingClientRect()
      target.x = event.clientX - rect.left
      target.y = event.clientY - rect.top
      if (mouse.x < -100) Object.assign(mouse, target)
      schedule()
    }
    const pointerLeave = () => {
      mouse.x = target.x = -9999
      mouse.y = target.y = -9999
      schedule()
    }
    const pointerDown = event => {
      if (reduced.matches) return
      const rect = host.getBoundingClientRect()
      ripples.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, born: performance.now(), radius: 0, opacity: 1 })
      schedule()
    }
    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
      else if (raf) { cancelAnimationFrame(raf); raf = 0 }
    }, { rootMargin: '100px' })
    const themeObserver = new MutationObserver(() => { readColors(); schedule() })
    readColors()
    resizeObserver.observe(host)
    visibilityObserver.observe(host)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    host.addEventListener('pointermove', pointerMove, { passive: true })
    host.addEventListener('pointerleave', pointerLeave)
    host.addEventListener('pointerdown', pointerDown, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      themeObserver.disconnect()
      host.removeEventListener('pointermove', pointerMove)
      host.removeEventListener('pointerleave', pointerLeave)
      host.removeEventListener('pointerdown', pointerDown)
    }
  }, [hostRef])

  return <canvas ref={canvasRef} className="skills-kinetic-grid" aria-hidden="true" />
}
