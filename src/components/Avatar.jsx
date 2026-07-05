const palettes = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-sky-100 text-sky-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
]

export function initials(name) {
  return name
    .replace(/^(Prof\.|Dr\.)\s*/, '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Avatar({ name, index = 0, size = 'md' }) {
  const sizes = {
    sm: 'h-8 w-8 text-[11px]',
    md: 'h-10 w-10 text-[13px]',
    lg: 'h-12 w-12 text-[15px]',
  }
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-bold ${sizes[size]} ${palettes[index % palettes.length]}`}
    >
      {initials(name)}
    </span>
  )
}
