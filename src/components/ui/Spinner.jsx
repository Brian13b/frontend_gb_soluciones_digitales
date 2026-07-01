export default function Spinner({ size = 20 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-white/10 border-t-gb-400"
      style={{ width: size, height: size }}
    />
  )
}