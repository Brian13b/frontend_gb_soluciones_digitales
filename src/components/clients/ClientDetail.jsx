import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Card from "../ui/Card"
import Button from "../ui/Button"
import Badge from "../ui/Badge"
import Input from "../ui/Input"
import Spinner from "../ui/Spinner"
import EmptyState from "../ui/EmptyState"
import ConfirmModal from "../ui/ConfirmModal"
import Toast from "../ui/Toast"
import { ChevronLeft, Trash2, ExternalLink, Users } from "lucide-react"
import { clientsService } from "../../services/clients.service"
import { formatDateTime } from "../../utils/formatters"

const STATUS_COLORS = {
  lead: { label: "Lead", color: "text-yellow-300", bg: "bg-yellow-500/20", ring: "ring-yellow-500/30" },
  activo: { label: "Activo", color: "text-green-300", bg: "bg-green-500/20", ring: "ring-green-500/30" },
}

const SOURCE_COLORS = {
  bot_web: { label: "Bot Web", color: "text-blue-300", bg: "bg-blue-500/20", ring: "ring-blue-500/30" },
  bot_whatsapp: { label: "Bot WhatsApp", color: "text-emerald-300", bg: "bg-emerald-500/20", ring: "ring-emerald-500/30" },
  manual: { label: "Manual", color: "text-purple-300", bg: "bg-purple-500/20", ring: "ring-purple-500/30" },
  referido: { label: "Referido", color: "text-amber-300", bg: "bg-amber-500/20", ring: "ring-amber-500/30" },
}

export default function ClientDetail({ clientId, onBack, onStatusChanged }) {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    notes: "",
    status: "lead",
  })

  const load = useCallback(async () => {
    if (!clientId) return
    setLoading(true)
    try {
      const data = await clientsService.getById(clientId)
      setClient(data)
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        company_name: data.company_name || "",
        notes: data.notes || "",
        status: data.status || "lead",
      })
      setHasChanges(false)
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleStatusCycle = () => {
    handleFieldChange("status", formData.status === "lead" ? "activo" : "lead")
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await clientsService.update(clientId, formData)
      setToast({ type: "success", message: "Cliente guardado exitosamente" })
      await load()
      onStatusChanged?.()
    } catch (error) {
      setToast({
        type: "error",
        message: error.detail || "Error al guardar el cliente",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    setFormData({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      company_name: client.company_name || "",
      notes: client.notes || "",
      status: client.status || "lead",
    })
    setHasChanges(false)
  }

  const handleDelete = async () => {
    setConfirmDeleteOpen(false)
    setSaving(true)
    try {
      await clientsService.delete(clientId)
      onStatusChanged?.()
      onBack()
    } catch (error) {
      setToast({
        type: "error",
        message: error.detail || "Error al eliminar el cliente",
      })
      setSaving(false)
    }
  }

  if (!clientId) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          icon={Users}
          title="Seleccioná un cliente"
          description="Elegí un cliente de la lista para ver el detalle."
        />
      </div>
    )
  }

  if (loading || !client) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={28} />
      </div>
    )
  }

  const statusConfig = STATUS_COLORS[formData.status] || STATUS_COLORS.lead
  const sourceConfig = SOURCE_COLORS[client.source] || { label: "Desconocido", color: "text-white/70", bg: "bg-white/5", ring: "ring-white/10" }

  return (
    <motion.div
      key={clientId}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-white/[0.06] bg-charcoal-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-white/50 hover:text-white bg-white/5 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-base md:text-lg font-bold text-white truncate max-w-[150px] md:max-w-xs">
                {formData.name}
              </h2>
              <Badge color={statusConfig.color} bg={statusConfig.bg} ring={statusConfig.ring}>
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-[10px] md:text-xs text-white/35">
              {formatDateTime(client.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirmDeleteOpen(true)}
            disabled={saving}
            className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Eliminar cliente"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-none">
        <Card>
          <div className="p-6 space-y-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Información de Contacto</p>
            <Input
              label="Nombre"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Nombre del cliente"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="correo@ejemplo.com"
            />
            <Input
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              placeholder="+54 911 2345 6789"
            />
          </div>
        </Card>

        <Card>
          <div className="p-6 space-y-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Detalles</p>
            <Input
              label="Empresa"
              value={formData.company_name}
              onChange={(e) => handleFieldChange("company_name", e.target.value)}
              placeholder="Nombre de la empresa"
            />
            <div>
              <label className="block mb-2 text-sm font-medium text-white/70">Estado</label>
              <button
                onClick={handleStatusCycle}
                className="w-full px-4 py-3 rounded-xl bg-charcoal-900/80 border border-white/10 text-white text-left hover:border-gb-500/60 hover:ring-2 hover:ring-gb-500/20 transition-all duration-200 font-medium"
              >
                {statusConfig.label}
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 space-y-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Notas</p>
            <textarea
              value={formData.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="Agrega notas sobre este cliente..."
              className="w-full px-4 py-3 rounded-xl bg-charcoal-900/80 border border-white/10 text-white placeholder-white/30 outline-none focus:border-gb-500/60 focus:ring-2 focus:ring-gb-500/20 transition-all duration-200 resize-none min-h-24 font-mono text-sm"
            />
          </div>
        </Card>

        <Card>
          <div className="p-6 space-y-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Información</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/40 mb-1">Origen</p>
                <Badge color={sourceConfig.color} bg={sourceConfig.bg} ring={sourceConfig.ring}>
                  {sourceConfig.label}
                </Badge>
              </div>
              {client.conversation_id && (
                <div>
                  <p className="text-xs text-white/40 mb-2">Conversación</p>
                  <a
                    href={`/conversaciones?id=${client.conversation_id}`}
                    className="flex items-center gap-2 text-xs text-gb-300 hover:text-gb-200 transition-colors"
                  >
                    Ver conversación original <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {hasChanges && (
        <div className="px-4 md:px-8 py-4 border-t border-white/[0.06] bg-charcoal-900/50 backdrop-blur-md sticky bottom-0 z-10 flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            onClick={handleDiscard}
            disabled={saving}
          >
            Descartar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        title="Eliminar cliente"
        message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        variant="danger"
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3500}
        />
      )}
    </motion.div>
  )
}
