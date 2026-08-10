import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { RoomLeaderboardClient } from '@/components/room/RoomLeaderboardClient'

interface Props {
  params: Promise<{ roomCode: string }>
}

export async function generateMetadata({ params }: Props) {
  const { roomCode } = await params
  return { title: `Leaderboard — ${roomCode} | Tea Tech Talks` }
}

export default async function RoomLeaderboardPage({ params }: Props) {
  const { roomCode } = await params

  const room = await prisma.room.findUnique({ where: { roomCode } })
  if (!room) notFound()

  const results = await prisma.roomFinalResult.findMany({
    where: { roomId: room.id },
    orderBy: [{ finalScore: 'desc' }, { completedAt: 'asc' }],
    include: {
      participant: {
        select: {
          name: true,
          participantCode: true,
          status: true,
          completedAt: true,
        },
      },
    },
  })

  // Fetch typing and quiz results for each
  const enriched = await Promise.all(
    results.map(async (r: typeof results[number]) => {
      const typing = await prisma.roomTypingResult.findUnique({
        where: { participantId: r.participantId },
        select: { wpm: true, accuracy: true },
      })
      const quiz = await prisma.roomQuizResult.findUnique({
        where: { participantId: r.participantId },
        select: { correctAnswers: true, totalQuestions: true },
      })
      return { ...r, typing, quiz }
    })
  )


  return (
    <RoomLeaderboardClient
      roomCode={roomCode}
      roomId={room.id}
      roomStatus={room.status}
      initialResults={JSON.parse(JSON.stringify(enriched))}
    />
  )
}
