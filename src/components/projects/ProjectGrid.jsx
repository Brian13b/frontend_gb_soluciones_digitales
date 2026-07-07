import { FolderKanban } from "lucide-react"
import Spinner from "../ui/Spinner"
import EmptyState from "../ui/EmptyState"
import ProjectCard from "./ProjectCard"

export default function ProjectGrid({ projects, loading, onCardClick }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No hay proyectos"
        description="Crea el primer proyecto para comenzar a mostrar tu trabajo."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onCardClick(project)}
        />
      ))}
    </div>
  )
}
