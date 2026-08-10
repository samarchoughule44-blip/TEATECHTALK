import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params

  const room = await prisma.room.findUnique({
    where: { roomCode },
    include: {
      participants: {
        select: {
          id: true,
          name: true,
          participantCode: true,
          status: true,
          joinedAt: true,
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  }

  return NextResponse.json({
    count: room.participants.length,
    participants: room.participants,
  })
}
