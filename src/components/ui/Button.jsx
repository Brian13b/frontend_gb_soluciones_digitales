import { motion } from "framer-motion"
 
const variants = {
  primary: "bg-gb-500 text-white hover:bg-gb-400 shadow-glow",
  secondary: "bg-white/5 text-white/80 hover:bg-white/10 border border-white/10",
  ghost: "text-white/60 hover:text-white hover:bg-white/5",
  danger: "bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/20",
}
 
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  }
 
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  )
}