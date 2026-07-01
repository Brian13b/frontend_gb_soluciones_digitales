export default function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block mb-2 text-sm font-medium text-white/70">{label}</span>}
      <select
        className={`
          w-full px-4 py-3 rounded-xl bg-charcoal-900/80 border border-white/10
          text-white/90 outline-none appearance-none cursor-pointer
          focus:border-gb-500/60 focus:ring-2 focus:ring-gb-500/20
          transition-all duration-200 ${className}
        `}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}