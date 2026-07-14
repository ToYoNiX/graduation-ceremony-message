import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { listNames, revealMessage, updateMessage, deleteMessage } from '../lib/supabase'
import { Card, Input, Textarea, Button, Label, ErrorText } from '../components/ui'

export default function Manage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    listNames()
      .then((list) => setName(list.find((n) => n.id === id)?.name ?? '—'))
      .catch(() => setName('—'))
  }, [id])

  // Step 1: verify the code by revealing the current message.
  async function onUnlock(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const msg = await revealMessage(id, code)
      setMessage(msg)
      setUnlocked(true)
    } catch (err) {
      setError((err as Error).message ?? 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  async function onSave() {
    setError('')
    setSaved(false)
    setBusy(true)
    try {
      await updateMessage(id, code, message)
      setSaved(true)
    } catch (err) {
      setError((err as Error).message ?? 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  async function onDelete() {
    setError('')
    setBusy(true)
    try {
      await deleteMessage(id, code)
      navigate('/')
    } catch (err) {
      setError((err as Error).message ?? 'Something went wrong.')
      setBusy(false)
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <div className="text-5xl">🔧</div>
          <h1 className="mt-3 text-2xl font-bold">Edit / delete</h1>
          <p className="mt-2 text-slate-400">
            Enter the secret code for{' '}
            <span dir="auto" className="font-medium">{name}</span>’s message.
          </p>
        </div>
        <Card>
          <form onSubmit={onUnlock} className="space-y-4">
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
              {busy ? 'Checking…' : 'Unlock'}
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Editing <span dir="auto">{name}</span>’s message
        </h1>
      </div>
      <Card>
        <div className="space-y-4">
          <div>
            <Label>Your message</Label>
            <Textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                setSaved(false)
              }}
              maxLength={2000}
            />
            <p className="mt-1 text-right text-xs text-slate-500">
              {message.length}/2000
            </p>
          </div>
          {error && <ErrorText>{error}</ErrorText>}
          {saved && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              ✅ Saved!
            </p>
          )}
          <Button onClick={onSave} disabled={busy || !message.trim()} className="w-full">
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </Card>

      <Card className="border-rose-500/20">
        {!confirmDelete ? (
          <Button variant="ghost" onClick={() => setConfirmDelete(true)} className="w-full">
            🗑️ Delete this message
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm text-slate-300">
              Are you sure? This can’t be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setConfirmDelete(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" onClick={onDelete} disabled={busy} className="flex-1">
                {busy ? 'Deleting…' : 'Yes, delete'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className="text-center">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-300">
          ← Back to list
        </Link>
      </div>
    </div>
  )
}
