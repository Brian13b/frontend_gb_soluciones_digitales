import { useState } from "react"
import AppShell from "../components/layout/AppShell"
import ProjectGrid from "../components/projects/ProjectGrid"
import ProjectModal from "../components/projects/ProjectModal"
import { useProjects } from "../hooks/useProjects"
import Button from "../components/ui/Button"
import Select from "../components/ui/Select"
import { Plus } from "lucide-react"

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState("")
  const [isOwnProjectFilter, setIsOwnProjectFilter] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectModalOpen, setProjectModalOpen] = useState(false)

  const { projects, loading, refetch } = useProjects({
    status: statusFilter || undefined,
    is_own_project: isOwnProjectFilter,
  })

  const handleOpenCreateModal = () => {
    setSelectedProject(null)
    setProjectModalOpen(true)
  }

  const handleOpenEditModal = (project) => {
    setSelectedProject(project)
    setProjectModalOpen(true)
  }

  const handleModalClose = () => {
    setProjectModalOpen(false)
    setSelectedProject(null)
  }

  const handleModalSuccess = () => {
    refetch()
  }

  const toggleOwnProjectFilter = () => {
    setIsOwnProjectFilter((prev) => {
      if (prev === null) return true
      if (prev === true) return false
      return null
    })
  }

  const getOwnProjectButtonLabel = () => {
    if (isOwnProjectFilter === true) return "Propios"
    if (isOwnProjectFilter === false) return "De Clientes"
    return "Todos"
  }

  const getOwnProjectButtonColor = () => {
    if (isOwnProjectFilter === true) return "bg-gb-500/20"
    if (isOwnProjectFilter === false) return "bg-blue-500/20"
    return "bg-white/[0.05]"
  }

  return (
    <AppShell>
      <div className="flex flex-col h-full min-h-0">
        <div className="sticky top-0 z-10 px-6 md:px-8 py-6 md:py-8 border-b border-white/[0.06] bg-charcoal-900/50 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-bold text-white">Proyectos</h1>
              <p className="text-xs text-white/35">{projects.length} proyecto(s)</p>
            </div>
            <Button size="sm" onClick={handleOpenCreateModal}>
              <Plus size={16} />
              <span className="hidden sm:inline">Nuevo Proyecto</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-initial sm:min-w-[200px]"
            >
              <option value="">Todos los estados</option>
              <option value="idea">Idea</option>
              <option value="en_desarrollo">En Desarrollo</option>
              <option value="finalizado">Finalizado</option>
              <option value="pausado">Pausado</option>
            </Select>

            <button
              onClick={toggleOwnProjectFilter}
              className={`
                px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200
                border border-white/10
                ${getOwnProjectButtonColor()}
                text-white/90 hover:border-white/20
              `}
            >
              {getOwnProjectButtonLabel()}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 md:py-8">
          <ProjectGrid
            projects={projects}
            loading={loading}
            onCardClick={handleOpenEditModal}
          />
        </div>
      </div>

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={handleModalClose}
        projectId={selectedProject?.id || null}
        onSuccess={handleModalSuccess}
      />
    </AppShell>
  )
}
