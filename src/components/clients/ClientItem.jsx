import { motion } from "framer-motion"
import Badge from "../ui/Badge"

const STATUS_COLORS = {
  lead: { label: "Lead", color: "text-yellow-300", bg: "bg-yellow-500/20", ring: "ring-yellow-500/30" },
  activo: { label: "Activo", color: "text-green-300", bg: "bg-green-500/20", ring: "ring-green-500/30" },
}

export default function ClientItem({ client, active, onClick, onDelete }) {
  const status = STATUS_COLORS[client.status] || STATUS_COLORS.lead
  const notesPreview = client.notes ? client.notes.split("\n")[0].substring(0, 60) : "Sin notas"

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      type="button"
      className={`w-full text-left p-4 rounded-lg border flex flex-col gap-3 transition-colors duration-200 ${
        active
          ? "bg-gb-500/10 border-gb-500/40 ring-1 ring-gb-500/30"
          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-white/90 truncate">
          {client.name}
        </span>
        <Badge color={status.color} bg={status.bg} ring={status.ring}>
          {status.label}
        </Badge>
      </div>

      <p className="text-xs text-white/40 truncate">
        {notesPreview}
      </p>
    </motion.button>
  )
}
