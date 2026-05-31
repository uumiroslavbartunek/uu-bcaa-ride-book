import { Link, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            RideBook
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
