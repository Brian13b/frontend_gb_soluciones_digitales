export function formatDate(dateString) {
  if (!dateString) return "—"
  const date = new Date(dateString)
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short" })
}
 
export function formatTime(dateString) {
  if (!dateString) return "—"
  const date = new Date(dateString)
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
}
 
export function formatDateTime(dateString) {
  if (!dateString) return "—"
  const date = new Date(dateString)
  return `${formatDate(dateString)} · ${formatTime(dateString)}`
}
 
export function initials(name) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}