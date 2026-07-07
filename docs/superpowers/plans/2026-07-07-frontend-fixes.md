# Frontend Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve 8 frontend fixes covering state cycling, filter layout, intelligent polling, scroll isolation, session expiry notifications, modal margins, error handling with headers, and client deletion verification.

**Architecture:** 
- Modular changes across components, hooks, and services
- State cycling uses existing updateEstado endpoint
- Polling uses visibility API and React context/state to pause during modals
- Error handling preserved headers through custom error class
- Layout fixes use Tailwind flex utilities and CSS scroll containment

**Tech Stack:** React, Tailwind CSS, Framer Motion, Lucide Icons, Fetch API

## Global Constraints

- No git commits (diffs shown per file at completion)
- Backend already resolves: message_count calculation, convert-to-client 409 response with X-Client-ID header, DELETE /api/clients/{id} cascade
- conversation.contacts (table Contact) is source of contact data, not conversation.contact_name/phone/email (removed)
- All modal width constraints preserved (body scrolls if content exceeds max-height)

---

## File Structure

**Files to modify:**
- `src/utils/constants.js` - Update ESTADOS labels (Fix 1)
- `src/components/conversations/ConversationDetail.jsx` - State cycle button, error 409 handler (Fix 1, 7)
- `src/components/conversations/FiltersBar.jsx` - Flex layout for filters (Fix 2)
- `src/hooks/useConversations.js` - Visibility pause, modal detection (Fix 3)
- `src/hooks/useStats.js` - Visibility pause (Fix 3)
- `src/pages/ConversationsPage.jsx` - Scroll isolation layout (Fix 4)
- `src/services/api.js` - Session expiry flag, error headers preservation (Fix 5, 7)
- `src/pages/LoginPage.jsx` - Session expiry banner (Fix 5)
- `src/components/ui/Modal.jsx` - Margin and max-height constraints (Fix 6)
- `src/components/clients/ClientDetail.jsx` - Verify delete flow (Fix 8)

---

## Task 1: Update ESTADOS constants for visual labels

**Files:**
- Modify: `src/utils/constants.js`

**Interfaces:**
- Consumes: ESTADOS object with existing color/bg/ring values
- Produces: ESTADOS with updated label for "ABIERTA" → "Pendiente" (keep internal key "ABIERTA")

- [ ] **Step 1: Read current constants file**

Read the file to see current ESTADOS structure (already done in context).

- [ ] **Step 2: Update ABIERTA label**

In `src/utils/constants.js`, change:
```javascript
export const ESTADOS = {
  ABIERTA: { label: "Pendiente", color: "text-emerald-300", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20" },
  CONTACTADA: { label: "Contactada", color: "text-amber-300", bg: "bg-amber-400/10", ring: "ring-amber-400/20" },
  FINALIZADA: { label: "Finalizada", color: "text-white/50", bg: "bg-white/5", ring: "ring-white/10" },
}
```

---

## Task 2: Add state cycle button to ConversationDetail

**Files:**
- Modify: `src/components/conversations/ConversationDetail.jsx`

**Interfaces:**
- Consumes: 
  - `handleStatusUpdate(estado)` existing function (takes "ABIERTA", "CONTACTADA", "FINALIZADA")
  - `conversation.estado` string field
  - `saving` boolean
- Produces: 
  - `cycleEstado()` function that advances state: "ABIERTA" → "CONTACTADA" → "FINALIZADA" → "CONTACTADA" (repeats)
  - State cycle button UI showing current state label with click handler

- [ ] **Step 1: Add state cycle function to ConversationDetail**

After the `handleStatusUpdate` function (around line 65), add:
```javascript
const cycleEstado = () => {
  const ciclo = ["ABIERTA", "CONTACTADA", "FINALIZADA"]
  const currentIndex = ciclo.indexOf(conversation.estado)
  let nextIndex = (currentIndex + 1) % ciclo.length

  // After first "FINALIZADA", skip back to "CONTACTADA" (not "ABIERTA")
  if (conversation.estado === "FINALIZADA" && currentIndex === 2) {
    nextIndex = 1
  }

  const nuevoEstado = ciclo[nextIndex]
  handleStatusUpdate(nuevoEstado)
}
```

- [ ] **Step 2: Add state cycle button to JSX**

In the header section of ConversationDetail (where other action buttons are), add after the "Convertir" button block:
```javascript
<Button
  variant="secondary"
  onClick={cycleEstado}
  disabled={saving || !conversation}
>
  {ESTADOS[conversation?.estado]?.label || "Estado"} →
</Button>
```

