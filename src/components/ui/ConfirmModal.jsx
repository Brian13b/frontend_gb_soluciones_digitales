import { motion } from "framer-motion"
import Modal from "./Modal"
import Button from "./Button"

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  isOpen,
}) {
  return (
    <Modal open={isOpen} onClose={onCancel} title={title}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-white/80 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="md"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </motion.div>
    </Modal>
  )
}
