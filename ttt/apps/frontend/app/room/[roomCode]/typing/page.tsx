import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { TypingTestClient } from '@/components/room/TypingTestClient'
import { PASSAGES } from '@/lib/passages'
import { getSession } from '@/lib/api'

interface Props {
  params: Promise<{ roomCode: string }>
}

export default async function TypingTestPage({ params }: Props) {
  const { roomCode } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value

  if (!sessionToken) redirect('/join')

  const session = await getSession(`room_session=${sessionToken}`)

  if (!session) redirect('/join')
  if (session.roomCode !== roomCode) redirect('/join')
  if (session.roomStatus !== 'ACTIVE') redirect(`/room/${roomCode}/waiting`)
  if (session.status === 'TYPING_DONE') redirect(`/room/${roomCode}/quiz`)
  if (session.status === 'COMPLETED') redirect(`/room/${roomCode}/completed`)

  // Pick a deterministic passage for this participant (based on ID hash)
  const hash = session.id.charCodeAt(0) + session.id.charCodeAt(session.id.length - 1)
  const passageIndex = hash % PASSAGES.length
  const passage = PASSAGES[passageIndex]

  return (
    <TypingTestClient
      roomCode={roomCode}
      roomId={session.roomId}
      participantId={session.id}
      participantName={session.name}
      passage={passage}
      duration={session.typingDuration}
    />
  )
}
