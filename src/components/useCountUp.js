import { useEffect, useRef, useState } from 'react'

// animates a number to its new value over ~400ms.
// rAF drives the tween; a timeout snaps to the final value so the number is
// always correct even when the tab is hidden and rAF doesn't fire.
export default function useCountUp(value, decimals = 1) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    const from = prev.current
    prev.current = value
    if (from === value) return
    const start = performance.now()
    const dur = 400
    let raf
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - t, 2)
      setDisplay(from + (value - from) * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const settle = setTimeout(() => setDisplay(value), dur + 50)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(settle)
    }
  }, [value])

  return Number(display).toFixed(decimals)
}
