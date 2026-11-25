import { useEffect, useRef } from 'react'
import './floating-paths-background.css'

const paths = Array.from({ length: 36 }, (_, index) => {
  const offset = index * 5 * -1
  return {
    d: `M-${380 - offset} -${189 + index * 6}C-${380 - offset} -${189 + index * 6} -${312 - offset} ${216 - index * 6} ${152 - offset} ${343 - index * 6}C${616 - offset} ${470 - index * 6} ${684 - offset} ${875 - index * 6} ${684 - offset} ${875 - index * 6}`,
    width: .5 + index * .03,
    opacity: Math.min(.23, .045 + index * .005),
  }
})

export default function FloatingPathsBackground() {
  const layerRef = useRef(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return
    const observer = new IntersectionObserver(([entry]) => {
      layer.classList.toggle('is-in-view', entry.isIntersecting)
    }, { rootMargin: '100px' })
    observer.observe(layer)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={layerRef} className="education-floating-paths" aria-hidden="true">
      <svg viewBox="-600 -420 1500 1320" preserveAspectRatio="none" fill="none">
        <g transform="translate(0 -330) scale(1 .32)">
          {paths.map((path, index) => (
            <path key={index} d={path.d} stroke="currentColor" strokeWidth={path.width}
              style={{ '--path-opacity': path.opacity }} />
          ))}
        </g>
      </svg>
    </div>
  )
}
