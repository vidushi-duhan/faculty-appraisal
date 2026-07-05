// bolds standalone numbers inside a sentence so data stands out from words.
// Skips numbers glued to letters or hyphens (CET-205, AY 2025-26, 2-cycle).
const NUM = /((?<![\w-])\d+(?:\.\d+)?%?(?![\w-]))/g

export default function Emph({ text, className = 'font-bold text-slate-700' }) {
  return String(text)
    .split(NUM)
    .map((part, i) =>
      i % 2 === 1 ? (
        <span key={i} className={className}>
          {part}
        </span>
      ) : (
        part
      )
    )
}
