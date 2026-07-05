// bottom sheet on mobile, centered dialog on desktop
export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-pop sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-24 sm:w-[440px] sm:-translate-x-1/2 sm:rounded-3xl sm:p-6">
        {title && <h3 className="mb-2 text-base font-bold text-slate-900">{title}</h3>}
        {children}
      </div>
    </div>
  )
}
