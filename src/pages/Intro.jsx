import { Link } from 'react-router-dom'
import { ArrowRight, MonitorSmartphone, User, Users } from 'lucide-react'
import Legend from '../components/Legend'

const trySteps = [
  'Confirm a suggested duty (Lab In-charge, Sem 1)',
  'Question an auto-filled number (CET-100 attendance)',
  'Attach evidence from the bank (2024 paper)',
  'Submit the appraisal',
  'Switch to the HoD view',
  'Review by exception - accept or query claims',
  'Fill the structured ACR and finalize',
]

export default function Intro() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* soft background accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-64 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

      <main className="relative mx-auto max-w-3xl px-4 pb-16 pt-14 sm:pt-20">
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[12px] font-medium text-slate-500 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Working prototype · sample data
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[12px] font-medium text-indigo-600">
              <MonitorSmartphone size={13} strokeWidth={2} />
              Works on desktop and mobile
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Faculty Appraisal
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {' '}
              Management System
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-6 text-slate-600">
            A working prototype of the design proposed in the case study deck. Appraisal data
            pre-filled from institution modules, live scoring, an objection flow, and review by
            exception for the HoD.
          </p>
          <p className="mt-2 text-[13px] font-medium text-slate-400">by Vidushi Duhan</p>
        </div>

        {/* role cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            to="/faculty"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-lift transition hover:-translate-y-0.5"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
              <User size={20} />
            </span>
            <h2 className="mt-4 text-lg font-bold">Prof. Anita Sharma</h2>
            <p className="text-[13px] text-indigo-100">Faculty · Associate Professor</p>
            <p className="mt-3 text-[13px] leading-5 text-indigo-100/90">
              See your live scorecard, confirm suggested duties, question auto-filled numbers and
              submit the appraisal.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-indigo-700 transition group-hover:gap-2.5">
              Enter as Faculty <ArrowRight size={15} />
            </span>
          </Link>

          <Link
            to="/hod"
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-100 text-sky-600">
              <Users size={20} />
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Dr. Verma</h2>
            <p className="text-[13px] text-slate-500">Head of Department · Civil Engineering</p>
            <p className="mt-3 text-[13px] leading-5 text-slate-500">
              Review the department roster by exception, accept or query claims, fill the
              structured ACR and finalize.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-[13px] font-semibold text-slate-700 transition group-hover:gap-2.5 group-hover:border-slate-400">
              Enter as HoD <ArrowRight size={15} />
            </span>
          </Link>
        </div>

        {/* walkthrough + legend */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-[15px] font-bold text-slate-900">What you can try</h3>
            <ol className="mt-4 space-y-2.5">
              {trySteps.map((s, i) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-600">
                    {i + 1}
                  </span>
                  <span className="text-[13px] leading-5 text-slate-600">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="mb-4 text-[15px] font-bold text-slate-900">Tag legend</h3>
            <Legend />
          </section>
        </div>

        <p className="mt-8 text-center text-[12px] text-slate-400">
          Sample data. State resets on refresh. Built as a companion to the deck, not a production
          system.
        </p>
      </main>
    </div>
  )
}
