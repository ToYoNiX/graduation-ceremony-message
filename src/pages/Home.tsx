import { Link } from 'react-router-dom'
import NameSearch from '../components/NameSearch'
import { Card, Button } from '../components/ui'

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find your graduate 🎉
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Search for a name, then enter the secret code your graduate gave you to
          unlock their message.
        </p>
      </div>

      <NameSearch linkBase="/message" actionLabel="🔒 unlock →" />

      <Card className="text-center">
        <p className="text-slate-300">Are you a graduate?</p>
        <Link to="/submit">
          <Button className="mt-3">✍️ Write your message</Button>
        </Link>
      </Card>
    </div>
  )
}