---

## Task 3: Fix FiltersBar layout for side-by-side selects

**Files:**
- Modify: `src/components/conversations/FiltersBar.jsx`

**Interfaces:**
- Consumes: existing Select, Button components with full width behavior
- Produces: responsive flex layout that keeps filters inline on narrow sidebars

- [ ] **Step 1: Replace fixed widths with flex**

In `src/components/conversations/FiltersBar.jsx`, replace the entire component:
```javascript
import Select from "../ui/Select"
import Button from "../ui/Button"

export default function FiltersBar({ estado, canal, onEstadoChange, onCanalChange, onClear }) {
  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <Select value={estado || ""} onChange={(e) => onEstadoChange(e.target.value || null)}>
            <option value="">Todos los estados</option>
            <option value="ABIERTA">Pendientes</option>
            <option value="CONTACTADA">Contactadas</option>
            <option value="FINALIZADA">Finalizadas</option>
          </Select>
        </div>
        <div className="flex-1 min-w-0">
          <Select value={canal || ""} onChange={(e) => onCanalChange(e.target.value || null)}>
            <option value="">Todos los canales</option>
            <option value="web">Sitio Web</option>
            <option value="whatsapp">WhatsApp</option>
          </Select>
        </div>
      </div>
      {(estado || canal) && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
```

---

## Task 4: Add intelligent polling with visibility API to useConversations

**Files:**
- Modify: `src/hooks/useConversations.js`

**Interfaces:**
- Consumes: existing `fetchConversations` callback, setInterval return cleanup
- Produces: polling that pauses on visibilitychange and respects modal state (via window.__gb_modal_open flag)

- [ ] **Step 1: Add visibility tracking and modal check**

Replace the useEffect that sets up the interval:
```javascript
useEffect(() => {
  fetchConversations()
  
  let interval = null
  let isVisible = true
  
  const handleVisibilityChange = () => {
    isVisible = !document.hidden
    if (isVisible && !window.__gb_modal_open) {
      fetchConversations()
    }
  }
  
  document.addEventListener("visibilitychange", handleVisibilityChange)
  
  if (isVisible && !window.__gb_modal_open) {
    interval = setInterval(() => {
      if (!document.hidden && !window.__gb_modal_open) {
        fetchConversations()
      }
    }, 30000)
  }
  
  return () => {
    clearInterval(interval)
    document.removeEventListener("visibilitychange", handleVisibilityChange)
  }
}, [fetchConversations])
```

---

## Task 5: Add intelligent polling with visibility API to useStats

**Files:**
- Modify: `src/hooks/useStats.js`

**Interfaces:**
- Consumes: existing stats fetch pattern and setInterval
- Produces: polling that pauses on visibilitychange

- [ ] **Step 1: Read useStats.js**

Read the current file to understand its structure (it likely mirrors useConversations).

- [ ] **Step 2: Apply same visibility logic**

Apply the same visibility/modal pause pattern from Task 4 to useStats.js. Replace the setInterval hook:
```javascript
useEffect(() => {
  fetchStats()
  
  let interval = null
  let isVisible = true
  
  const handleVisibilityChange = () => {
    isVisible = !document.hidden
    if (isVisible && !window.__gb_modal_open) {
      fetchStats()
    }
  }
  
  document.addEventListener("visibilitychange", handleVisibilityChange)
  
  if (isVisible && !window.__gb_modal_open) {
    interval = setInterval(() => {
      if (!document.hidden && !window.__gb_modal_open) {
        fetchStats()
      }
    }, 30000)
  }
  
  return () => {
    clearInterval(interval)
    document.removeEventListener("visibilitychange", handleVisibilityChange)
  }
}, [fetchStats])
```

---

## Task 6: Add modal open/close tracking to ContactModal

**Files:**
- Modify: `src/components/conversations/ContactModal.jsx`

**Interfaces:**
- Consumes: existing `isOpen` prop or internal modal state
- Produces: window.__gb_modal_open flag set to true when modal opens, false when closes

- [ ] **Step 1: Read ContactModal to understand state**

Determine if modal uses `isOpen` prop or internal state.

- [ ] **Step 2: Add useEffect to track modal state**

Add this useEffect to set the global flag:
```javascript
useEffect(() => {
  window.__gb_modal_open = isOpen // or whatever boolean controls visibility
  return () => {
    window.__gb_modal_open = false
  }
}, [isOpen])
```

---

## Task 7: Isolate scrolls in ConversationsPage layout

