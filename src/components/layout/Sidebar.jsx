import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutDashboard, MessagesSquare, FolderKanban, LogOut } from "lucide-react"
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

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/[0.08] bg-charcoal-900/40 backdrop-blur-2xl">
      {/* Header con Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="px-6 pt-6 pb-8 border-b border-white/[0.06]"
      >
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gb-400 to-gb-600 shadow-glow flex items-center justify-center overflow-hidden group-hover:shadow-[0_8px_24px_rgba(59,108,246,0.4)] transition-all duration-300">
            <img src="/logo-grande.jpeg" alt="GB" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">GB Soluciones</p>
            <p className="text-[11px] text-white/40 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Menu */}
      <motion.nav
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-3 py-4 space-y-2"
      >
        {NAV_ITEMS.map((item) => (
          <motion.div key={item.path} variants={navItemVariants}>
            <NavLink
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group overflow-hidden ${
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/80"
                }`
              }
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
                    className="relative z-10"
                  >
                    <item.icon
                      size={18}
                      className={`transition-colors duration-200 ${
                        isActive ? "text-gb-400" : "text-white/50 group-hover:text-white/80"
                      }`}
                    />
                  </motion.div>
                  <span className="relative z-10 font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      {/* User Profile Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
        className="p-4 border-t border-white/[0.06] bg-charcoal-900/20"
      >
        <motion.div
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200 group"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-gb-400 to-gb-600 flex items-center justify-center text-xs font-bold text-white shadow-glow flex-shrink-0"
          >
            {user?.email?.[0]?.toUpperCase() || "U"}
          </motion.div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-xs font-medium text-white/80 truncate">{user?.email}</p>
            <p className="text-[10px] text-white/30 truncate">En línea</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.15, color: "#ff6b6b" }}
            whileTap={{ scale: 0.9 }}
            onClick={logout}
            title="Cerrar sesión"
            className="text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <LogOut size={16} />
          </motion.button>
        </motion.div>
      </motion.div>
    </aside>
  )
}