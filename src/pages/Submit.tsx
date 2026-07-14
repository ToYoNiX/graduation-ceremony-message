import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { submitMessage } from '../lib/supabase'
import { Card, Input, Textarea, Button, Label, ErrorText } from '../components/ui'

const MIN_CODE = 4

export default function Submit() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [doneId, setDoneId] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (code.length < MIN_CODE) {
      setError(`Secret code must be at least ${MIN_CODE} characters.`)
      return
    }
    setBusy(true)
    try {
      const id = await submitMessage(name, message, code)
      setDoneId(id)
    } catch (err) {
      setError((err as Error).message ?? 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  if (doneId) {
    return (
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="text-6xl">🎉</div>
        <h1 className="text-2xl font-bold">Your message is saved!</h1>
        <Card className="text-left">
          <p className="text-slate-300">
            Share this secret code with your family so they can unlock it:
          </p>
          <p className="mt-3 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3 text-center text-2xl font-bold tracking-wider text-indigo-200">
            {code}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            ⚠️ Keep this code safe — you’ll also need it to edit or delete your
            message later. We can’t recover it for you.
          </p>
        </Card>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button variant="ghost">← Back to list</Button>
          </Link>
          <Link to={`/message/${doneId}`}>
            <Button>Try unlocking it →</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <div className="text-5xl">✍️</div>
        <h1 className="mt-3 text-2xl font-bold">Write your secret message</h1>
        <p className="mt-2 text-slate-400">
          Your family will search your name and enter your code to read it.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Already submitted?{' '}
          <Link to="/manage" className="text-indigo-300 hover:underline">
            Edit or delete your message
          </Link>
        </p>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Your name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sara Ahmed"
              maxLength={100}
              required
            />
          </div>
          <div>
            <Label>Your message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something your family will treasure…"
              maxLength={2000}
              required
            />
            <p className="mt-1 text-right text-xs text-slate-500">
              {message.length}/2000
            </p>
          </div>
          <div>
            <Label>Secret code</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`At least ${MIN_CODE} characters`}
            />
            <p className="mt-1 text-xs text-slate-500">
              Your family needs this to unlock the message. Choose something
              they’ll know but others won’t.
            </p>
          </div>
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Saving…' : 'Save my message'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
