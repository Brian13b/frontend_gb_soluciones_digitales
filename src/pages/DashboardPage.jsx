import { motion } from "framer-motion"
import { MessagesSquare, CheckCircle2, Archive, TrendingUp } from "lucide-react"
import AppShell from "../components/layout/AppShell"
import StatCard from "../components/dashboard/StatCard"
import { useStats } from "../hooks/useStats"
import { useAuth } from "../context/AuthContext"
 
export default function DashboardPage() {
  const { stats } = useStats()
  const { user } = useAuth()
  const firstName = user?.email?.split("@")[0]
 
  return (
    <AppShell>
      <div className="px-10 py-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-bold text-white">Hola, {firstName} 👋</h1>
          <p className="text-sm text-white/40 mt-1.5">Este es el resumen de tu actividad reciente.</p>
        </motion.div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total conversaciones" value={stats.total_conversations} icon={TrendingUp} />
          <StatCard label="Abiertas" value={stats.open} icon={MessagesSquare} accent="text-emerald-300" />
          <StatCard label="Contactadas" value={stats.contacted} icon={CheckCircle2} accent="text-amber-300" />
          <StatCard label="Cerradas" value={stats.closed} icon={Archive} accent="text-white/70" />
        </div>
      </div>
    </AppShell>
  )
}