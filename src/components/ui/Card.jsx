export default function Card({ children, className = "", strong = false }) {
  return (
    <div className={`${strong ? "glass-strong" : "glass"} rounded-2xl ${className}`}>
      {children}
    </div>
  )
}