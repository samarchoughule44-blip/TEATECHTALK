import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { QuizClient } from '@/components/room/QuizClient'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

interface Props {
  params: Promise<{ roomCode: string }>
}

export default async function QuizPage({ params }: Props) {
  const { roomCode } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value

  if (!sessionToken) redirect('/join')

  const res = await fetch(`${BACKEND_URL}/api/quiz/questions`, {
    headers: { Cookie: `room_session=${sessionToken}` },
    cache: 'no-store',
  })

  if (res.status === 401) redirect('/join')

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    // Redirect based on error context
    if (data.error === 'Complete the typing test first') redirect(`/room/${roomCode}/typing`)
    if (data.error === 'Quiz already submitted') redirect(`/room/${roomCode}/completed`)
    redirect(`/room/${roomCode}/waiting`)
  }

  const data = await res.json()

  if (data.roomCode !== roomCode) redirect('/join')

  return (
    <QuizClient
      roomCode={roomCode}
      roomId={data.roomId}
      participantId={data.participantId}
      participantName={data.participantName}
      questions={data.questions}
      duration={data.duration}
    />
  )
}
