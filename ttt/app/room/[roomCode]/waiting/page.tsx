import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { WaitingRoomClient } from '@/components/room/WaitingRoomClient'

interface Props {
  params: Promise<{ roomCode: string }>
}

export default async function WaitingRoomPage({ params }: Props) {
  const { roomCode } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value

  if (!sessionToken) redirect(`/join`)

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: { room: true },
  })

  if (!participant) redirect('/join')
  if (participant.room.roomCode !== roomCode) redirect('/join')

  // If room is already active and participant hasn't started typing yet
  if (participant.room.status === 'ACTIVE' && participant.status === 'JOINED') {
    redirect(`/room/${roomCode}/typing`)
  }

  // If participant already completed typing → quiz
  if (participant.status === 'TYPING_DONE') redirect(`/room/${roomCode}/quiz`)
  if (participant.status === 'COMPLETED') redirect(`/room/${roomCode}/completed`)

  return (
    <WaitingRoomClient
      roomCode={roomCode}
      roomId={participant.room.id}
      roomStatus={participant.room.status}
      participantName={participant.name}
      participantId={participant.id}
      typingDuration={participant.room.typingDuration}
    />
  )
}
