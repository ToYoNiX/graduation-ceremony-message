import { useState } from 'react'
import { Link } from 'react-router-dom'
import NameSearch from '../components/NameSearch'
import { Card, Button, Modal } from '../components/ui'

// Lives in public/ and is served as-is; BASE_URL makes it resolve under the
// GitHub Pages project path (/graduation-ceremony-message/).
const VIDEO_SRC = `${import.meta.env.BASE_URL}graduation-video.mp4`

export default function Home() {
  const [showVideo, setShowVideo] = useState(false)

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
        <Button variant="ghost" className="mt-4" onClick={() => setShowVideo(true)}>
          🎬 Watch the video
        </Button>
      </div>

      <NameSearch linkBase="/message" actionLabel="🔒 unlock →" />

      <Card className="text-center">
        <p className="text-slate-300">Are you a graduate?</p>
        <Link to="/submit">
          <Button className="mt-3">✍️ Write your message</Button>
        </Link>
      </Card>

      <Modal open={showVideo} onClose={() => setShowVideo(false)}>
        <video
          src={VIDEO_SRC}
          controls
          autoPlay
          playsInline
          className="w-full rounded-xl"
        />
      </Modal>
    </div>
  )
}
