import { motion } from "framer-motion"
import Card from "../ui/Card"
 
export default function StatCard({ label, value, icon: Icon, accent = "text-white" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-white/40 mb-2">{label}</p>
            <p className={`text-3xl font-bold ${accent}`}>{value}</p>
          </div>
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Icon size={18} className="text-white/50" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}