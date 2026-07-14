import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listNames, type GraduateName } from '../lib/supabase'
import { Input, ErrorText } from './ui'

type Props = {
  /** Route prefix each result links to, e.g. "/message" or "/manage". */
  linkBase: string
  /** Small call-to-action shown on the right of each row. */
  actionLabel: string
  /** Placeholder for the search box. */
  placeholder?: string
}

/** Shared searchable list of graduate names (content stays hidden). */
export default function NameSearch({ linkBase, actionLabel, placeholder = 'Search by name…' }: Props) {
  const [names, setNames] = useState<GraduateName[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listNames()
      .then(setNames)
      .catch((e) => setError(e.message ?? 'Could not load the list.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return names
    return names.filter((n) => n.name.toLowerCase().includes(q))
  }, [names, query])

  return (
    <div className="space-y-4">
      <Input
        autoFocus
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <ErrorText>{error}</ErrorText>}

      {loading ? (
        <p className="py-10 text-center text-slate-500">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-slate-500">
          {names.length === 0
            ? 'No messages yet.'
            : 'No graduates match that search.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((n) => (
            <li key={n.id}>
              <Link
                to={`${linkBase}/${n.id}`}
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-indigo-400/50 hover:bg-white/[0.07]"
              >
                <span dir="auto" className="font-medium">{n.name}</span>
                <span className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-indigo-300">
                  {actionLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
