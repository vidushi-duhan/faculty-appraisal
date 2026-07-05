import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileText,
  HeartHandshake,
  Info,
  Landmark,
  Lock,
  MessagesSquare,
  MinusCircle,
  Paperclip,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import { useStore, SECTIONS, sectionScore, totalScore, projectedScore } from '../store'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'
import Tag from '../components/Tag'
import Modal from '../components/Modal'
import ScoreRing from '../components/ScoreRing'
import useCountUp from '../components/useCountUp'

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const SECTION_ICONS = {
  teaching: BookOpen,
  feedback: MessagesSquare,
  departmental: Building2,
  institute: Landmark,
  acr: ClipboardCheck,
  society: HeartHandshake,
}

const TIER_LABEL = {
  auto: ['Auto', 'text-emerald-600'],
  assisted: ['Assisted', 'text-amber-600'],
  manual: ['Manual', 'text-slate-500'],
}

const STATUS_ICON = {
  confirmed: [CheckCircle2, 'text-emerald-500'],
  pending: [Clock3, 'text-amber-500'],
  disputed: [AlertCircle, 'text-rose-500'],
  declined: [MinusCircle, 'text-slate-300'],
  locked: [Lock, 'text-slate-400'],
}

// ---------- provenance popover / objection form (F3) ----------

