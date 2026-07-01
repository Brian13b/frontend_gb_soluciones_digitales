import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import Sidebar from "./Sidebar"

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-charcoal-950">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block md:fixed md:inset-y-0 md:left-0 md:z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (visible only on mobile) */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
      >
        <Sidebar />
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full md:ml-64">
        {/* Mobile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-charcoal-900/40 backdrop-blur-xl border-b border-white/[0.06]"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Toggle menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gb-400 to-gb-600 shadow-glow flex items-center justify-center overflow-hidden">
              <img src="/logo-grande.jpeg" alt="GB" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-white">GB Admin</span>
          </div>
          <div className="w-10" />
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}