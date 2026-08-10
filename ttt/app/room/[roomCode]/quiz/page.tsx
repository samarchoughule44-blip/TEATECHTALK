import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { QuizClient } from '@/components/room/QuizClient'

interface Props {
  params: Promise<{ roomCode: string }>
}

export default async function QuizPage({ params }: Props) {
  const { roomCode } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value

  if (!sessionToken) redirect('/join')

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: { room: true, typingResult: true, quizResult: true },
  })

  if (!participant) redirect('/join')
  if (participant.room.roomCode !== roomCode) redirect('/join')
  if (participant.room.status !== 'ACTIVE') redirect(`/room/${roomCode}/waiting`)
  if (!participant.typingResult) redirect(`/room/${roomCode}/typing`)
  if (participant.status === 'COMPLETED') redirect(`/room/${roomCode}/completed`)
  if (participant.quizResult) redirect(`/room/${roomCode}/completed`)

  // Fetch quiz questions (fixed set for this room — use seed order)
  const questions = await prisma.roomQuizQuestion.findMany({
    take: 10,
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      question: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
      category: true,
      difficulty: true,
    },
  })

  return (
    <QuizClient
      roomCode={roomCode}
      roomId={participant.room.id}
      participantId={participant.id}
      participantName={participant.name}
      questions={questions}
      duration={participant.room.quizDuration}
    />
  )
}
