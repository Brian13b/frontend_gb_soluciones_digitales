import { useState } from "react"
import { NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, MessagesSquare, FolderKanban, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const NAV_ITEMS = [
  { label: "Inicio", path: "/", icon: LayoutDashboard },
  { label: "Conversaciones", path: "/conversaciones", icon: MessagesSquare },
]

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const navItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }} // 80px contraído, 256px (w-64) expandido
      className="shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/[0.08] bg-charcoal-900/40 backdrop-blur-2xl relative z-20"
    >
      {/* Botón para Colapsar/Expandir */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-charcoal-800 border border-white/[0.08] rounded-full p-1 text-white/50 hover:text-white transition-colors z-50 shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Header con Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`px-6 pt-6 pb-8 border-b border-white/[0.06] flex items-center ${isCollapsed ? "justify-center px-0" : ""}`}
      >
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-gb-400 to-gb-600 shadow-glow flex items-center justify-center overflow-hidden group-hover:shadow-[0_8px_24px_rgba(59,108,246,0.4)] transition-all duration-300">
            <img src="/logo-grande.jpeg" alt="GB" className="w-full h-full object-cover" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="text-sm font-bold text-white leading-tight">GB Soluciones</p>
                <p className="text-[11px] text-white/40 mt-0.5">Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Menu de Navegación */}
      <motion.nav
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-none"
      >
        {NAV_ITEMS.map((item) => (
          <motion.div key={item.path} variants={navItemVariants}>
            <NavLink
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `relative flex items-center ${
                  isCollapsed ? "justify-center px-0" : "gap-3 px-4"
                } py-3 rounded-2xl text-sm font-medium transition-all duration-200 group overflow-hidden ${
                  isActive ? "text-white" : "text-white/50 hover:text-white/80"
                }`
              }
              title={isCollapsed ? item.label : ""}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-gb-500/20 to-gb-600/10 border border-gb-500/30 rounded-2xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.05] rounded-2xl transition-colors duration-300" />
                  )}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-10 shrink-0"
                  >
                    <item.icon
                      size={18}
                      className={`transition-colors duration-200 ${
                        isActive ? "text-gb-400" : "text-white/50 group-hover:text-white/80"
                      }`}
                    />
                  </motion.div>
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="relative z-10 font-medium overflow-hidden whitespace-nowrap ml-3"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      {/* Perfil de Usuario */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
        className="p-4 border-t border-white/[0.06] bg-charcoal-900/20"
      >
        <motion.div
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          className={`flex items-center ${isCollapsed ? "justify-center px-0 flex-col gap-4" : "gap-3 px-3"} py-3 rounded-xl transition-colors duration-200 group`}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-gb-400 to-gb-600 flex items-center justify-center text-xs font-bold text-white shadow-glow"
          >
            {user?.email?.[0]?.toUpperCase() || "U"}
          </motion.div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden whitespace-nowrap"
              >
                <p className="text-xs font-medium text-white/80 truncate">{user?.email}</p>
                <p className="text-[10px] text-white/30 truncate">En línea</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.15, color: "#ff6b6b" }}
            whileTap={{ scale: 0.9 }}
            onClick={logout}
            title="Cerrar sesión"
            className={`text-white/30 hover:text-red-400 transition-all ${
              isCollapsed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <LogOut size={16} />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.aside>
  )
}