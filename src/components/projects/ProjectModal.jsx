import { useState, useEffect } from "react"
import Modal from "../ui/Modal"
import Input from "../ui/Input"
import Select from "../ui/Select"
import Button from "../ui/Button"
import ConfirmModal from "../ui/ConfirmModal"
import Toast from "../ui/Toast"
import Spinner from "../ui/Spinner"
import { projectsService } from "../../services/projects.service"

export default function ProjectModal({ isOpen, onClose, projectId = null, onSuccess }) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    technologies: "",
    category: "fullstack",
    thumbnail_url: "",
    demo_url: "",
    repo_url: "",
    is_published: false,
    is_own_project: false,
    is_featured: false,
    display_order: 0,
    started_at: "",
    finished_at: "",
    deployment_backend: "",
    deployment_frontend: "",
    deployment_database: "",
    deployment_services: "",
  })

  const isCreateMode = !projectId

  // Load project if in edit mode
  useEffect(() => {
    if (isOpen && !isCreateMode) {
      const loadProject = async () => {
        setLoading(true)
        try {
          const data = await projectsService.getById(projectId)
          setProject(data)
          // Populate form with project data
          const deploymentInfo = data.deployment_info || {}
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            description: data.description || "",
            short_description: data.short_description || "",
            technologies: Array.isArray(data.technologies)
              ? data.technologies.join(", ")
              : data.technologies || "",
            category: data.category || "fullstack",
            thumbnail_url: data.thumbnail_url || "",
            demo_url: data.demo_url || "",
            repo_url: data.repo_url || "",
            is_published: data.is_published || false,
            is_own_project: data.is_own_project || false,
            is_featured: data.is_featured || false,
            display_order: data.display_order || 0,
            started_at: data.started_at || "",
            finished_at: data.finished_at || "",
            deployment_backend: deploymentInfo.backend || "",
            deployment_frontend: deploymentInfo.frontend || "",
            deployment_database: deploymentInfo.database || "",
            deployment_services: deploymentInfo.services || "",
          })
        } catch (error) {
          setToast({
            type: "error",
            message: error.detail || "Error al cargar el proyecto",
          })
        } finally {
          setLoading(false)
        }
      }
      loadProject()
    } else if (isOpen && isCreateMode) {
      // Reset form for create mode
      setFormData({
        title: "",
        slug: "",
        description: "",
        short_description: "",
        technologies: "",
        category: "fullstack",
        thumbnail_url: "",
        demo_url: "",
        repo_url: "",
        is_published: false,
        is_own_project: false,
        is_featured: false,
        display_order: 0,
        started_at: "",
        finished_at: "",
        deployment_backend: "",
        deployment_frontend: "",
        deployment_database: "",
        deployment_services: "",
      })
      setProject(null)
    }
  }, [isOpen, projectId, isCreateMode])

  // Toast cleanup
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim() || !formData.slug.trim()) {
      setToast({
        type: "error",
        message: "El título y URL (slug) son obligatorios",
      })
      return
    }

    setSaving(true)
    try {
      // Build deployment_info from individual fields
      const deployment_info = {
        backend: formData.deployment_backend || null,
        frontend: formData.deployment_frontend || null,
        database: formData.deployment_database || null,
        services: formData.deployment_services || null,
      }

      // Payload: technologies as string (backend expects comma-separated), dates as null if empty
      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        short_description: formData.short_description,
        technologies: formData.technologies, // Send as string, not array
        category: formData.category,
        thumbnail_url: formData.thumbnail_url,
        demo_url: formData.demo_url,
        repo_url: formData.repo_url,
        is_published: formData.is_published,
        is_own_project: formData.is_own_project,
        is_featured: formData.is_featured,
        display_order: parseInt(formData.display_order, 10) || 0,
        started_at: formData.started_at || null,
        finished_at: formData.finished_at || null,
        deployment_info,
      }

      if (isCreateMode) {
        await projectsService.create(payload)
        setToast({ type: "success", message: "Proyecto creado" })
      } else {
        await projectsService.update(projectId, payload)
        setToast({ type: "success", message: "Proyecto guardado" })
      }

      // Close modal and call onSuccess after 1.5s
      setTimeout(() => {
        onClose()
        onSuccess?.()
      }, 1500)
    } catch (error) {
      // Handle 409 Conflict (slug already exists)
      if (error.status === 409) {
        setToast({
          type: "error",
          message: "Ya existe un proyecto con esa URL. Elegí uno diferente.",
        })
      } else {
        setToast({
          type: "error",
          message: error.detail || "Error al guardar el proyecto",
        })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    setConfirmDeleteOpen(false)
    setSaving(true)
    try {
      await projectsService.delete(projectId)
      setToast({ type: "success", message: "Proyecto eliminado" })
      setTimeout(() => {
        onClose()
        onSuccess?.()
      }, 1500)
    } catch (error) {
      setToast({
        type: "error",
        message: error.detail || "Error al eliminar el proyecto",
      })
    } finally {
      setSaving(false)
    }
  }

  const title = isCreateMode ? "Crear Proyecto" : "Editar Proyecto"

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        title={title}
        maxWidth="max-w-2xl"
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size={24} />
          </div>
        ) : (
          <div className="flex flex-col h-[90vh]">
            {/* Scrollable Body */}
            <form className="flex-1 overflow-y-auto px-2 py-2">
              <div className="space-y-4">
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="Título del proyecto"
                  disabled={saving}
                />

                <Input
                  label="URL (slug)"
                  value={formData.slug}
                  onChange={(e) => handleFieldChange("slug", e.target.value)}
                  placeholder="url-del-proyecto"
                  disabled={saving}
                />

                <Input
                  label="Descripción corta"
                  value={formData.short_description}
                  onChange={(e) => handleFieldChange("short_description", e.target.value)}
                  placeholder="Breve descripción del proyecto"
                  disabled={saving}
                />

                <label className="block">
                  <span className="block mb-2 text-sm font-medium text-white/70">
                    Descripción (opcional)
                  </span>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    rows={4}
                    placeholder="Descripción detallada del proyecto..."
                    disabled={saving}
                    className="w-full px-4 py-3 rounded-xl bg-charcoal-900/80 border border-white/10 text-white placeholder-white/30 outline-none focus:border-gb-500/60 focus:ring-2 focus:ring-gb-500/20 transition-all duration-200 resize-none disabled:opacity-50 disabled:pointer-events-none"
                  />
                </label>

                <Input
                  label="Tecnologías (separadas por comas)"
                  value={formData.technologies}
                  onChange={(e) => handleFieldChange("technologies", e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                  disabled={saving}
                />

                <Select
                  label="Categoría"
                  value={formData.category}
                  onChange={(e) => handleFieldChange("category", e.target.value)}
                  disabled={saving}
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="mobile">Mobile</option>
                  <option value="devops">DevOps</option>
                  <option value="otro">Otro</option>
                </Select>

                <Input
                  label="URL de Thumbnail"
                  value={formData.thumbnail_url}
                  onChange={(e) => handleFieldChange("thumbnail_url", e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={saving}
                />

                <Input
                  label="URL de Demo"
                  value={formData.demo_url}
                  onChange={(e) => handleFieldChange("demo_url", e.target.value)}
                  placeholder="https://demo.ejemplo.com"
                  disabled={saving}
                />

                <Input
                  label="URL del Repositorio"
                  value={formData.repo_url}
                  onChange={(e) => handleFieldChange("repo_url", e.target.value)}
                  placeholder="https://github.com/usuario/proyecto"
                  disabled={saving}
                />

                <Input
                  label="Orden de Visualización"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleFieldChange("display_order", e.target.value)}
                  placeholder="0"
                  disabled={saving}
                />

                <Input
                  label="Fecha de Inicio"
                  type="date"
                  value={formData.started_at}
                  onChange={(e) => handleFieldChange("started_at", e.target.value)}
                  disabled={saving}
                />

                <Input
                  label="Fecha de Finalización"
                  type="date"
                  value={formData.finished_at}
                  onChange={(e) => handleFieldChange("finished_at", e.target.value)}
                  disabled={saving}
                />

                {/* Info Técnica (Deployment Info) */}
                <div className="border-t border-white/10 pt-6 mt-6">
                  <h4 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">
                    Info técnica (interno)
                  </h4>
                  <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <Input
                      label="Backend"
                      value={formData.deployment_backend}
                      onChange={(e) => handleFieldChange("deployment_backend", e.target.value)}
                      placeholder="ej: Railway, Heroku, AWS"
                      disabled={saving}
                    />

                    <Input
                      label="Frontend"
                      value={formData.deployment_frontend}
                      onChange={(e) => handleFieldChange("deployment_frontend", e.target.value)}
                      placeholder="ej: Vercel, Netlify, GitHub Pages"
                      disabled={saving}
                    />

                    <Input
                      label="Base de datos"
                      value={formData.deployment_database}
                      onChange={(e) => handleFieldChange("deployment_database", e.target.value)}
                      placeholder="ej: PostgreSQL (Railway), MongoDB Atlas"
                      disabled={saving}
                    />

                    <Input
                      label="Servicios externos"
                      value={formData.deployment_services}
                      onChange={(e) => handleFieldChange("deployment_services", e.target.value)}
                      placeholder="ej: OpenAI, Cloudinary, Stripe"
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={() => handleCheckboxChange("is_published")}
                      disabled={saving}
                      className="w-4 h-4 rounded bg-white/10 border border-white/20 cursor-pointer accent-gb-500 disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-white/70">Publicado</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_own_project}
                      onChange={() => handleCheckboxChange("is_own_project")}
                      disabled={saving}
                      className="w-4 h-4 rounded bg-white/10 border border-white/20 cursor-pointer accent-gb-500 disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-white/70">Proyecto Propio</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={() => handleCheckboxChange("is_featured")}
                      disabled={saving}
                      className="w-4 h-4 rounded bg-white/10 border border-white/20 cursor-pointer accent-gb-500 disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-white/70">Destacado</span>
                  </label>
                </div>
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="border-t border-white/[0.06] p-4 mt-6 flex gap-3 justify-end">
              {!isCreateMode && (
                <Button
                  type="button"
                  variant="danger"
                  className="mr-auto"
                  onClick={handleDeleteClick}
                  disabled={saving}
                >
                  Eliminar
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <Spinner size={16} />
                    {isCreateMode ? "Creando..." : "Guardando..."}
                  </div>
                ) : isCreateMode ? (
                  "Crear"
                ) : (
                  "Guardar"
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        title="Eliminar Proyecto"
        message="¿Está seguro de que desea eliminar este proyecto? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3500}
        />
      )}
    </>
  )
}
