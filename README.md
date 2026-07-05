# Faculty Appraisal Management System

A working prototype of the design proposed in the case study deck. Two user views of one
appraisal cycle — a faculty member's live scorecard and the HoD's department review — with
appraisal data pre-filled from institution modules, live scoring, an objection flow, and
review by exception.

Built by Vidushi Duhan.

## Stack

- Vite + React 18
- Tailwind CSS
- React Router (3 routes: `/`, `/faculty`, `/hod`)
- Zustand for in-memory state

No backend and no auth — all state is in-memory and resets on refresh, by design.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Deploy

Zero-config on Vercel (framework auto-detected as Vite). `vercel.json` includes the SPA
rewrite so `/faculty` and `/hod` resolve correctly on refresh.

## Routes

- `/` — orientation page and tag legend
- `/faculty` — Prof. Sharma's scorecard (faculty view)
- `/hod` — Dr. Verma's department review (HoD view)

Each `F1–F5` / `INT-1–INT-4` tag on screen maps to the same numbered feature in the deck.
Use **Highlight tags** in the top bar to spotlight them all on a screen.
