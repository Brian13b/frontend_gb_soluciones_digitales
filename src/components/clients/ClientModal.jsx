import { useState, useEffect } from "react"
import Modal from "../ui/Modal"
import Input from "../ui/Input"
import Select from "../ui/Select"
import Button from "../ui/Button"
import Toast from "../ui/Toast"
import { clientsService } from "../../services/clients.service"

export default function ClientModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    notes: "",
    status: "lead",
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setToast({ type: "error", message: "El nombre es obligatorio" })
      return
    }

    setSaving(true)
    try {
      await clientsService.create(formData)
      setToast({ type: "success", message: "Cliente creado correctamente" })

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company_name: "",
          notes: "",
          status: "lead",
        })
        onClose()
        onSuccess?.()
      }, 1500)
    } catch (error) {
      setToast({
        type: "error",
        message: error.detail || "Error al crear el cliente",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Modal open={isOpen} onClose={onClose} title="Crear Cliente">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Nombre del cliente"
            disabled={saving}
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="correo@ejemplo.com"
            disabled={saving}
          />

          <Input
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            placeholder="+54 911 2345 6789"
            disabled={saving}
          />

          <Input
            label="Empresa"
            value={formData.company_name}
            onChange={(e) => handleFieldChange("company_name", e.target.value)}
            placeholder="Nombre de la empresa"
            disabled={saving}
          />

          <label className="block">
            <span className="block mb-2 text-sm font-medium text-white/70">Notas (opcional)</span>
            <textarea
              value={formData.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              rows={3}
              placeholder="Agrega notas sobre este cliente..."
              disabled={saving}
              className="w-full px-4 py-3 rounded-xl bg-charcoal-900/80 border border-white/10 text-white placeholder-white/30 outline-none focus:border-gb-500/60 focus:ring-2 focus:ring-gb-500/20 transition-all duration-200 resize-none disabled:opacity-50 disabled:pointer-events-none"
            />
          </label>

          {/* NOTE: Status select is FREE in CREATE mode (not cyclic). User can start client as
              'activo' if needed (e.g., legacy clients). The cyclic lead→activo flow is EDIT-only
              in ClientDetail. */}
          <Select
            label="Estado"
            value={formData.status}
            onChange={(e) => handleFieldChange("status", e.target.value)}
            disabled={saving}
          >
            <option value="lead">Lead</option>
            <option value="activo">Activo</option>
          </Select>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Guardando..." : "Crear Cliente"}
            </Button>
          </div>
        </form>
      </Modal>

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
