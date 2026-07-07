import { useState, useEffect } from "react"
import Modal from "../ui/Modal"
import Select from "../ui/Select"
import Button from "../ui/Button"

export default function ContactModal({ open, onClose, onSubmit, phone, email, loading }) {
  const [method, setMethod] = useState(phone ? "whatsapp" : "email")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    window.__gb_modal_open = open
    return () => {
      window.__gb_modal_open = false
    }
  }, [open])
 
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(method, notes)
  }
 
  return (
    <Modal open={open} onClose={onClose} title="Registrar contacto">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Select label="Método de contacto" value={method} onChange={(e) => setMethod(e.target.value)}>
          {phone && <option value="whatsapp">WhatsApp · {phone}</option>}
          {email && <option value="email">Email · {email}</option>}
          <option value="other">Otro</option>
        </Select>
 
        <label className="block">
          <span className="block mb-2 text-sm font-medium text-white/70">Notas (opcional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Ej: mensaje enviado, esperando respuesta..."
            className="w-full px-4 py-3 rounded-xl bg-charcoal-900/80 border border-white/10 text-white placeholder-white/30 outline-none focus:border-gb-500/60 focus:ring-2 focus:ring-gb-500/20 transition-all duration-200 resize-none"
          />
        </label>
 
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}