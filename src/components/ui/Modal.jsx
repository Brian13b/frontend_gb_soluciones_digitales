import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
 
export default function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={`glass-strong w-full ${maxWidth} rounded-2xl shadow-soft`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}