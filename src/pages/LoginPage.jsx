import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [focused, setFocused] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-950 px-4 sm:px-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-gb-500/20 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-gb-600/15 rounded-full blur-[140px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
        className="glass-strong relative w-full max-w-sm rounded-3xl p-8 sm:p-10 shadow-soft z-10 backdrop-blur-xl"
      >
        {/* Logo + Branding */}
        <div className="mb-10 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gb-400 to-gb-600 shadow-glow mx-auto mb-6 flex items-center justify-center overflow-hidden"
          >
            <img src="/logo-grande.jpeg" alt="GB" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white leading-tight">GB Soluciones Digitales</h1>
          <p className="text-sm text-white/50 mt-2">Panel administrativo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <motion.div
            animate={{
              scale: focused === "email" ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <label className="block">
              <span className="block mb-2.5 text-sm font-medium text-white/75">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-charcoal-900/60 border border-white/8
                  text-white placeholder-white/30 outline-none
                  focus:border-gb-500/60 focus:ring-2 focus:ring-gb-500/30 focus:bg-charcoal-900/80
                  transition-all duration-300 backdrop-blur-sm"
                required
              />
            </label>
          </motion.div>

          {/* Password Input */}
          <motion.div
            animate={{
              scale: focused === "password" ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <label className="block">
              <span className="block mb-2.5 text-sm font-medium text-white/75">Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl bg-charcoal-900/60 border border-white/8
                  text-white placeholder-white/30 outline-none
                  focus:border-gb-500/60 focus:ring-2 focus:ring-gb-500/30 focus:bg-charcoal-900/80
                  transition-all duration-300 backdrop-blur-sm"
                required
              />
            </label>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-xs text-red-300 bg-red-500/15 border border-red-500/30 rounded-2xl px-4 py-3 backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-5 py-3.5 rounded-2xl font-semibold text-white
              bg-gradient-to-r from-gb-500 to-gb-600 hover:from-gb-400 hover:to-gb-500
              shadow-[0_8px_32px_rgba(59,108,246,0.4)] hover:shadow-[0_12px_48px_rgba(59,108,246,0.5)]
              transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none
              uppercase tracking-wider text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Ingresando...
              </span>
            ) : (
              "Ingresar Ahora"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}