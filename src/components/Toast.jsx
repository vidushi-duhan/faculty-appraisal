import { CheckCircle2 } from 'lucide-react'
import { useStore } from '../store'

export default function Toast() {
  const toast = useStore((s) => s.toast)
  if (!toast) return null
  return (
    <div className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 py-2 pl-3 pr-4 text-[13px] font-medium text-white shadow-pop sm:bottom-6">
      <CheckCircle2 size={15} className="text-emerald-400" />
      {toast}
    </div>
  )
}
