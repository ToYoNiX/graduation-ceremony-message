import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { listNames, revealMessage } from '../lib/supabase'
import { Card, Input, Button, Label, ErrorText } from '../components/ui'

export default function Reveal() {
  const { id = '' } = useParams()
  const [name, setName] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Look up the name (public) so the page shows who this message is for.
  useEffect(() => {
    listNames()
      .then((list) => setName(list.find((n) => n.id === id)?.name ?? '—'))
      .catch(() => setName('—'))
  }, [id])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const msg = await revealMessage(id, code)
      setMessage(msg)
    } catch (err) {
      setError((err as Error).message ?? 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  if (message !== null) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-indigo-300">
            A message from
          </p>
          <h1 dir="auto" className="mt-1 text-3xl font-bold">{name}</h1>
        </div>
        <Card className="bg-gradient-to-br from-indigo-500/10 to-pink-500/10">
          <p dir="auto" className="whitespace-pre-wrap text-lg leading-relaxed">{message}</p>
        </Card>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button variant="ghost">← Back to list</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <div className="text-5xl">🔒</div>
        <h1 dir="auto" className="mt-3 text-2xl font-bold">{name ?? 'Loading…'}</h1>
        <p className="mt-2 text-slate-400">
          Enter the secret code to reveal this message.
        </p>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Secret code</Label>
            <Input
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code…"
            />
          </div>
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" disabled={busy || !code} className="w-full">
            {busy ? 'Checking…' : '✨ Reveal message'}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-slate-500">
        This is your message?{' '}
        <Link to={`/manage/${id}`} className="text-indigo-300 hover:underline">
          Edit or delete it
        </Link>
      </p>
    </div>
  )
}
