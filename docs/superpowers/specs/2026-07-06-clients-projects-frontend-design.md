---
name: clients-projects-frontend-design
description: Frontend implementation for Clients and Projects pages following ConversationsPage pattern, with manual client creation, project management via modal, and convert-to-client flow
metadata:
  type: feature
  status: approved-design
  date: 2026-07-06
---

# Clients & Projects Frontend Implementation

## Overview

Implement two new admin pages (Clients, Projects) following the existing ConversationsPage pattern, with:
- **ClientsPage**: Two-column layout (list + detail), two tabs (lead/activo status), manual client creation, contact info editable
- **ProjectsPage**: Grid view (1/2/3 responsive cols) with modal-based create/edit
- **Convert-to-Client**: Button in ConversationDetail to create Client from conversation contacts
- **Toast System**: Reusable error/success notification component with hybrid error handling

## Architecture & File Structure

### Services

**`src/services/clients.service.js`**
```javascript
export const clientsService = {
  list(filters = {})           // { status, limit } → backend /api/clients
  getById(id)                  // GET /api/clients/{id}
  create(payload)              // { name, email, phone, company_name, notes, status }
  update(id, payload)          // PATCH /api/clients/{id}
  delete(id)                   // DELETE /api/clients/{id}
}
```

**`src/services/projects.service.js`**
```javascript
export const projectsService = {
  list(filters = {})           // { status, is_own_project, limit }
  getById(id)
  create(payload)              // Full form: title, slug, description, technologies, category, etc.
  update(id, payload)
  delete(id)
}
```

**`src/services/conversations.service.js` (ADDITION)**
```javascript
// Add method to existing service:
convertFromConversation(conversationId) {
  return api.post(`/api/conversations/${conversationId}/convert-to-client`)
  // Returns: { id, name, email, phone, company_name, status, ... } of created client
}
```

### Hooks (Data Fetching)

**`src/hooks/useClients.js`**
```javascript
// Hook with tab as single source of truth for status filtering
export const useClients = () => {
  const [tab, setTab] = useState('lead')  // 'lead' | 'activo'
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  // Tab determines what status to request from backend
  const statusFilter = tab === 'lead' ? 'lead' : 'activo'

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await clientsService.list({ status: statusFilter, limit: 500 })
      setClients(data)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    refetch()
  }, [tab])  // Refetch when tab changes

  const setTabAndRefresh = (newTab) => {
    setTab(newTab)
    // Refetch triggered by useEffect on tab change
  }

  return { clients, loading, refetch, tab, setTab: setTabAndRefresh }
}
```

**`src/hooks/useProjects.js`**
```javascript
// Standard data-fetching hook with optional filters
export const useProjects = (filters = {}) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await projectsService.list({ limit: 500, ...filters })
      setProjects(data)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { projects, loading, refetch }
}
```

### Components

**`src/components/clients/ClientList.jsx`**
- Renders list of ClientItem components
- Handles loading spinner (Spinner)
- Empty state (EmptyState) if no clients
- Own scroll container (flex-1 overflow-y-auto)
- Props: { clients, loading, selectedId, onSelect, onDelete }

**`src/components/clients/ClientItem.jsx`**
- Displays: name (truncated), status badge (color by status), notes preview (1 line)
- Clickable card style (similar to ConversationItem)
- Props: { client, active, onClick, onDelete }

**`src/components/clients/ClientDetail.jsx`**
- Sticky header: name + status badge + back button (mobile) + delete icon
- Editable fields: name, email, phone, company_name, notes (all textarea for notes)
- Read-only fields: created_at (badge), source (badge: bot_web/bot_whatsapp/manual/referido)
- Status editing: cyclic button (lead → activo) — **EDIT MODE ONLY**
  - Comment in code: "Status cycles lead→activo in EDIT mode. CREATE mode (ClientModal) allows free selection."
- Delete button: triggers ConfirmModal before deleting
- "Ver conversación original" link if conversation_id is not null (navigates to /conversaciones with query state)
- Save/Discard buttons (show only if there are unsaved changes)
- Props: { clientId, onBack, onStatusChanged }

**`src/components/clients/ClientModal.jsx`**
- Modal for creating new client manually (no convert-to-client flow here)
- Form fields: name (required), email, phone, company_name, notes, status (select: lead/activo)
- **IMPORTANT COMMENT**: "Status select is FREE in CREATE mode (not cyclic). User can start client as 'activo' if needed (e.g., legacy clients). The cyclic lead→activo flow is EDIT-only in ClientDetail."
- Validation: name required
- Buttons: Crear/Guardar, Cancelar
- Props: { isOpen, onClose, onSuccess }

