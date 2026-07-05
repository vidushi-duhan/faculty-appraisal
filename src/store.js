import { create } from 'zustand'

// ---------- static definitions ----------

export const SECTIONS = [
  { id: 'teaching', title: 'Teaching Process', max: 25 },
  { id: 'feedback', title: "Students' Feedback", max: 25 },
  { id: 'departmental', title: 'Departmental Activities', max: 20 },
  { id: 'institute', title: 'Institute Activities', max: 10 },
  { id: 'acr', title: 'ACR', max: 10 },
  { id: 'society', title: 'Contribution to Society', max: 10 },
]

export const ACR_DIMENSIONS = [
  { id: 'knowledge', label: 'Knowledge of subject' },
  { id: 'quality', label: 'Quality of output' },
  { id: 'initiative', label: 'Initiative' },
  { id: 'motivate', label: 'Ability to motivate students' },
  { id: 'conduct', label: 'Interpersonal conduct' },
  { id: 'integrity', label: 'Integrity' },
]

// shared 5-point rating anchors so every HoD rates against the same definition
export const ACR_SCALE = [
  { value: 1, label: 'Poor', hint: 'Consistently below the expected standard' },
  { value: 2, label: 'Fair', hint: 'Occasionally meets the expected standard' },
  { value: 3, label: 'Good', hint: 'Reliably meets the expected standard' },
  { value: 4, label: 'Very good', hint: 'Frequently exceeds the expected standard' },
  { value: 5, label: 'Outstanding', hint: 'Sets the benchmark for the department' },
]

export const TAG_INFO = {
  'F1-fac': 'F1 - Live scorecard with running total, as proposed in the deck',
  'F2-fac': 'F2 - Pre-filled data points, as proposed in the deck',
  'F3-fac': 'F3 - Provenance and objection flow, as proposed in the deck',
  'F4-fac': 'F4 - Evidence bank with carry-forward, as proposed in the deck',
  'F5-fac': 'F5 - Nudge bar for pending items, as proposed in the deck',
  'F1-hod': 'F1 - Department roster with statuses, as proposed in the deck',
  'F2-hod': 'F2 - Review by exception: verified vs claimed split, as proposed in the deck',
  'F3-hod': 'F3 - Structured ACR with fixed dimensions, as proposed in the deck',
  'F4-hod': 'F4 - Exception flags on the roster, as proposed in the deck',
  'F5-hod': 'F5 - Department comparison strip, as proposed in the deck',
  'INT-1': 'INT-1 - Threshold warning before it costs points',
  'INT-2': 'INT-2 - Gap detection on empty sections',
  'INT-3': 'INT-3 - Score projection from current pace',
  'INT-4': 'INT-4 - Trend anomaly across cycles',
}

// ---------- initial data ----------

