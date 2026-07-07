import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"

export default function Toast({ type = "info", message, actionLabel, onAction, duration = 3500 }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => setVisible(false), duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-300",
      accentColor: "bg-green-500/20 hover:bg-green-500/30",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      textColor: "text-red-300",
      accentColor: "bg-red-500/20 hover:bg-red-500/30",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-300",
      accentColor: "bg-blue-500/20 hover:bg-blue-500/30",
    },
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, x: 16 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 8, x: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className={`fixed bottom-6 right-6 z-50 max-w-sm ${config.bgColor} ${config.borderColor} border rounded-lg shadow-soft backdrop-blur-sm p-4`}
        >
          <div className="flex items-start gap-3">
            <IconComponent size={20} className={`flex-shrink-0 mt-0.5 ${config.textColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 break-words">{message}</p>
              {actionLabel && (
                <button
                  onClick={() => {
                    onAction?.()
                    setVisible(false)
                  }}
                  className={`mt-2 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${config.accentColor} ${config.textColor}`}
                >
                  {actionLabel}
                </button>
              )}
            </div>
            <button
              onClick={() => setVisible(false)}
              className="flex-shrink-0 text-white/40 hover:text-white/80 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
