import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { TypingTestClient } from '@/components/room/TypingTestClient'
import { PASSAGES } from '@/lib/passages'

interface Props {
  params: Promise<{ roomCode: string }>
}

export default async function TypingTestPage({ params }: Props) {
  const { roomCode } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value

  if (!sessionToken) redirect('/join')

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: { room: true, typingResult: true },
  })

  if (!participant) redirect('/join')
  if (participant.room.roomCode !== roomCode) redirect('/join')
  if (participant.room.status !== 'ACTIVE') redirect(`/room/${roomCode}/waiting`)

  // If already completed typing, go to quiz
  if (participant.typingResult) redirect(`/room/${roomCode}/quiz`)
  if (participant.status === 'COMPLETED') redirect(`/room/${roomCode}/completed`)

  // Pick a deterministic passage for this participant (based on ID hash)
  const hash = participant.id.charCodeAt(0) + participant.id.charCodeAt(participant.id.length - 1)
  const passageIndex = hash % PASSAGES.length
  const passage = PASSAGES[passageIndex]

  return (
    <TypingTestClient
      roomCode={roomCode}
      roomId={participant.room.id}
      participantId={participant.id}
      participantName={participant.name}
      passage={passage}
      duration={participant.room.typingDuration}
    />
  )
}
