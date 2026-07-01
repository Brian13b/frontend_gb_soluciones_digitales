export default function Badge({ children, color = "text-white/70", bg = "bg-white/5", ring = "ring-white/10" }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${color} ${bg} ${ring}`}>
      {children}
    </span>
  )
}