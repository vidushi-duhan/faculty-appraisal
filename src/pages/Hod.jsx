import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Flag,
  Paperclip,
  ShieldCheck,
  TrendingDown,
  Users,
} from 'lucide-react'
import { useStore, ACR_DIMENSIONS, ACR_SCALE, KULKARNI_TREND, facultyStanding } from '../store'
import Emph from '../components/Emph'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'
import Tag from '../components/Tag'
import Modal from '../components/Modal'
import Avatar from '../components/Avatar'

const STATUS = {
  in_progress: { label: 'In progress', cls: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
  submitted: { label: 'Submitted', cls: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  reviewed: { label: 'Reviewed', cls: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
}

function StatusPill({ status }) {
  const s = STATUS[status]
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

// ---------- summary tiles ----------

function StatTiles({ faculty, points }) {
  const counts = {
    in_progress: faculty.filter((f) => f.status === 'in_progress').length,
    submitted: faculty.filter((f) => f.status === 'submitted').length,
    reviewed: faculty.filter((f) => f.status === 'reviewed').length,
  }
  const avg = faculty.reduce((a, f) => a + facultyStanding(f, points), 0) / faculty.length

  const tiles = [
    { label: 'In progress', value: counts.in_progress, tint: 'text-slate-500' },
    { label: 'Submitted', value: counts.submitted, tint: 'text-amber-600' },
    { label: 'Reviewed', value: counts.reviewed, tint: 'text-emerald-600' },
    { label: 'Dept average', value: avg.toFixed(1), tint: 'text-indigo-600' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-card">
          <p className={`text-2xl font-extrabold tabular-nums ${t.tint}`}>{t.value}</p>
          <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
            {t.label}
          </p>
        </div>
      ))}
    </div>
  )
}

// ---------- exception flags row (F4) ----------

function FlagCards({ faculty, onOpen }) {
  const flagged = faculty.flatMap((f) => f.flags.map((fl) => ({ f, fl })))
  if (flagged.length === 0) return null
  return (
    <section>
      <header className="mb-2 flex items-center gap-2 px-1">
        <h2 className="text-[15px] font-bold text-slate-900">Exceptions</h2>
        <Tag code="F4" kind="hod" />
        <span className="text-[12px] text-slate-400">Click a flag to jump to the item</span>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        {flagged.map(({ f, fl }) => (
          <button
            key={fl.id}
            onClick={() => onOpen(f.id, fl.target)}
            className="group flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-left transition hover:border-amber-200 hover:bg-amber-50"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
              {fl.int ? <TrendingDown size={17} /> : <Flag size={16} />}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 truncate text-[13px] font-bold text-slate-800">
                {f.name.replace(/^(Prof\.|Dr\.)\s*/, '')}
                {fl.int && <Tag code="INT-4" kind="int" />}
              </span>
              <span className="block truncate text-[12px] text-slate-500">
                <Emph text={fl.label} className="text-[13px] font-extrabold text-amber-700" />
              </span>
            </span>
            <ChevronRight
              size={15}
              className="ml-auto shrink-0 text-amber-300 transition group-hover:translate-x-0.5 group-hover:text-amber-500"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

// ---------- comparison bars (F5) ----------

function ComparisonCard({ faculty, points, selectedId, onSelect }) {
  const standings = faculty.map((f) => ({ f, v: facultyStanding(f, points) }))
  const avg = standings.reduce((a, s) => a + s.v, 0) / standings.length

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <header className="mb-4 flex items-center gap-2">
        <h3 className="text-[15px] font-bold text-slate-900">Standing vs dept average</h3>
        <Tag code="F5" kind="hod" />
        <span className="ml-auto text-[12px] font-medium text-slate-400">
          Avg {avg.toFixed(1)}
        </span>
      </header>
      <ul className="space-y-2.5">
        {standings.map(({ f, v }) => (
          <li key={f.id}>
            <button onClick={() => onSelect(f.id)} className="group flex w-full items-center gap-2">
              <span
                className={`w-20 shrink-0 truncate text-left text-[12px] font-medium ${
                  f.id === selectedId ? 'text-indigo-700' : 'text-slate-500'
                }`}
              >
                {f.name.replace(/^(Prof\.|Dr\.)\s*/, '')}
              </span>
              <span className="relative h-2 flex-1 overflow-visible rounded-full bg-slate-100">
                <span
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                    f.id === selectedId
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                      : 'bg-slate-300 group-hover:bg-indigo-300'
                  }`}
                  style={{ width: `${v}%` }}
                />
                {/* dept average marker */}
                <span
                  className="absolute -top-1 bottom-[-4px] w-px bg-slate-400/70"
                  style={{ left: `${avg}%` }}
                />
              </span>
              <span className="w-9 shrink-0 text-right text-[12px] font-semibold tabular-nums text-slate-600">
                {v.toFixed(1)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-slate-400">
        Scale 0–100 · vertical line marks the department average
      </p>
    </section>
  )
}

// ---------- INT-4 trend panel ----------

function TrendPanel({ onClose }) {
  const maxV = 25
  return (
    <Modal open onClose={onClose} title="Feedback trend · Prof. Kulkarni">
      <div className="mb-3 flex items-center gap-2">
        <Tag code="INT-4" kind="int" />
        <span className="text-[13px] font-medium text-slate-500">
          <span className="text-[15px] font-extrabold text-rose-600">18%</span> below her 2-cycle
          average (<span className="font-bold text-slate-700">21.6</span>)
        </span>
      </div>
      <div className="space-y-3 py-1">
        {KULKARNI_TREND.map((t) => (
          <div key={t.cycle} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-[12px] font-medium text-slate-400">{t.cycle}</span>
            <div className="h-5 flex-1 overflow-hidden rounded-lg bg-slate-100">
              <div
                className={`h-full rounded-lg transition-all duration-500 ${
                  t.value < 19
                    ? 'bg-gradient-to-r from-amber-400 to-rose-400'
                    : 'bg-gradient-to-r from-indigo-400 to-violet-400'
                }`}
                style={{ width: `${(t.value / maxV) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-[13px] font-bold tabular-nums text-slate-700">
              {t.value}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-slate-400">
        Average feedback score out of 25, across the last three cycles.
      </p>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-xl bg-slate-100 px-4 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}

// ---------- claim row with Accept / Query (F2) ----------

function ClaimRow({ fid, claim }) {
  const setClaimStatus = useStore((s) => s.setClaimStatus)
  const [queryOpen, setQueryOpen] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <li className="py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13.5px] font-medium leading-5 text-slate-800">{claim.label}</p>
          {claim.doc ? (
            <button
              type="button"
              className="mt-1 inline-flex max-w-full items-center gap-1 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-600 transition hover:bg-indigo-100"
              title="Open attached document"
            >
              <Paperclip size={11} className="shrink-0" />
              <span className="truncate">{claim.evidence}</span>
            </button>
          ) : (
            <p className="mt-0.5 text-[11px] text-slate-400">{claim.evidence}</p>
          )}
          {claim.status === 'queried' && (
            <p className="mt-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-700">
              Queried: {claim.reason || 'clarification requested'}
            </p>
          )}
        </div>
        <div className="shrink-0">
          {claim.status === 'open' && !queryOpen && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setClaimStatus(fid, claim.id, 'accepted')}
                className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Accept
              </button>
              <button
                onClick={() => setQueryOpen(true)}
                className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                Query
              </button>
            </div>
          )}
          {claim.status === 'accepted' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
              <CircleCheck size={12} />
              Accepted
            </span>
          )}
          {claim.status === 'queried' && (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
              Queried
            </span>
          )}
        </div>
      </div>
      {queryOpen && claim.status === 'open' && (
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            setClaimStatus(fid, claim.id, 'queried', reason.trim() || undefined)
            setQueryOpen(false)
            setReason('')
          }}
        >
          <input
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason, one line"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-[13px] outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:bg-indigo-700"
          >
            Send query
          </button>
        </form>
      )}
    </li>
  )
}

// ---------- faculty detail ----------

function FacultyDetail({ fac, facIndex, scrollTarget }) {
  const claims = useStore((s) => s.claims[fac.id] || [])
  const acr = useStore((s) => s.acr[fac.id])
  const setAcrDim = useStore((s) => s.setAcrDim)
  const setAcrRemarks = useStore((s) => s.setAcrRemarks)
  const finalize = useStore((s) => s.finalize)
  const points = useStore((s) => s.points)

  const [verifiedOpen, setVerifiedOpen] = useState(false)
  const [trendOpen, setTrendOpen] = useState(false)

  const submitted = fac.status === 'submitted' || fac.status === 'reviewed'
  const ratedCount = ACR_DIMENSIONS.filter((d) => acr.dims[d.id] > 0).length
  const acrComplete = ratedCount === ACR_DIMENSIONS.length
  const standing = facultyStanding(fac, points)

  useEffect(() => {
    if (!scrollTarget) return
    if (scrollTarget.target === 'trend') setTrendOpen(true)
    const el = document.getElementById(`det-${scrollTarget.target}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [scrollTarget])

  const verifiedSummary = [
    'Teaching Process · synced from Timetable, Attendance & LMS',
    "Students' Feedback · synced from the Feedback module",
    'Institute Activities · synced from Examinations',
  ]

  return (
    <div className="space-y-4">
      {/* detail header */}
      <header className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <Avatar name={fac.name} index={facIndex} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-tight text-slate-900">{fac.name}</h2>
          <p className="text-[13px] text-slate-400">{fac.designation}</p>
        </div>
        <div className="flex w-full items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <p className="text-2xl font-extrabold tabular-nums text-slate-900">
            {standing.toFixed(1)}
            <span className="text-[13px] font-medium text-slate-400"> / 100</span>
          </p>
          <StatusPill status={fac.status} />
        </div>
      </header>

      {/* attendance gap note for Rao */}
      {fac.id === 'rao' && (
        <section
          id="det-gap"
          className="rounded-2xl border border-amber-100 bg-amber-50/70 px-5 py-4 text-[13px] leading-5 text-amber-800"
        >
          <span className="font-bold">Attendance data gap.</span>{' '}
          <span className="font-extrabold text-amber-900">18–31 Aug 2025</span> missing from the
          Attendance module. Standing is computed without those{' '}
          <span className="font-bold text-amber-900">two weeks</span>; ask the department office
          to re-sync before finalizing.
        </section>
      )}

      {/* trend flag for Kulkarni */}
      {fac.id === 'kulkarni' && (
        <section
          id="det-trend"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-card"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-500">
              <TrendingDown size={17} />
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-slate-800">
                <span>
                  Feedback{' '}
                  <span className="text-[15px] font-extrabold text-rose-600">18%</span> below her
                  2-cycle average
                </span>
                <Tag code="INT-4" kind="int" />
              </p>
              <p className="text-[12px] text-slate-400">
                <span className="font-bold text-slate-600">21.6</span> average across the last two
                cycles
              </p>
            </div>
          </div>
          <button
            onClick={() => setTrendOpen(true)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            View trend
          </button>
        </section>
      )}
      {trendOpen && <TrendPanel onClose={() => setTrendOpen(false)} />}

      {/* review by exception (F2): verified strip + open claims in one card */}
      <section id="det-claims" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <header className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <ClipboardList size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-bold text-slate-900">Claims to review</h3>
              <Tag code="F2" kind="hod" />
            </div>
            <p className="text-[11px] text-slate-400">
              Only manual and assisted-confirmed items need your call
            </p>
          </div>
          {claims.length > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold leading-none text-white">
              <span className="tabular-nums">
                {claims.filter((c) => c.status === 'open').length}
              </span>
              open
            </span>
          )}
        </header>

        {/* what the HoD can safely skip */}
        <div className="mt-3 rounded-xl bg-emerald-50/70 px-3.5 py-2.5">
          <button
            onClick={() => setVerifiedOpen((v) => !v)}
            className="flex w-full items-center gap-2 text-left"
          >
            <ShieldCheck size={15} className="shrink-0 text-emerald-600" />
            <span className="min-w-0 flex-1 text-[12px] leading-4 text-emerald-800">
              Everything else is already verified from source modules — nothing to check there.
            </span>
            {verifiedOpen ? (
              <ChevronDown size={14} className="shrink-0 text-emerald-400" />
            ) : (
              <ChevronRight size={14} className="shrink-0 text-emerald-400" />
            )}
          </button>
          {verifiedOpen && (
            <ul className="mt-2 space-y-1 border-t border-emerald-100 pt-2">
              {verifiedSummary.map((s) => (
                <li key={s} className="flex items-start gap-1.5 text-[11px] leading-4 text-emerald-700/80">
                  <CircleCheck size={11} className="mt-0.5 shrink-0 text-emerald-400" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {claims.length > 0 ? (
          <ul className="mt-2 divide-y divide-slate-100">
            {claims.map((c) => (
              <ClaimRow key={c.id} fid={fac.id} claim={c} />
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-[13px] text-slate-400">
            {submitted ? 'No manual claims this cycle.' : 'No claims yet. Appraisal in progress.'}
          </p>
        )}
      </section>

      {/* structured ACR (F3) */}
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <header className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-bold text-slate-900">ACR</h3>
          <Tag code="F3" kind="hod" />
          <span className="ml-auto text-[12px] font-medium text-slate-400">
            {submitted ? (
              <>
                <span
                  className={`font-extrabold ${ratedCount === 6 ? 'text-emerald-600' : 'text-slate-700'}`}
                >
                  {ratedCount}/6
                </span>{' '}
                dimensions rated
              </>
            ) : (
              '6 fixed dimensions · 1–5'
            )}
          </span>
        </header>

        {!submitted ? (
          <p className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-[13px] text-slate-400">
            Opens after the faculty member submits.
          </p>
        ) : (
          <>
            {/* rating scale reference - keeps every HoD anchored to the same definitions */}
            <div className="mt-3 rounded-xl bg-slate-50 px-3 py-3">
              <p className="mb-2 text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
                Rating scale
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {ACR_SCALE.map((s) => (
                  <div key={s.value} className="text-center" title={s.hint}>
                    <span className="mx-auto grid h-6 w-6 place-items-center rounded-md bg-white text-[12px] font-bold text-slate-600 ring-1 ring-slate-200">
                      {s.value}
                    </span>
                    <span className="mt-1 block text-[10px] font-medium leading-tight text-slate-500">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ul className="mt-1 divide-y divide-slate-100">
              {ACR_DIMENSIONS.map((d) => {
                const rating = acr.dims[d.id]
                return (
                  <li
                    key={d.id}
                    className="flex flex-col gap-2 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
                  >
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] font-medium text-slate-700">
                      {d.label}
                      {rating > 0 && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">
                          {rating} · {ACR_SCALE[rating - 1].label}
                        </span>
                      )}
                    </span>
                    <div className="flex gap-1.5 max-sm:w-full">
                      {ACR_SCALE.map((s) => (
                        <button
                          key={s.value}
                          title={`${s.value} · ${s.label} — ${s.hint}`}
                          disabled={fac.status === 'reviewed'}
                          onClick={() => setAcrDim(fac.id, d.id, s.value)}
                          className={`h-9 flex-1 rounded-lg text-[13px] font-semibold tabular-nums transition disabled:cursor-default sm:h-8 sm:w-9 sm:flex-none ${
                            rating === s.value
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:hover:bg-slate-100'
                          }`}
                        >
                          {s.value}
                        </button>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="mt-3">
              <input
                value={acr.remarks}
                disabled={fac.status === 'reviewed'}
                onChange={(e) => setAcrRemarks(fac.id, e.target.value)}
                maxLength={140}
                placeholder="Remarks, optional"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
              />
              <p className="mt-1 text-right text-[11px] text-slate-300">{acr.remarks.length}/140</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-medium text-slate-400">
                {fac.status === 'reviewed'
                  ? 'Finalized and sent to IQAC.'
                  : acrComplete
                    ? 'All dimensions set.'
                    : 'Set all 6 dimensions to enable Finalize.'}
              </span>
              <button
                disabled={!acrComplete || fac.status === 'reviewed'}
                onClick={() => finalize(fac.id)}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-[13px] font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-default disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                Finalize review
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

// ---------- page ----------

export default function Hod() {
  const faculty = useStore((s) => s.faculty)
  const points = useStore((s) => s.points)
  const [selectedId, setSelectedId] = useState('sharma')
  const [scrollTarget, setScrollTarget] = useState(null)

  const selected = useMemo(() => faculty.find((f) => f.id === selectedId), [faculty, selectedId])
  const selectedIndex = faculty.findIndex((f) => f.id === selectedId)

  const openFlag = (fid, target) => {
    setSelectedId(fid)
    setScrollTarget({ target, at: Date.now() })
  }

  return (
    <div className="min-h-screen pb-24 sm:pb-12">
      <TopBar />
      <Toast />

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Department review
            </h1>
            <p className="mt-0.5 text-[13px] text-slate-400">
              Dr. Verma · Head of Department · Civil Engineering
            </p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-500 shadow-card sm:flex">
            <Users size={14} className="text-indigo-500" />6 faculty in cycle
          </span>
        </div>

        <StatTiles faculty={faculty} points={points} />

        <FlagCards faculty={faculty} onOpen={openFlag} />

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4">
            {/* roster (F1) */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
              <header className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
                <h3 className="text-[15px] font-bold text-slate-900">Roster</h3>
                <Tag code="F1" kind="hod" />
              </header>
              <ul className="divide-y divide-slate-100">
                {faculty.map((f, i) => (
                  <li key={f.id}>
                    <button
                      onClick={() => setSelectedId(f.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                        f.id === selectedId ? 'bg-indigo-50/60 hover:bg-indigo-50/60' : ''
                      }`}
                    >
                      <Avatar name={f.name} index={i} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[13.5px] font-semibold ${
                            f.id === selectedId ? 'text-indigo-800' : 'text-slate-800'
                          }`}
                        >
                          {f.name}
                        </span>
                        <span className="block truncate text-[11px] text-slate-400">
                          {f.designation} ·{' '}
                          <span className="font-semibold text-slate-500">
                            {facultyStanding(f, points).toFixed(1)} pts
                          </span>
                        </span>
                      </span>
                      <StatusPill status={f.status} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <ComparisonCard
              faculty={faculty}
              points={points}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {selected && (
            <FacultyDetail fac={selected} facIndex={selectedIndex} scrollTarget={scrollTarget} />
          )}
        </div>
      </main>
    </div>
  )
}