**`src/components/projects/ProjectGrid.jsx`**
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Maps projects array to ProjectCard components
- Loading spinner if projects loading
- Empty state if no projects
- Props: { projects, loading, onCardClick }

**`src/components/projects/ProjectCard.jsx`**
- Displays: thumbnail (lazy-load, fallback placeholder), title, short_description, status badge, is_featured star
- Clickable (opens ProjectModal with edit mode)
- Props: { project, onClick }

**`src/components/projects/ProjectModal.jsx`**
- Modal (centered, scrollable body for long form)
- Form fields (all editable when open):
  - title (required)
  - slug (required, must be unique)
  - description (textarea)
  - short_description (textarea)
  - technologies (comma-separated or tags)
  - category (select)
  - thumbnail_url (input)
  - demo_url (input)
  - repo_url (input)
  - is_published (checkbox)
  - is_own_project (checkbox)
  - is_featured (checkbox)
  - display_order (number)
  - started_at (date)
  - finished_at (date)
- Buttons:
  - Crear/Guardar (submit)
  - Cancelar (close modal without saving)
  - Eliminar (only in edit mode; triggers ConfirmModal before delete)
- Props: { isOpen, onClose, projectId?: id|null, onSuccess }

**`src/components/ui/Toast.jsx`** (NEW REUSABLE COMPONENT)
- Props: `{ type: 'success'|'error'|'info', message: string, actionLabel?: string, onAction?: fn, duration?: number (default 3500) }`
- Renders at bottom-right with framer-motion fade-in/out
- Auto-closes after `duration` ms (if set)
- Dismissable with X button
- If actionLabel provided: render secondary button with onAction callback
- Styles: green for success, red for error, blue for info
- Can be triggered globally or per-component (context-based or local state)

**`src/components/ui/ConfirmModal.jsx`** (if not exists; used for delete confirmations)
- Props: `{ title, message, confirmLabel, cancelLabel?, onConfirm, onCancel, variant?: 'danger'|'default' }`
- Simple modal with two buttons
- Danger variant: red confirm button
- Used by ClientDetail, ProjectModal for delete flows

### Pages

**`src/pages/ClientsPage.jsx`**
- Layout: flex row, two columns (md: 380px list + flex-1 detail)
- Tab selector: "En conversación" (lead) | "Con proyecto" (activo)
- Header: "Clientes" title + "+ Nuevo cliente" button (opens ClientModal)
- Left column (responsive hidden on mobile): ClientList with filters/tab state
- Right column (responsive hidden until selection): ClientDetail
- Uses useClients hook (gets clients, loading, tab, setTab, refetch)
- Mobile behavior: list hidden when selectedId, detail hidden when not

**`src/pages/ProjectsPage.jsx`**
- Header: "Proyectos" title + "+ Nuevo proyecto" button (opens ProjectModal for create)
- Filters row: dropdown for status (idea/en_desarrollo/finalizado/pausado) + toggle "Proyectos propios" (is_own_project)
- Grid: ProjectGrid with responsive layout
- Modal: ProjectModal (isOpen state, onCardClick opens in edit mode)
- Uses useProjects hook with filters
- Auto-refetch when filters change

### Routes & Navigation

**`src/App.jsx` (UPDATE)**
```javascript
<Route path="/clientes" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
<Route path="/proyectos" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
```

**`src/components/layout/Sidebar.jsx` (UPDATE)**
- Add to NAV_ITEMS: `{ label: "Clientes", path: "/clientes", icon: Users }`
- Add to NAV_ITEMS: `{ label: "Proyectos", path: "/proyectos", icon: FolderKanban }`
- (Import Users, FolderKanban from lucide-react)

## Data Flow

1. **List + Detail Panel (Clients):**
   - ClientsPage mounts → useClients fetches initial list (status=lead by default)
   - User clicks tab → setTab triggered → refetch with new status → ClientList updates
   - User selects client → ClientDetail renders with data from selected client object
   - User edits fields in ClientDetail → onChange updates local form state
   - User clicks Save → clientsService.update() → refetch() → list + detail re-render

2. **Manual Client Creation (ClientsPage):**
   - User clicks "+ Nuevo cliente" → ClientModal opens (isOpen=true)
   - Form filled + submitted → clientsService.create(payload)
   - Success: Toast success, modal closes, refetch() triggered, ClientList updates
   - Error: Toast error with hybrid message mapping

