export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Icon size={20} className="text-white/30" />
        </div>
      )}
      <p className="text-sm font-medium text-white/60">{title}</p>
      {description && <p className="text-xs text-white/30 mt-1.5 max-w-xs">{description}</p>}
    </div>
  )
}