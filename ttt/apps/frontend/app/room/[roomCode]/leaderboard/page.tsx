import { notFound } from 'next/navigation'
import { RoomLeaderboardClient } from '@/components/room/RoomLeaderboardClient'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

interface Props {
  params: Promise<{ roomCode: string }>
}

export async function generateMetadata({ params }: Props) {
  const { roomCode } = await params
  return { title: `Leaderboard — ${roomCode} | Tea Tech Talks` }
}

export default async function RoomLeaderboardPage({ params }: Props) {
  const { roomCode } = await params

  // Fetch room status
  const statusRes = await fetch(`${BACKEND_URL}/api/room/${roomCode}/status`, { cache: 'no-store' })
  if (!statusRes.ok) notFound()
  const room = await statusRes.json()

  // Fetch leaderboard results
  const lbRes = await fetch(`${BACKEND_URL}/api/room/${roomCode}/leaderboard`, { cache: 'no-store' })
  const lbData = lbRes.ok ? await lbRes.json() : { results: [] }

  return (
    <RoomLeaderboardClient
      roomCode={roomCode}
      roomId={room.id}
      roomStatus={room.status}
      initialResults={JSON.parse(JSON.stringify(lbData.results ?? []))}
    />
  )
}