const initialPoints = [
  // Teaching Process (25)
  { id: 't-cet100', section: 'teaching', label: 'CET-100 · 39/42 classes held', value: '39/42', tier: 'auto', source: 'Timetable + Attendance', sync: '12 Dec 2025', pts: 7.0, status: 'confirmed', objection: null, prefillExpected: '40' },
  { id: 't-cet205', section: 'teaching', label: 'CET-205 · 41/44 classes held', value: '41/44', tier: 'auto', source: 'Timetable + Attendance', sync: '12 Dec 2025', pts: 7.2, status: 'confirmed', objection: null },
  { id: 't-med100', section: 'teaching', label: 'MED-100 · 38/40 classes held', value: '38/40', tier: 'auto', source: 'Timetable + Attendance', sync: '12 Dec 2025', pts: 7.1, status: 'confirmed', objection: null },
  { id: 't-lesson', section: 'teaching', label: 'Lesson-plan coverage · 87%', value: '87%', tier: 'auto', source: 'LMS', sync: '10 Dec 2025', pts: 2.6, status: 'confirmed', objection: null },
  { id: 't-recorded', section: 'teaching', label: '2 recorded lectures uploaded', value: '2 uploads', tier: 'assisted', source: 'LMS', sync: '8 Dec 2025', pts: 0.8, status: 'pending', objection: null },
  { id: 't-resched', section: 'teaching', label: '2 rescheduled lectures held · 11, 13 Jan', value: '2 held', tier: 'assisted', source: 'Timetable + Attendance', sync: '14 Jan 2026', pts: 0.2, status: 'pending', objection: null },
  // Students' Feedback (25)
  { id: 'f-cet100', section: 'feedback', label: 'CET-100 · avg 21.4/25', value: '21.4/25', tier: 'auto', source: 'Feedback module', sync: '9 Dec 2025', pts: 7.1, status: 'confirmed', objection: null },
  { id: 'f-cet205', section: 'feedback', label: 'CET-205 · avg 19.1/25', value: '19.1/25', tier: 'auto', source: 'Feedback module', sync: '9 Dec 2025', pts: 6.4, status: 'confirmed', objection: null },
  { id: 'f-med100', section: 'feedback', label: 'MED-100 · avg 22.6/25', value: '22.6/25', tier: 'auto', source: 'Feedback module', sync: '9 Dec 2025', pts: 7.5, status: 'confirmed', objection: null },
  // Departmental Activities (20)
  { id: 'd-lab', section: 'departmental', label: 'Lab In-charge · Sem 1', value: 'Duty', tier: 'assisted', source: 'Admin office order 214/CE', sync: '2 Aug 2025', pts: 3.0, status: 'pending', objection: null },
  { id: 'd-tt', section: 'departmental', label: 'Timetable In-charge · Sem 2', value: 'Duty', tier: 'assisted', source: 'Admin office order 391/CE', sync: '3 Jan 2026', pts: 3.0, status: 'pending', objection: null },
  { id: 'd-nba', section: 'departmental', label: 'NBA documentation work · Criteria 5 & 6', value: 'Confirmed', tier: 'assisted', source: 'Dept records', sync: '28 Nov 2025', pts: 7.8, status: 'confirmed', objection: null },
  // Institute Activities (10)
  { id: 'i-invig', section: 'institute', label: 'Exam invigilation · 4 sessions', value: '4 sessions', tier: 'auto', source: 'Examinations', sync: '6 Dec 2025', pts: 6.2, status: 'confirmed', objection: null },
  { id: 'i-eval', section: 'institute', label: 'Paper evaluation · CET-100', value: '1 course', tier: 'auto', source: 'Examinations', sync: '6 Dec 2025', pts: 3.5, status: 'confirmed', objection: null },
  // ACR (10) - locked
  { id: 'acr-note', section: 'acr', label: 'Filled by HoD during review', value: '—', tier: 'manual', source: 'HoD', sync: null, pts: 0, status: 'locked', objection: null },
  // Society (10) - empty, drives INT-2
]

const initialEvidence = [
  { id: 'ev-paper', title: 'Low-cost soil sensor calibration', meta: 'Paper · IJER · 2024', kind: 'Publication', attached: false },
  { id: 'ev-fdp', title: 'FDP certificate · NPTEL', meta: 'Certificate · Jul 2025 · 8 weeks', kind: 'FDP', attached: false },
  { id: 'ev-consult', title: 'Consultancy completion letter', meta: 'Letter · Pune Metro soil survey · Mar 2025', kind: 'Consultancy', attached: false },
]

const initialFaculty = [
  { id: 'sharma', name: 'Prof. Anita Sharma', designation: 'Associate Professor', status: 'in_progress', standing: null, flags: [] },
  { id: 'iyer', name: 'Dr. Rakesh Iyer', designation: 'Professor', status: 'submitted', standing: 66.2, flags: [{ id: 'fl-iyer', label: '3 unverified claims', target: 'claims' }] },
  { id: 'kulkarni', name: 'Prof. Meenal Kulkarni', designation: 'Associate Professor', status: 'submitted', standing: 58.7, flags: [{ id: 'fl-kulkarni', label: 'Feedback 18% below 2-cycle average', target: 'trend', int: true }] },
  { id: 'rao', name: 'Dr. Sandeep Rao', designation: 'Assistant Professor', status: 'in_progress', standing: 44.1, flags: [{ id: 'fl-rao', label: 'Attendance data gap · 2 weeks missing', target: 'gap' }] },
  { id: 'khan', name: 'Prof. Farah Khan', designation: 'Assistant Professor', status: 'in_progress', standing: 51.9, flags: [] },
  { id: 'nair', name: 'Dr. Vikram Nair', designation: 'Assistant Professor', status: 'in_progress', standing: 47.3, flags: [] },
]

