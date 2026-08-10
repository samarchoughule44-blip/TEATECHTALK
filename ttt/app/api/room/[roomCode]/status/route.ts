import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params

  const room = await prisma.room.findUnique({
    where: { roomCode },
    select: {
      id: true,
      roomCode: true,
      status: true,
      allowJoining: true,
      typingDuration: true,
      quizDuration: true,
      startedAt: true,
      _count: { select: { participants: true } },
    },
  })

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...room,
    count: room._count.participants,
  })
}
