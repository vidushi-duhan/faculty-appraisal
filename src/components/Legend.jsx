import Tag from './Tag'

// shared between the intro page and the Deck map drawer
export default function Legend() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Tag code="F2" kind="faculty" className="mt-0.5" />
        <p className="text-[13px] leading-5 text-slate-600">
          <span className="font-semibold text-slate-900">Faculty features.</span> Rose tags F1–F5
          mark the five faculty-side features from the deck.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <Tag code="F3" kind="hod" className="mt-0.5" />
        <p className="text-[13px] leading-5 text-slate-600">
          <span className="font-semibold text-slate-900">HoD features.</span> Blue tags F1–F5 mark
          the five HoD-side features from the deck.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <Tag code="INT-1" kind="int" className="mt-0.5" />
        <p className="text-[13px] leading-5 text-slate-600">
          <span className="font-semibold text-slate-900">Intelligence features.</span> Gray tags
          INT-1–INT-4 mark warnings, gap detection, projection and trend flags.
        </p>
      </div>
      <p className="border-t border-slate-100 pt-3 text-[12px] leading-4 text-slate-400">
        Every tag on a screen maps to the same number in the deck. Click any tag to read what it
        marks, or use Highlight tags to light up every tag on the current screen.
      </p>
    </div>
  )
}
