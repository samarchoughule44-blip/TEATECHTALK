'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateRoomCode } from '@/lib/room/utils'
import type { RoomStatus } from '@/src/generated/prisma'

// ── Admin: Create a new room ────────────────────────────────────────
export async function createRoom(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Verify admin role via DB
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || dbUser.role !== 'ADMIN') return { error: 'Unauthorized' }

  const typingDuration = parseInt(formData.get('typingDuration') as string) || 60
  const quizDuration = parseInt(formData.get('quizDuration') as string) || 900

  // Generate unique room code (retry up to 5 times)
  let roomCode = ''
  for (let i = 0; i < 5; i++) {
    const candidate = generateRoomCode()
    const existing = await prisma.room.findUnique({ where: { roomCode: candidate } })
    if (!existing) {
      roomCode = candidate
      break
    }
  }
  if (!roomCode) return { error: 'Could not generate unique room code. Try again.' }

  const room = await prisma.room.create({
    data: {
      roomCode,
      typingDuration,
      quizDuration,
      createdById: dbUser.id,
    },
  })

  revalidatePath('/admin')
  return { success: true, roomCode: room.roomCode, roomId: room.id }
}

// ── Admin: Start the activity ───────────────────────────────────────
export async function startActivity(roomCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || dbUser.role !== 'ADMIN') return { error: 'Unauthorized' }

  const room = await prisma.room.findUnique({ where: { roomCode } })
  if (!room) return { error: 'Room not found' }
  if (room.status !== 'WAITING') return { error: 'Room is not in waiting state' }

  await prisma.room.update({
    where: { roomCode },
    data: { status: 'ACTIVE', startedAt: new Date() },
  })

  revalidatePath('/admin')
  return { success: true }
}

// ── Admin: Close / end the room ─────────────────────────────────────
export async function closeRoom(roomCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || dbUser.role !== 'ADMIN') return { error: 'Unauthorized' }

  const room = await prisma.room.findUnique({ where: { roomCode } })
  if (!room) return { error: 'Room not found' }

  // Mark all non-completed participants as LEFT
  await prisma.roomParticipant.updateMany({
    where: {
      roomId: room.id,
      status: { notIn: ['COMPLETED'] },
    },
    data: { status: 'LEFT' },
  })

  await prisma.room.update({
    where: { roomCode },
    data: { status: 'CLOSED', endedAt: new Date(), allowJoining: false },
  })

  revalidatePath('/admin')
  return { success: true }
}

// ── Admin: Toggle participant joining ───────────────────────────────
export async function toggleJoining(roomCode: string, allow: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || dbUser.role !== 'ADMIN') return { error: 'Unauthorized' }

  await prisma.room.update({
    where: { roomCode },
    data: { allowJoining: allow },
  })

  revalidatePath('/admin')
  return { success: true }
}

// ── Admin: Get active rooms ─────────────────────────────────────────
export async function getAdminRooms(): Promise<{
  rooms: Array<{
    id: string
    roomCode: string
    status: RoomStatus
    allowJoining: boolean
    createdAt: Date
    startedAt: Date | null
    endedAt: Date | null
    typingDuration: number
    quizDuration: number
    _count: { participants: number }
  }>
}> {
  const rooms = await prisma.room.findMany({
    where: { status: { in: ['WAITING', 'ACTIVE'] } },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { participants: true } } },
  })
  return { rooms }
}
