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
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate("/")
  }
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-950 px-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gb-600/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gb-500/10 rounded-full blur-[120px]" />
 
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="glass-strong relative w-full max-w-sm rounded-2xl p-8 shadow-soft"
      >
        <div className="mb-8 text-center">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gb-400 to-gb-700 shadow-glow mx-auto mb-5" />
          <h1 className="text-xl font-bold text-white">GB Soluciones</h1>
          <p className="text-sm text-white/40 mt-1">Panel administrativo</p>
        </div>
 
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
 
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5"
            >
              {error}
            </motion.p>
          )}
 
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}