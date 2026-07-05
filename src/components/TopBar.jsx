import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Map, Tags, User, Users, X } from 'lucide-react'
import { useStore } from '../store'
import Legend from './Legend'

export default function TopBar() {
  const cycle = useStore((s) => s.cycle)
  const spotlight = useStore((s) => s.spotlight)
  const setSpotlight = useStore((s) => s.setSpotlight)
  const [drawer, setDrawer] = useState(false)
  const { pathname } = useLocation()

  const open = cycle.state === 'submission'
  const cycleLabel = open ? `${cycle.year} · Submission open` : `${cycle.year} · Under review`

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-[13px] font-extrabold text-white">
              A
            </span>
            <span className="text-[15px] font-bold tracking-tight">Appraisals</span>
          </Link>

          {/* role switcher - desktop */}
          <nav className="ml-6 hidden rounded-full bg-slate-100 p-1 sm:flex">
            <Link
              to="/faculty"
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                pathname === '/faculty'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Faculty · Prof. Sharma
            </Link>
            <Link
              to="/hod"
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                pathname === '/hod'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              HoD · Dr. Verma
            </Link>
          </nav>

          <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-medium text-slate-600 md:flex">
            <span
              className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-emerald-500' : 'bg-amber-500'}`}
            />
            {cycleLabel}
          </span>

          <button
            onClick={() => setSpotlight(!spotlight)}
            title="Highlight all deck tags on this screen"
            className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition md:ml-0 ${
              spotlight
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Tags size={15} strokeWidth={2} />
            <span className="hidden sm:inline">Highlight tags</span>
          </button>
          <button
            onClick={() => setDrawer(true)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Map size={15} strokeWidth={2} />
            <span className="hidden sm:inline">Deck map</span>
          </button>
        </div>
        {/* cycle row for mobile */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-1.5 md:hidden">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
            <span
              className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-emerald-500' : 'bg-amber-500'}`}
            />
            {cycleLabel}
          </span>
          <span className="text-[11px] text-slate-400">Prototype · sample data</span>
        </div>
      </header>

      {/* mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-200/70 bg-white/95 backdrop-blur sm:hidden">
        <Link
          to="/faculty"
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
            pathname === '/faculty' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <User size={18} strokeWidth={2} />
          Faculty
        </Link>
        <Link
          to="/hod"
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
            pathname === '/hod' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <Users size={18} strokeWidth={2} />
          HoD
        </Link>
      </nav>

      {/* spotlight mode: dim the page, tags lift above via their own z-50 */}
      {spotlight && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 transition-opacity"
            onClick={() => setSpotlight(false)}
          />
          <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
            <p className="pointer-events-auto rounded-full bg-slate-900 px-4 py-2 text-[12.5px] font-medium text-white shadow-pop">
              Deck tags highlighted · click any tag for its description · click anywhere to exit
            </p>
          </div>
        </>
      )}

      {/* deck map drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setDrawer(false)}
          />
          <aside className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6 sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:max-h-none sm:w-[360px] sm:rounded-none">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold">Deck map</h2>
              <button
                onClick={() => setDrawer(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>
            <Legend />
            <button
              onClick={() => {
                setDrawer(false)
                setSpotlight(true)
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-indigo-700"
            >
              <Tags size={15} />
              Highlight tags on this screen
            </button>
          </aside>
        </div>
      )}

      {/* persistent prototype tag - desktop */}
      <span className="fixed bottom-3 right-3 z-10 hidden rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-400 shadow-card backdrop-blur sm:inline">
        Prototype · sample data
      </span>
    </>
  )
}