**Files:**
- Modify: `src/pages/ConversationsPage.jsx`

**Interfaces:**
- Consumes: existing ConversationList, FiltersBar, ConversationDetail components
- Produces: layout with three independent scroll zones: filters area, conversation list, detail panel

- [ ] **Step 1: Read ConversationsPage structure**

Read the file to see current layout structure.

- [ ] **Step 2: Restructure layout for scroll isolation**

Wrap the page layout as:
```javascript
<div className="flex h-screen overflow-hidden">
  {/* Sidebar stays fixed */}
  <Sidebar />
  
  {/* Main content area */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header area - NOT scrollable */}
    <Header />
    
    {/* Content area with two columns */}
    <div className="flex-1 flex overflow-hidden">
      {/* Left column: Conversations list */}
      <div className="w-1/3 flex flex-col overflow-hidden border-r border-white/10">
        {/* Filters - scrollable if needed */}
        <div className="shrink-0 px-4 pt-4">
          <FiltersBar {...props} />
        </div>
        
        {/* Conversation list - scrollable independently */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList {...props} />
        </div>
      </div>
      
      {/* Right column: Detail */}
      <div className="flex-1 overflow-hidden">
        {selectedConversation && <ConversationDetail {...props} />}
      </div>
    </div>
  </div>
</div>
```

---

## Task 8: Isolate scrolls in ConversationDetail layout

**Files:**
- Modify: `src/components/conversations/ConversationDetail.jsx`

**Interfaces:**
- Consumes: existing header, messages array, contacts list, action buttons
- Produces: layout with sticky header (shrink-0), scrollable message area (flex-1 min-h-0), scrollable contacts (if present)

- [ ] **Step 1: Restructure ConversationDetail JSX**

Ensure the main container uses `flex flex-col overflow-hidden` and subdivide:
```javascript
<div className="flex flex-col overflow-hidden h-full">
  {/* Header - sticky, no scroll */}
  <div className="shrink-0 border-b border-white/10 p-4">
    {/* Existing header content: title, estado badge, buttons */}
  </div>
  
  {/* Messages area - scrollable */}
  <div className="flex-1 min-h-0 overflow-y-auto p-4">
    {/* MessageBubble items */}
  </div>
  
  {/* Contacts sidebar area - scrollable independently */}
  <div className="w-80 border-l border-white/10 flex flex-col overflow-hidden">
    <div className="shrink-0 border-b border-white/10 p-4">
      <h3 className="font-semibold">Contactos</h3>
    </div>
    <div className="flex-1 overflow-y-auto">
      <ContactsList contacts={conversation?.contacts} />
    </div>
  </div>
</div>
```

---

## Task 9: Add session expiry flag to api.js

**Files:**
- Modify: `src/services/api.js`

**Interfaces:**
- Consumes: existing 401 response handling, localStorage token removal
- Produces: sessionStorage flag "gb_session_expired" = "true" before redirect to /login

- [ ] **Step 1: Update 401 handler in api.js**

Replace the 401 handling block:
```javascript
if (res.status === 401) {
  localStorage.removeItem("gb_token")
  localStorage.removeItem("gb_user")
  sessionStorage.setItem("gb_session_expired", "true")
  window.location.href = "/login"
  throw new ApiError("No autorizado", 401)
}
```

---

## Task 10: Add session expiry banner to LoginPage

**Files:**
- Modify: `src/pages/LoginPage.jsx`

**Interfaces:**
- Consumes: existing form and error handling UI, sessionStorage access
- Produces: conditional banner message when gb_session_expired flag exists

- [ ] **Step 1: Read LoginPage to find mount/error display location**

Determine where errors are currently displayed.

- [ ] **Step 2: Add useEffect to check for expiry flag**

Add this near component mount:
```javascript
useEffect(() => {
  const sessionExpired = sessionStorage.getItem("gb_session_expired")
  if (sessionExpired) {
    setError("Tu sesión expiró. Iniciá sesión nuevamente.")
    sessionStorage.removeItem("gb_session_expired")
  }
}, [])
```

Ensure the component has a `setError` state or similar mechanism. Add the banner before the form using existing error display pattern.

---

## Task 11: Add error response headers preservation to api.js

**Files:**
- Modify: `src/services/api.js`

**Interfaces:**
- Consumes: existing ApiError class, error response handling
- Produces: ApiError with additional `headers` property containing response headers map

- [ ] **Step 1: Extend ApiError class**

