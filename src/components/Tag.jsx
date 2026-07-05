import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { TAG_INFO, useStore } from '../store'

const KIND_META = {
  faculty: {
    badge: 'bg-rose-600 text-white ring-rose-300/70',
    // white fill, kind-colored text - for dark/gradient surfaces (keeps the faculty red identity)
    inverse: 'bg-white text-rose-600 ring-white/50',
    chip: 'bg-rose-600 text-white',
    label: 'Faculty feature',
  },
  hod: {
    badge: 'bg-sky-600 text-white ring-sky-300/70',
    inverse: 'bg-white text-sky-600 ring-white/50',
    chip: 'bg-sky-600 text-white',
    label: 'HoD feature',
  },
  int: {
    badge: 'bg-slate-800 text-white ring-slate-400/60',
    inverse: 'bg-white text-slate-700 ring-white/50',
    chip: 'bg-slate-800 text-white',
    label: 'Intelligence feature',
  },
}

// deck-mapping badge; kind: faculty | hod | int
// hover previews the description, click/tap pins it. The popover renders in a
// portal fixed to the viewport so cards can never clip it.
export default function Tag({ code, kind, inverse = false, className = '' }) {
  const key = kind === 'int' ? code : `${code}-${kind === 'hod' ? 'hod' : 'fac'}`
  const tip = TAG_INFO[key] || code
  const desc = tip.split(' - ').slice(1).join(' - ') || tip
  const meta = KIND_META[kind]
  const spotlight = useStore((s) => s.spotlight)

  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0, above: false })

  const show = () => {
    const r = ref.current.getBoundingClientRect()
    const above = r.bottom + 170 > window.innerHeight
    setPos({
      x: Math.min(Math.max(r.left + r.width / 2, 144), window.innerWidth - 144),
      y: above ? r.top - 8 : r.bottom + 8,
      above,
    })
    setOpen(true)
  }
  const hide = () => {
    setOpen(false)
    setPinned(false)
  }

  useEffect(() => {
    if (!open) return
    const onScroll = () => hide()
    const onKey = (e) => e.key === 'Escape' && hide()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={tip}
        onMouseEnter={show}
        onMouseLeave={() => !pinned && setOpen(false)}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (pinned) hide()
          else {
            show()
            setPinned(true)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            show()
            setPinned(true)
          }
        }}
        className={`inline-flex cursor-pointer select-none items-center whitespace-nowrap rounded-full px-2 py-[3px] text-[10px] font-bold leading-none tracking-wide shadow-sm ring-2 transition-transform hover:scale-110 ${
          inverse ? meta.inverse : meta.badge
        } ${spotlight ? 'relative z-50 scale-125 animate-pulse ring-4' : ''} ${className}`}
      >
        {code}
      </span>

      {open &&
        createPortal(
          <>
            {pinned && <div className="fixed inset-0 z-[70]" onClick={hide} />}
            <div
              className="fixed z-[80] w-72 rounded-2xl bg-slate-900 p-4 text-white shadow-pop"
              style={{
                left: pos.x,
                top: pos.y,
                transform: pos.above ? 'translate(-50%,-100%)' : 'translate(-50%,0)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-[3px] text-[10px] font-bold ${meta.chip}`}>
                  {code}
                </span>
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
                  {meta.label}
                </span>
              </div>
              <p className="mt-2.5 text-[13px] leading-5 text-slate-100">{desc}</p>
              <p className="mt-2.5 border-t border-white/10 pt-2 text-[11px] text-slate-400">
                Maps to {code} in the case study deck
              </p>
            </div>
          </>,
          document.body
        )}
    </>
  )
}
