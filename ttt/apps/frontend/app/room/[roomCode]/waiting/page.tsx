import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { WaitingRoomClient } from '@/components/room/WaitingRoomClient'
import { getSession } from '@/lib/api'

interface Props {
  params: Promise<{ roomCode: string }>
}

export default async function WaitingRoomPage({ params }: Props) {
  const { roomCode } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value

  if (!sessionToken) redirect('/join')

  const session = await getSession(`room_session=${sessionToken}`)

  if (!session) redirect('/join')
  if (session.roomCode !== roomCode) redirect('/join')

  // If room is already active and participant hasn't started typing yet
  if (session.roomStatus === 'ACTIVE' && session.status === 'JOINED') {
    redirect(`/room/${roomCode}/typing`)
  }

  // If participant already completed typing → quiz
  if (session.status === 'TYPING_DONE') redirect(`/room/${roomCode}/quiz`)
  if (session.status === 'COMPLETED') redirect(`/room/${roomCode}/completed`)

  return (
    <WaitingRoomClient
      roomCode={roomCode}
      roomId={session.roomId}
      roomStatus={session.roomStatus}
      participantName={session.name}
      participantId={session.id}
      typingDuration={session.typingDuration}
    />
  )
}