const initialClaims = {
  iyer: [
    { id: 'c-iyer-1', label: 'Coordinated AICTE mock inspection documentation', evidence: 'No document attached', status: 'open' },
    { id: 'c-iyer-2', label: 'Guest lecture · D.Y. Patil COE · 9 Aug 2025', evidence: 'DYP_guest_lecture_invitation.pdf', doc: true, status: 'open' },
    { id: 'c-iyer-3', label: 'Journal reviewer · IJERT', evidence: 'No document attached', status: 'open' },
  ],
  kulkarni: [
    { id: 'c-kul-1', label: 'FDP attended · AI in Structural Design · 5 days', evidence: 'NPTEL_FDP_certificate.pdf', doc: true, status: 'open' },
    { id: 'c-kul-2', label: 'Departmental library in-charge', evidence: 'Office order 188/CE', status: 'open' },
  ],
  sharma: [],
  rao: [],
  khan: [],
  nair: [],
}

const initialAcr = Object.fromEntries(
  initialFaculty.map((f) => [
    f.id,
    { dims: Object.fromEntries(ACR_DIMENSIONS.map((d) => [d.id, 0])), remarks: '' },
  ])
)

export const KULKARNI_TREND = [
  { cycle: 'AY 2023-24', value: 21.9 },
  { cycle: 'AY 2024-25', value: 21.2 },
  { cycle: 'AY 2025-26', value: 17.6 },
]

// ---------- derived scoring ----------

export function sectionScore(points, sectionId) {
  const sec = SECTIONS.find((s) => s.id === sectionId)
  const sum = points
    .filter((p) => p.section === sectionId && (p.status === 'confirmed' || p.status === 'disputed'))
    .reduce((a, p) => a + p.pts, 0)
  return Math.min(Math.round(sum * 10) / 10, sec.max)
}

export function totalScore(points) {
  const t = SECTIONS.reduce((a, s) => a + sectionScore(points, s.id), 0)
  return Math.round(t * 10) / 10
}

export function projectedScore(points) {
  const total = totalScore(points)
  const pending = points
    .filter((p) => p.status === 'pending')
    .reduce((a, p) => a + p.pts, 0)
  const acrDone = sectionScore(points, 'acr') > 0
  const societyEmpty = sectionScore(points, 'society') === 0
  const proj = total + 0.8 * pending + (acrDone ? 0 : 7.5) + (societyEmpty ? 2.5 : 0)
  return Math.min(Math.round(proj), 100)
}

let uid = 0
const nextId = (prefix) => `${prefix}-${++uid}`

// ---------- store ----------

