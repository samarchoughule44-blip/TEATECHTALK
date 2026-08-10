import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params

  const room = await prisma.room.findUnique({ where: { roomCode } })
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

  const results = await prisma.roomFinalResult.findMany({
    where: { roomId: room.id },
    orderBy: [{ finalScore: 'desc' }, { completedAt: 'asc' }],
    include: {
      participant: {
        select: { name: true, participantCode: true, status: true, completedAt: true },
      },
    },
  })

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

  return NextResponse.json({ results: enriched })
}
