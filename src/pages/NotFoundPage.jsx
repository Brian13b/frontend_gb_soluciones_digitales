import { Link } from "react-router-dom"
 
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-charcoal-950 text-center px-4">
      <p className="text-6xl font-bold text-white/10 mb-4">404</p>
      <p className="text-sm text-white/50 mb-6">Esta página no existe.</p>
      <Link to="/" className="text-sm text-gb-400 hover:text-gb-300 transition-colors">
        Volver al inicio
      </Link>
    </div>
  )
}