import { useEffect, useRef } from 'react'
import fragmentSource from './education-gradient.frag?raw'
import './animated-education-background.css'

const vertexSource = `#version 300 es
in vec4 a_position;
void main() { gl_Position = a_position; }`

const palettes = {
  light: [[.96, .97, .98, 1], [.77, .85, 1, 1], [1, 1, 1, 1]],
  dark: [[.035, .043, .06, 1], [.14, .2, .36, 1], [.055, .07, .12, 1]],
}

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  gl.deleteShader(shader)
  return null
}

export default function AnimatedEducationBackground() {
  const layerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const layer = layerRef.current
    const canvas = canvasRef.current
    if (!layer || !canvas) return

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' })
    if (!gl) return

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex)
      if (fragment) gl.deleteShader(fragment)
      return
    }
    const program = gl.createProgram()
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uniform = name => gl.getUniformLocation(program, name)
    const u = {
      time: uniform('u_time'), resolution: uniform('u_resolution'), pixelRatio: uniform('u_pixelRatio'),
      scale: uniform('u_scale'), rotation: uniform('u_rotation'),
      color1: uniform('u_color1'), color2: uniform('u_color2'), color3: uniform('u_color3'),
      proportion: uniform('u_proportion'), softness: uniform('u_softness'), shape: uniform('u_shape'),
      shapeScale: uniform('u_shapeScale'), distortion: uniform('u_distortion'),
      swirl: uniform('u_swirl'), swirlIterations: uniform('u_swirlIterations'),
    }
    gl.uniform1f(u.pixelRatio, 1)
    gl.uniform1f(u.scale, .01)
    gl.uniform1f(u.rotation, -50 * Math.PI / 180)
    gl.uniform1f(u.proportion, .35)
    gl.uniform1f(u.softness, .75)
    gl.uniform1f(u.shape, 0)
    gl.uniform1f(u.shapeScale, .45)
    gl.uniform1f(u.distortion, 0)
    gl.uniform1f(u.swirl, .28)
    gl.uniform1f(u.swirlIterations, 3)

    let visible = false
    let frame = 0
    let lastDraw = 0
    const started = performance.now()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    const draw = time => {
      lastDraw = time
      const palette = palettes[document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light']
      for (let i = 0; i < 3; i++) gl.uniform4fv(u[`color${i + 1}`], palette[i])
      gl.uniform1f(u.time, reduced.matches ? 0 : (time - started) * .00023)
      gl.uniform2f(u.resolution, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    const tick = time => {
      if (!visible || document.hidden || reduced.matches) { frame = 0; return }
      if (time - lastDraw >= 1000 / 24) draw(time)
      frame = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!visible || document.hidden) return
      draw(performance.now())
      if (!reduced.matches && !frame) frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }
    const resize = () => {
      const bounds = layer.getBoundingClientRect()
      const scale = Math.min(1, 1000 / Math.max(1, bounds.width), 550 / Math.max(1, bounds.height))
      canvas.width = Math.max(1, Math.round(bounds.width * scale))
      canvas.height = Math.max(1, Math.round(bounds.height * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (visible) draw(performance.now())
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    }, { rootMargin: '80px' })
    const resizeObserver = new ResizeObserver(resize)
    const themeObserver = new MutationObserver(() => { if (visible) draw(performance.now()) })
    const onVisibility = () => document.hidden ? stop() : start()
    const onMotion = () => { stop(); start() }
    resizeObserver.observe(layer)
    observer.observe(layer)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    document.addEventListener('visibilitychange', onVisibility)
    reduced.addEventListener('change', onMotion)
    resize()

    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      reduced.removeEventListener('change', onMotion)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <div ref={layerRef} className="education-animated-gradient" aria-hidden="true"><canvas ref={canvasRef} /></div>
}
