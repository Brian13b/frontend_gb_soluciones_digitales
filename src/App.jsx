import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ConversationsPage from "./pages/ConversationsPage"
import ClientsPage from "./pages/ClientsPage"
import ProjectsPage from "./pages/ProjectsPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProtectedRoute from "./components/ProtectedRoute"
 
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
 
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
 
      <Route
        path="/conversaciones"
        element={
          <ProtectedRoute>
            <ConversationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/proyectos"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}