function ProvenancePopover({ point, onClose }) {
  const raiseObjection = useStore((s) => s.raiseObjection)
  const [form, setForm] = useState(false)
  const [expected, setExpected] = useState(point.prefillExpected || '')
  const [note, setNote] = useState('')

  return (
    <div className="fixed inset-0 z-50 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:z-40 sm:mt-2">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] sm:hidden" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 shadow-pop sm:static sm:w-[320px] sm:rounded-2xl sm:border sm:border-slate-100">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900">{point.value}</span>
            <Tag code="F3" kind="faculty" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-7 w-7 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={15} />
          </button>
        </div>
        <dl className="space-y-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[12.5px]">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Source module</dt>
            <dd className="font-medium text-slate-700">{point.source}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Last sync</dt>
            <dd className="font-medium text-slate-700">{point.sync}</dd>
          </div>
        </dl>

        {!form ? (
          <button
            onClick={() => setForm(true)}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Looks wrong? Raise objection
          </button>
        ) : (
          <form
            className="mt-3 space-y-2.5"
            onSubmit={(e) => {
              e.preventDefault()
              raiseObjection(point.id, expected, note)
              onClose()
            }}
          >
            <label className="block text-[12px] font-medium text-slate-500">
              Expected value
              <input
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="block text-[12px] font-medium text-slate-500">
              Note
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="One class on 4 Dec was held but not marked"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-indigo-700"
            >
              Submit objection
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ---------- one data-point row ----------
// Auto rows stay minimal (source + sync live in the provenance popover);
// only Assisted/Manual rows carry a small tier line - the exceptions stand out.

function PointRow({ point, locked }) {
  const confirmPoint = useStore((s) => s.confirmPoint)
  const declinePoint = useStore((s) => s.declinePoint)
  const [popover, setPopover] = useState(false)

  const [StatusIcon, statusColor] = STATUS_ICON[point.status] || STATUS_ICON.confirmed
  const [tierLabel, tierColor] = TIER_LABEL[point.tier]
  const dim = point.status === 'declined' ? 'opacity-45' : ''

  return (
    <li id={`row-${point.id}`} className={`relative py-2.5 ${dim}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <StatusIcon size={15} className={`mt-[3px] shrink-0 ${statusColor}`} />
          <div className="min-w-0">
            <p className="text-[13px] leading-5 text-slate-600">{point.label}</p>
            {point.tier !== 'auto' && point.status !== 'locked' && (
              <p className="mt-px text-[11px] text-slate-400">
                <span className={`font-semibold ${tierColor}`}>{tierLabel}</span>
                {point.source && <> · {point.source}</>}
              </p>
            )}
            {point.status === 'disputed' && (
              <p className="mt-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[12px] leading-4 text-amber-700">
                Disputed · expected {point.objection?.expected}. Correction happens in the source
                module; scorecard updates on next sync.
              </p>
            )}
          </div>
        </div>

        <div className="relative flex shrink-0 flex-col items-end gap-1.5">
          {point.tier === 'auto' && point.status !== 'disputed' ? (
            <button
              onClick={() => setPopover(true)}
              title="View source or raise an objection"
              className="-mr-1 inline-flex items-center gap-1 rounded-lg border border-indigo-100 bg-indigo-50/60 px-2 py-0.5 text-[13.5px] font-semibold text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-100"
            >
              {point.value}
              <Info size={12} className="text-indigo-400" />
            </button>
          ) : point.status === 'disputed' ? (
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
              Disputed
            </span>
          ) : point.status === 'declined' ? (
            <span className="text-[12px] text-slate-400">Marked as incorrect</span>
          ) : point.status === 'locked' ? (
            <span className="text-[11px] font-medium text-slate-400">Locked</span>
          ) : (
            <span className="text-[13.5px] font-semibold text-slate-900">{point.value}</span>
          )}

          {point.status === 'pending' && !locked && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => confirmPoint(point.id)}
                className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[12px] font-semibold text-white transition hover:bg-indigo-700"
              >
                Confirm
              </button>
              <button
                onClick={() => declinePoint(point.id)}
                className="text-[11px] text-slate-400 underline decoration-slate-200 underline-offset-2 transition hover:text-slate-600"
              >
                Not mine
              </button>
            </div>
          )}
          {point.status === 'pending' && locked && (
            <span className="text-[12px] text-slate-400">Unconfirmed</span>
          )}

          {popover && <ProvenancePopover point={point} onClose={() => setPopover(false)} />}
        </div>
      </div>
    </li>
  )
}

// ---------- section card ----------

function SectionCard({ section, points, locked, children, tag }) {
  const score = sectionScore(points, section.id)
  const display = useCountUp(score)
  const sectionPoints = points.filter((p) => p.section === section.id)
  const Icon = SECTION_ICONS[section.id]
  const pct = Math.min((score / section.max) * 100, 100)

  return (
    <section
      id={`sec-${section.id}`}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
    >
      <header className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={17} strokeWidth={2} />
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <h3 className="truncate text-[15px] font-bold text-slate-900">{section.title}</h3>
          {tag}
        </div>
        <span className="text-[12px] tabular-nums text-slate-400">
          <span className="text-lg font-bold text-slate-900">{display}</span> / {section.max}
        </span>
      </header>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {sectionPoints.length > 0 ? (
        <ul className="mt-2 divide-y divide-slate-100">
          {sectionPoints.map((p) => (
            <PointRow key={p.id} point={p} locked={locked} />
          ))}
        </ul>
      ) : (
        !children && <p className="py-4 text-[13px] text-slate-400">No entries yet.</p>
      )}
      {children}
    </section>
  )
}

// ---------- society manual add (INT-2 target) ----------

function SocietyForm({ locked, empty }) {
  const addSocietyActivity = useStore((s) => s.addSocietyActivity)
  const [value, setValue] = useState('')
  if (locked) return null
  return (
    <div className={empty ? 'mt-3 rounded-xl border border-dashed border-slate-200 p-4' : 'mt-3'}>
      {empty && (
        <p className="mb-3 text-[13px] text-slate-400">No entries yet. Add your first activity.</p>
      )}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!value.trim()) return
          addSocietyActivity(value.trim())
          setValue('')
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Blood donation camp coordination, 22 Sep 2025"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl border border-indigo-200 px-3.5 py-2 text-[13px] font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          Add activity
        </button>
      </form>
    </div>
  )
}

// ---------- "Up next" queue (F5 + INT-1 + INT-2 consolidated) ----------

function AttentionItem({ icon: Icon, tint, title, sub, right, onClick }) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <li>
      <Wrapper
        onClick={onClick}
        className={`flex w-full flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3 text-left ${
          onClick ? 'transition hover:bg-slate-50' : ''
        }`}
      >
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tint}`}>
          <Icon size={16} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 basis-44">
          <p className="flex flex-wrap items-center gap-1.5 text-[13.5px] font-semibold leading-5 text-slate-800">
            {title}
          </p>
          {sub && <p className="mt-px text-[11px] leading-4 text-slate-400">{sub}</p>}
        </div>
        {right && (
          <div className="ml-auto flex shrink-0 items-center max-sm:w-full max-sm:justify-end">
            {right}
          </div>
        )}
      </Wrapper>
    </li>
  )
}

function AttentionPanel({ points, societyEmpty }) {
  const bannerState = useStore((s) => s.bannerState)
  const dismissBanner = useStore((s) => s.dismissBanner)
  const hideBanner = useStore((s) => s.hideBanner)
  const confirmPoint = useStore((s) => s.confirmPoint)
  const declinePoint = useStore((s) => s.declinePoint)
  const [fading, setFading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (bannerState === 'cleared') {
      const t1 = setTimeout(() => setFading(true), 2200)
      const t2 = setTimeout(() => hideBanner(), 3400)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [bannerState, hideBanner])

  const pending = points.filter((p) => p.status === 'pending')
  const visiblePending = expanded ? pending : pending.slice(0, 2)
  const hiddenCount = pending.length - visiblePending.length
  const count = pending.length + (bannerState === 'active' ? 1 : 0) + (societyEmpty ? 1 : 0)

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <header className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
        <h2 className="text-[15px] font-bold text-slate-900">Up next</h2>
        {count > 0 && (
          <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">
            {count}
          </span>
        )}
        <Tag code="F5" kind="faculty" className="ml-auto" />
      </header>

      <ul className="divide-y divide-slate-100">
        {bannerState === 'active' && (
          <AttentionItem
            icon={AlertTriangle}
            tint="bg-amber-50 text-amber-600"
            title={
              <>
                <span>
                  Teaching at <span className="text-[15px] font-extrabold text-amber-600">71%</span>{' '}
                  of scheduled classes
                </span>
                <Tag code="INT-1" kind="int" />
              </>
            }
            sub={
              <>
                Below the <span className="font-bold text-slate-600">80%</span> band for 'Good' ·{' '}
                <span className="font-bold text-slate-600">2</span> rescheduled lectures await
                confirmation
              </>
            }
            right={
              <span className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => scrollToId('row-t-resched')}
                  className="rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-indigo-600 transition hover:bg-indigo-50"
                >
                  Show item
                </button>
                <button
                  onClick={dismissBanner}
                  aria-label="Dismiss"
                  className="grid h-7 w-7 place-items-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
                >
                  <X size={14} />
                </button>
              </span>
            }
          />
        )}

        {bannerState === 'cleared' && (
          <li
            className={`flex items-center gap-3 bg-emerald-50/60 px-5 py-3 transition-opacity duration-1000 ${
              fading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={16} />
            </span>
            <p className="text-[13.5px] font-medium text-emerald-700">
              Back within band. Rescheduled lectures counted toward scheduled classes.
            </p>
          </li>
        )}

        {societyEmpty && (
          <AttentionItem
            icon={CircleAlert}
            tint="bg-rose-50 text-rose-500"
            title={
              <>
                Contribution to Society is empty
                <Tag code="INT-2" kind="int" />
              </>
            }
            sub={
              <>
                <span className="font-bold text-rose-500">10 points</span> at stake
              </>
            }
            onClick={() => scrollToId('sec-society')}
            right={
              <span className="shrink-0 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-indigo-600">
                Add activity
              </span>
            }
          />
        )}

        {visiblePending.map((p) => (
          <AttentionItem
            key={p.id}
            icon={Clock3}
            tint="bg-indigo-50 text-indigo-600"
            title={p.label}
            sub={p.source}
            right={
              <span className="flex shrink-0 items-center gap-2.5">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                  +{p.pts.toFixed(1)} pts
                </span>
                <button
                  onClick={() => confirmPoint(p.id)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-indigo-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => declinePoint(p.id)}
                  className="text-[11px] text-slate-400 underline decoration-slate-200 underline-offset-2 transition hover:text-slate-600"
                >
                  Not mine
                </button>
              </span>
            }
          />
        ))}

        {hiddenCount > 0 && (
          <li>
            <button
              onClick={() => setExpanded(true)}
              className="flex w-full items-center justify-center gap-1.5 px-5 py-2.5 text-[12.5px] font-semibold text-indigo-600 transition hover:bg-indigo-50/50"
            >
              Show {hiddenCount} more
              <ChevronDown size={14} />
            </button>
          </li>
        )}

        {count === 0 && bannerState === 'hidden' && (
          <li className="flex items-center gap-3 px-5 py-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <Sparkles size={16} />
            </span>
            <p className="text-[13.5px] font-medium text-slate-600">
              All caught up. Review your sections and submit.
            </p>
          </li>
        )}
      </ul>

      {/* non-actionable note, kept out of the action list */}
      <p className="border-t border-slate-100 bg-slate-50/50 px-5 py-2 text-[11px] text-slate-400">
        FYI · Students' feedback window is still open for CET-205
      </p>
    </section>
  )
}

// ---------- evidence tab (F4) ----------

const uploadNames = [
  'Sensor_field_trial_report_2025.pdf',
  'Workshop_attendance_certificate.pdf',
  'MoU_soil_lab_signed.pdf',
]

function EvidenceTab({ locked }) {
  const evidence = useStore((s) => s.evidence)
  const attachEvidence = useStore((s) => s.attachEvidence)
  const addUpload = useStore((s) => s.addUpload)
  const uploadIdx = useRef(0)

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <header className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-slate-900">Evidence bank</h3>
          <Tag code="F4" kind="faculty" />
          <span className="ml-auto text-[11px] text-slate-400">Carried from earlier cycles</span>
        </header>
        <ul className="mt-2 divide-y divide-slate-100">
          {evidence.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                  <FileText size={16} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-slate-700">{e.title}</p>
                  <p className="text-[11px] text-slate-400">{e.meta}</p>
                </div>
              </div>
              {e.attached ? (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                  <Paperclip size={11} />
                  Attached · AY 2025-26
                </span>
              ) : locked ? (
                <span className="shrink-0 text-[12px] text-slate-400">Not attached</span>
              ) : (
                <button
                  onClick={() => attachEvidence(e.id)}
                  className="shrink-0 rounded-lg border border-indigo-200 px-3 py-1.5 text-[12px] font-semibold text-indigo-600 transition hover:bg-indigo-50"
                >
                  Attach to this cycle
                </button>
              )}
            </li>
          ))}
        </ul>
        {!locked && (
          <button
            onClick={() => {
              addUpload(uploadNames[uploadIdx.current % uploadNames.length])
              uploadIdx.current += 1
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-[13px] font-medium text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600"
          >
            <Upload size={15} />
            Add new
          </button>
        )}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <h3 className="text-[15px] font-bold text-slate-900">Research (portfolio)</h3>
        <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
          Form-A carries no separate research maximum. Research items live here in the evidence
          bank and are cited in the ACR; attached items are visible to the HoD during review.
        </p>
      </section>
    </div>
  )
}

// ---------- page ----------

export default function Faculty() {
  const points = useStore((s) => s.points)
  const cycle = useStore((s) => s.cycle)
  const submitAppraisal = useStore((s) => s.submitAppraisal)

  const [tab, setTab] = useState('scorecard')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const locked = cycle.state === 'review'
  const total = totalScore(points)
  const projected = projectedScore(points)

  const pendingCount = useMemo(
    () => points.filter((p) => p.status === 'pending').length,
    [points]
  )
  const pendingPts = useMemo(
    () => points.filter((p) => p.status === 'pending').reduce((a, p) => a + p.pts, 0),
    [points]
  )
  const societyEmpty = sectionScore(points, 'society') === 0

  return (
    <div className="min-h-screen pb-40 sm:pb-28">
      <TopBar />
      <Toast />

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        {/* hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 py-6 text-white shadow-lift sm:px-8">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 right-48 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-indigo-200">
                Prof. Anita Sharma · Associate Professor · Form-A
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">Your appraisal score</h1>
                <Tag code="F1" kind="faculty" inverse />
              </div>
              {locked ? (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
                  <CheckCircle2 size={13} />
                  Submitted · awaiting HoD review
                </span>
              ) : (
                <p className="mt-2 text-[13px] text-indigo-100">
                  {pendingCount > 0 ? (
                    <>
                      <span className="text-[16px] font-extrabold text-white">{pendingCount}</span>{' '}
                      item{pendingCount > 1 ? 's' : ''} to confirm · worth up to{' '}
                      <span className="text-[15px] font-extrabold text-emerald-300">
                        +{pendingPts.toFixed(1)} pts
                      </span>
                    </>
                  ) : (
                    'All suggested items handled.'
                  )}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-indigo-100">
                  Projected
                  <span className="text-[15px] font-extrabold text-white">{projected}</span>
                  <span className="text-indigo-200">
                    · last cycle <span className="font-bold text-white">72</span>
                  </span>
                  <Tag code="INT-3" kind="int" inverse />
                </span>
              </div>
            </div>
            <div className="self-center sm:self-auto">
              <ScoreRing value={total} size={148} />
            </div>
          </div>
        </section>

        {/* action queue */}
        {!locked && <AttentionPanel points={points} societyEmpty={societyEmpty} />}

        {/* tabs */}
        <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 sm:w-fit">
          {[
            ['scorecard', 'Scorecard'],
            ['evidence', 'Research & evidence'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 rounded-full px-4 py-1.5 text-[13px] font-semibold transition sm:flex-none ${
                tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'scorecard' ? (
          <>
            {/* surfaces the provenance/objection feature on the main scorecard */}
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3.5 py-2.5">
              <Info size={16} className="shrink-0 text-indigo-500" />
              <p className="text-[12.5px] leading-4 text-slate-600">
                Every synced value shows its source. Tap one to check where it came from or raise an
                objection.
              </p>
              <Tag code="F3" kind="faculty" className="ml-auto shrink-0" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {SECTIONS.map((sec) => (
              <SectionCard
                key={sec.id}
                section={sec}
                points={points}
                locked={locked}
                tag={sec.id === 'teaching' ? <Tag code="F2" kind="faculty" /> : null}
              >
                  {sec.id === 'society' && (
                    <SocietyForm
                      locked={locked}
                      empty={points.filter((p) => p.section === 'society').length === 0}
                    />
                  )}
                </SectionCard>
              ))}
            </div>
          </>
        ) : (
          <EvidenceTab locked={locked} />
        )}
      </main>

      {/* floating submit bar */}
      {!locked && (
        <div className="fixed inset-x-0 bottom-16 z-20 px-4 sm:bottom-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl bg-slate-900/95 px-4 py-3 text-white shadow-pop backdrop-blur sm:px-5">
            <div className="min-w-0 text-[13px]">
              <span className="text-base font-bold tabular-nums">{total.toFixed(1)}</span>
              <span className="text-slate-400"> / 100</span>
              {pendingCount > 0 && (
                <span className="hidden text-slate-400 sm:inline">
                  {' '}
                  · <span className="font-bold text-white">{pendingCount}</span> item
                  {pendingCount > 1 ? 's' : ''} still pending
                </span>
              )}
            </div>
            <button
              onClick={() => setConfirmOpen(true)}
              className="shrink-0 rounded-xl bg-white px-4 py-2 text-[13px] font-bold text-slate-900 transition hover:bg-indigo-50"
            >
              Submit appraisal
            </button>
          </div>
        </div>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Submit appraisal">
        <p className="text-[13px] leading-5 text-slate-500">
          After submitting you can't edit. Objections stay open and are resolved in the source
          modules.
        </p>
        {pendingCount > 0 && (
          <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[13px] leading-5 text-amber-700">
            {pendingCount} suggested item{pendingCount > 1 ? 's' : ''} will remain unconfirmed and
            won't count.
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => setConfirmOpen(false)}
            className="rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-500 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              submitAppraisal()
              setConfirmOpen(false)
            }}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  )
}
