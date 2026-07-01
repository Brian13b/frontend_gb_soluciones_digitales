import Sidebar from "./Sidebar"
 
export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-charcoal-950">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}