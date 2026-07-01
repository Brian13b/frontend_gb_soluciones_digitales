import Select from "../ui/Select"
import Button from "../ui/Button"
 
export default function FiltersBar({ estado, canal, onEstadoChange, onCanalChange, onClear }) {
  return (
    <div className="flex flex-wrap items-end gap-3 mb-5">
      <div className="w-44">
        <Select value={estado || ""} onChange={(e) => onEstadoChange(e.target.value || null)}>
          <option value="">Todos los estados</option>
          <option value="abierta">Abiertas</option>
          <option value="contactado">Contactadas</option>
          <option value="cerrada">Cerradas</option>
        </Select>
      </div>
      <div className="w-44">
        <Select value={canal || ""} onChange={(e) => onCanalChange(e.target.value || null)}>
          <option value="">Todos los canales</option>
          <option value="web">Sitio Web</option>
          <option value="whatsapp">WhatsApp</option>
        </Select>
      </div>
      {(estado || canal) && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}