Update the ApiError class:
```javascript
class ApiError extends Error {
  constructor(message, status, headers = {}) {
    super(message)
    this.status = status
    this.headers = headers
  }
}
```

- [ ] **Step 2: Preserve headers in error throws**

Update the error handling block (around line 37):
```javascript
if (!res.ok) {
  let detail = "Error en la solicitud"
  try {
    const data = await res.json()
    detail = data.detail || detail
  } catch {}
  
  // Extract relevant headers (X-Client-ID, etc.)
  const headers = {}
  const clientId = res.headers.get("X-Client-ID")
  if (clientId) headers["X-Client-ID"] = clientId
  
  throw new ApiError(detail, res.status, headers)
}
```

---

## Task 12: Handle 409 error with X-Client-ID header in ConversationDetail

**Files:**
- Modify: `src/components/conversations/ConversationDetail.jsx`

**Interfaces:**
- Consumes: 
  - error.status === 409
  - error.headers?.["X-Client-ID"] containing client ID
  - existing setConvertToast state and Toast UI
- Produces: Toast with "Esta conversación ya fue convertida a un cliente" and "Ver cliente" action button

- [ ] **Step 1: Update handleConvertToClient error handler**

In the catch block of `handleConvertToClient`, add:
```javascript
catch (error) {
  console.error("Error converting to client:", error)
  
  if (error.status === 409) {
    const clientId = error.headers?.["X-Client-ID"]
    if (clientId) {
      setConvertToast({
        type: "warning",
        message: "Esta conversación ya fue convertida a un cliente",
        actionLabel: "Ver cliente",
        onAction: () => {
          navigate(`/clientes?tab=activo&clientId=${clientId}`)
        },
      })
    } else {
      setConvertToast({
        type: "error",
        message: "Esta conversación ya fue convertida a un cliente",
      })
    }
  } else if (error.status === 400 && error.message?.includes("contact")) {
    setConvertToast({
      type: "error",
      message: "Falta información de contacto para convertir este cliente. Verificá que la conversación tenga nombre, teléfono o email registrado.",
    })
  } else {
    setConvertToast({
      type: "error",
      message: "Error al convertir a cliente",
    })
  }
}
```

---

## Task 13: Add maximum height and margin constraints to Modal base component

**Files:**
- Modify: `src/components/ui/Modal.jsx`

**Interfaces:**
- Consumes: existing modal wrapper div structure, children content
- Produces: modal container with max-h-[85vh], centered margins, and internal scroll

- [ ] **Step 1: Read Modal.jsx structure**

Identify the main modal container div.

- [ ] **Step 2: Update modal styling**

The modal wrapper should use:
```javascript
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
  <div className="bg-gray-900 rounded-lg max-h-[85vh] w-full max-w-2xl overflow-hidden flex flex-col">
    {/* Header - if exists, shrink-0 */}
    {header && <div className="shrink-0">{header}</div>}
    
    {/* Body - scrollable if content exceeds max-height */}
    <div className="flex-1 overflow-y-auto">
      {children}
    </div>
    
    {/* Footer - if exists, shrink-0 */}
    {footer && <div className="shrink-0">{footer}</div>}
  </div>
</div>
```

Ensures `p-4` creates margin around the viewport, and body scrolls internally if content exceeds 85vh.

---

## Task 14: Verify client delete flow in ClientDetail

**Files:**
- Modify: `src/components/clients/ClientDetail.jsx` (verify, may not need changes)

**Interfaces:**
- Consumes: existing ConfirmModal, clientsService.delete(id), navigation
- Produces: confirmed delete flow closes detail panel and refreshes list

- [ ] **Step 1: Read ClientDetail.jsx**

Check the current delete implementation.

- [ ] **Step 2: Verify delete handler**

Ensure the delete handler:
1. Calls `clientsService.delete(id)`
2. On success: 
   - Closes the detail panel (via callback or navigation)
   - Triggers list refresh (via parent component callback)
3. On error: shows error toast

If the flow works, mark as verified. If adjustments needed, update the handler.

- [ ] **Step 3: Test delete in browser (if running)**

If the app is running: click delete on a test client, confirm modal appears, confirm delete, verify list refreshes and detail closes.

---

## Execution Path

After this plan is approved:

**Option 1: Subagent-Driven (Recommended)**
- Use `superpowers:subagent-driven-development` to dispatch each task
- Fresh subagent per task with two-stage review
- Fast iteration with feedback loops

**Option 2: Inline Execution**
- Use `superpowers:executing-plans` in this session
- Sequential execution with checkpoints
- All diffs shown at completion
