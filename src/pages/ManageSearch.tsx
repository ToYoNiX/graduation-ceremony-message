import { Link } from 'react-router-dom'
import NameSearch from '../components/NameSearch'

export default function ManageSearch() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <div className="text-5xl">🔧</div>
        <h1 className="mt-3 text-2xl font-bold">Edit or delete your message</h1>
        <p className="mt-2 text-slate-400">
          Find your name below, then enter your secret code to make changes.
        </p>
      </div>

      <NameSearch linkBase="/manage" actionLabel="✏️ edit →" placeholder="Search your name…" />

      <p className="text-center text-sm text-slate-500">
        Haven’t written one yet?{' '}
        <Link to="/submit" className="text-indigo-300 hover:underline">
          Write your message
        </Link>
      </p>
    </div>
  )
}
