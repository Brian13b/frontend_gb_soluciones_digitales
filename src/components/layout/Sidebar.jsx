import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutDashboard, MessagesSquare, FolderKanban, LogOut } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
 
const NAV_ITEMS = [
  { label: "Inicio", path: "/", icon: LayoutDashboard },
  { label: "Conversaciones", path: "/conversaciones", icon: MessagesSquare },
  // { label: "Proyectos", path: "/proyectos", icon: FolderKanban },
]
 
export default function Sidebar() {
  const { user, logout } = useAuth()
 
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/[0.06] bg-charcoal-900/60 backdrop-blur-xl">
      <div className="px-6 pt-8 pb-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gb-400 to-gb-700 shadow-glow" />
          <div>
            <p className="text-sm font-bold text-white leading-none">GB Soluciones</p>
            <p className="text-[11px] text-white/35 mt-1">Admin Panel</p>
          </div>
        </div>
      </div>
 
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                isActive ? "text-white" : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gb-500/15 border border-gb-500/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <item.icon size={17} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
 
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-8 h-8 rounded-full bg-gb-500/20 flex items-center justify-center text-xs font-semibold text-gb-300">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white/80 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="text-white/30 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}