import { Link, Outlet, useLocation } from 'react-router-dom'

export default function Layout() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(60rem_60rem_at_50%_-20%,rgba(99,102,241,0.25),transparent),radial-gradient(40rem_40rem_at_100%_120%,rgba(236,72,153,0.18),transparent)]">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="text-2xl">🎓</span>
            <span>Graduation Messages</span>
          </Link>
          {!onHome && (
            <Link
              to="/"
              className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300 transition hover:bg-white/5"
            >
              ← Home
            </Link>
          )}
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="mt-10 border-t border-white/5 pt-4 text-center text-xs text-slate-500">
          Made with love for our graduating class 💜
        </footer>
      </div>
    </div>
  )
}