3. **Projects Grid + Modal (ProjectsPage):**
   - ProjectsPage mounts → useProjects fetches initial list
   - User changes filters → refetch with new filters → grid updates
   - User clicks card → ProjectModal opens with projectId (edit mode)
   - User clicks "+ Nuevo proyecto" → ProjectModal opens with projectId=null (create mode)
   - Form filled + submitted → projectsService.create/update()
   - Success: Toast success, modal closes, refetch() triggered, grid updates
   - Delete flow: button triggers ConfirmModal → if confirmed → projectsService.delete() → refetch

4. **Convert-to-Client Flow (ConversationDetail):**
   - Button "Convertir en cliente" in ConversationDetail
   - Click → conversationsService.convertFromConversation(conversationId)
   - Success: Toast success + actionLabel "Ver cliente" button
     - Button onClick: navigate('/clientes', { state: { tab: 'activo', clientId: client.id } })
     - ClientsPage mounts with tab='activo' pre-selected
     - useClients fetches fresh clients list
     - Optional: auto-select the newly created client if clientId in state
   - Failure: Toast error with hybrid message (missing contact info, etc.)
   - Side effect: both conversationsService.refetch() and eventual useClients.refetch() on ClientsPage navigation

## Error Handling & Toast System

### Toast Component Integration

Toast component is globally accessible. Two approaches:
1. **Context-based** (preferred): ToastContext wraps App, provides `useToast()` hook
2. **Local state** (simpler): each page/modal manages local toast state

Use **local state for now** (simpler, matches existing pattern); can refactor to context later if needed.

### Error Mapping (Hybrid Handling)

**conversations.convertFromConversation:**
```javascript
try {
  const client = await conversationsService.convertFromConversation(convId)
  showToast({
    type: 'success',
    message: 'Cliente creado correctamente',
    actionLabel: 'Ver cliente',
    onAction: () => navigate('/clientes', { state: { tab: 'activo', clientId: client.id } })
  })
  refetchConversations()
} catch (error) {
  if (error.status === 400 && error.detail?.includes('contact')) {
    showToast({
      type: 'error',
      message: 'Falta información de contacto para convertir este cliente. Verificá que la conversación tenga nombre, teléfono o email registrado.'
    })
  } else if (error.status >= 500 || error.isNetworkError) {
    showToast({
      type: 'error',
      message: error.detail || 'Error del servidor, intentá de nuevo.'
    })
  } else {
    // Unknown errors: show backend detail as-is for debugging
    showToast({
      type: 'error',
      message: error.detail || error.message || 'Error desconocido'
    })
  }
}
```

**projects.update (slug validation):**
- 409 Conflict → "Ya existe un proyecto con esa URL. Elegí uno diferente."
- Other 4xx/5xx → backend detail as-is

**projects/clients delete:**
- Show ConfirmModal before API call
- On confirm: attempt delete → if error → Toast error → user can retry

### Toast Position & Styling

- Position: bottom-right (consistent with existing pattern)
- Auto-close: 3500ms default (configurable per call)
- Colors: #22c55e (success), #ef4444 (error), #3b82f6 (info)
- Dismissable: X button always visible
- Action button: secondary style if actionLabel provided

## Testing & Validation

- **ClientsPage tabs:** switch lead↔activo, verify status and list changes
- **ClientDetail edit:** update fields, save, refetch verifies persistence
- **ClientDetail delete:** confirm modal appears, cancel cancels, confirm deletes + refetch
- **Convert-to-client:** success → Toast appears with "Ver cliente" button → click navigates to /clientes with new client visible
- **ProjectsPage filters:** status and is_own_project filters work independently and combined
- **ProjectModal:** create/edit/delete flows all close modal and refetch grid
- **Error cases:** network error, validation error (slug), missing contact for convert-to-client all show appropriate Toast

## Scope & Out-of-Scope

**In-Scope:**
- ClientsPage two-column layout with lead/activo tabs
- ClientDetail with editable contact info, cyclic status edit, manual delete
- ClientModal for manual creation
- ProjectsPage grid with responsive layout
- ProjectModal for full create/edit with scroll body
- Convert-to-client button and flow
- Toast reusable component with hybrid error handling
- Sidebar + App.jsx route updates

**Out-of-Scope:**
- Client/Project search (future filter enhancement)
- Bulk operations
- Advanced reporting
- Client/Project archival (just delete for now)
- Pagination (assuming backend returns reasonable list sizes; can add later)
