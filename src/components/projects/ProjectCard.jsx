import { motion } from "framer-motion"
import { Star, FolderKanban } from "lucide-react"
import Badge from "../ui/Badge"

const STATUS_COLORS = {
  idea: { label: "Idea", color: "text-gray-300", bg: "bg-gray-500/20" },
  en_desarrollo: { label: "Desarrollo", color: "text-blue-300", bg: "bg-blue-500/20" },
  finalizado: { label: "Finalizado", color: "text-green-300", bg: "bg-green-500/20" },
  pausado: { label: "Pausado", color: "text-yellow-300", bg: "bg-yellow-500/20" },
}

export default function ProjectCard({ project, onClick }) {
  const status = STATUS_COLORS[project.status] || STATUS_COLORS.idea

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      type="button"
      className="group w-full text-left rounded-lg border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] border overflow-hidden transition-all duration-200"
    >
      <div className="relative h-40 bg-gradient-to-br from-gb-600/20 to-gb-800/20 overflow-hidden">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderKanban size={32} className="text-white/20" />
          </div>
        )}

        {project.is_featured && (
          <div className="absolute top-2 right-2 bg-yellow-500/80 p-1 rounded">
            <Star size={14} className="text-white fill-white" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2">
          {project.title}
        </h3>

        <p className="text-xs text-white/50 line-clamp-2 mb-3">
          {project.short_description || "Sin descripción"}
        </p>

        <div className="flex items-center gap-2">
          <Badge color={status.color} bg={status.bg}>
            {status.label}
          </Badge>
          {project.is_published && (
            <Badge color="text-emerald-300" bg="bg-emerald-500/20">
              Publicado
            </Badge>
          )}
        </div>
      </div>
    </motion.button>
  )
}