export const useStore = create((set, get) => ({
  cycle: { year: 'AY 2025-26', state: 'submission' },
  points: initialPoints,
  evidence: initialEvidence,
  faculty: initialFaculty,
  claims: initialClaims,
  acr: initialAcr,
  bannerState: 'active', // 'active' | 'cleared' | 'hidden'
  toast: null,
  spotlight: false, // "highlight tags" mode: dims the page and lifts all deck tags
  setSpotlight: (v) => set({ spotlight: v }),

  // -- faculty actions --
  confirmPoint: (id) =>
    set((s) => ({
      points: s.points.map((p) => (p.id === id ? { ...p, status: 'confirmed' } : p)),
      bannerState:
        id === 't-resched' && s.bannerState === 'active' ? 'cleared' : s.bannerState,
    })),

  declinePoint: (id) =>
    set((s) => ({
      points: s.points.map((p) => (p.id === id ? { ...p, status: 'declined' } : p)),
    })),

  raiseObjection: (id, expected, note) =>
    set((s) => ({
      points: s.points.map((p) =>
        p.id === id ? { ...p, status: 'disputed', objection: { expected, note } } : p
      ),
    })),

  dismissBanner: () => set({ bannerState: 'hidden' }),
  hideBanner: () => set((s) => (s.bannerState === 'cleared' ? { bannerState: 'hidden' } : {})),

  addSocietyActivity: (label) =>
    set((s) => ({
      points: [
        ...s.points,
        {
          id: nextId('soc'),
          section: 'society',
          label,
          value: 'Added',
          tier: 'manual',
          source: 'Self-reported · pending HoD verification',
          sync: null,
          pts: 2.5,
          status: 'confirmed',
          objection: null,
        },
      ],
    })),

  attachEvidence: (id) =>
    set((s) => ({
      evidence: s.evidence.map((e) => (e.id === id ? { ...e, attached: true } : e)),
    })),

  addUpload: (title) =>
    set((s) => ({
      evidence: [
        ...s.evidence,
        { id: nextId('ev'), title, meta: 'Uploaded · this cycle', kind: 'Upload', attached: true },
      ],
    })),

  submitAppraisal: () => {
    const s = get()
    // build Sharma's manual/assisted claims for the HoD side
    const confirmedAssisted = s.points.filter(
      (p) => p.tier !== 'auto' && p.status === 'confirmed' && p.section !== 'acr'
    )
    const attachedEvidence = s.evidence.filter((e) => e.attached)
    const sharmaClaims = [
      ...confirmedAssisted.map((p) => ({
        id: `sc-${p.id}`,
        label: p.label,
        evidence: p.source,
        status: 'open',
      })),
      ...attachedEvidence.map((e) => ({
        id: `sc-${e.id}`,
        label: e.title,
        evidence: e.meta,
        doc: true,
        status: 'open',
      })),
    ]
    set({
      cycle: { ...s.cycle, state: 'review' },
      faculty: s.faculty.map((f) => (f.id === 'sharma' ? { ...f, status: 'submitted' } : f)),
      claims: { ...s.claims, sharma: sharmaClaims },
    })
  },

  // -- HoD actions --
  setClaimStatus: (fid, cid, status, reason) =>
    set((s) => ({
      claims: {
        ...s.claims,
        [fid]: s.claims[fid].map((c) => (c.id === cid ? { ...c, status, reason } : c)),
      },
    })),

  setAcrDim: (fid, dim, val) =>
    set((s) => ({
      acr: { ...s.acr, [fid]: { ...s.acr[fid], dims: { ...s.acr[fid].dims, [dim]: val } } },
    })),

  setAcrRemarks: (fid, remarks) =>
    set((s) => ({
      acr: { ...s.acr, [fid]: { ...s.acr[fid], remarks: remarks.slice(0, 140) } },
    })),

  finalize: (fid) => {
    const s = get()
    const dims = s.acr[fid].dims
    const avg = Object.values(dims).reduce((a, v) => a + v, 0) / ACR_DIMENSIONS.length
    const acrPts = Math.round(avg * 2 * 10) / 10 // out of 10
    let points = s.points
    if (fid === 'sharma') {
      points = s.points
        .filter((p) => p.id !== 'acr-note')
        .concat({
          id: 'acr-score',
          section: 'acr',
          label: `ACR rating by HoD · ${acrPts}/10`,
          value: `${acrPts}/10`,
          tier: 'manual',
          source: 'HoD review',
          sync: null,
          pts: acrPts,
          status: 'confirmed',
          objection: null,
        })
    }
    set({
      points,
      faculty: s.faculty.map((f) => (f.id === fid ? { ...f, status: 'reviewed' } : f)),
      toast: 'Sent to IQAC for normalization',
    })
    setTimeout(() => set({ toast: null }), 3200)
  },

  clearToast: () => set({ toast: null }),
}))

// standing shown on the HoD roster; Sharma's is live
export function facultyStanding(f, points) {
  return f.id === 'sharma' ? totalScore(points) : f.standing
}
