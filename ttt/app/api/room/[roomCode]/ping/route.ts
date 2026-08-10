import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value
  if (!sessionToken) return NextResponse.json({ ok: false }, { status: 401 })

  await prisma.roomParticipant.update({
    where: { sessionToken },
    data: { lastSeenAt: new Date() },
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
