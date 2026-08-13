'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { generateRoomCode } from '@/lib/room/utils'

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!dbUser || dbUser.role !== 'ADMIN') return null
  return dbUser
}

export async function createRoomAction(prevState: unknown, formData: FormData) {
  const admin = await getAdminUser()
  if (!admin) return { error: 'Unauthorized' }

  const typingDuration = parseInt(formData.get('typingDuration') as string) || 60
  const quizDuration = parseInt(formData.get('quizDuration') as string) || 900

  let roomCode = ''
  for (let i = 0; i < 10; i++) {
    const candidate = generateRoomCode()
    const existing = await prisma.room.findUnique({ where: { roomCode: candidate } })
    if (!existing) { roomCode = candidate; break }
  }
  if (!roomCode) return { error: 'Could not generate room code. Try again.' }

  const room = await prisma.room.create({
    data: { roomCode, typingDuration, quizDuration, createdById: admin.id },
  })

  revalidatePath('/admin')
  return { success: true, roomCode: room.roomCode }
}

export async function startActivityAction(roomCode: string) {
  const admin = await getAdminUser()
  if (!admin) return { error: 'Unauthorized' }

  await prisma.room.update({
    where: { roomCode },
    data: { status: 'ACTIVE', startedAt: new Date() },
  })
  revalidatePath('/admin')
  return { success: true }
}

export async function closeRoomAction(roomCode: string) {
  const admin = await getAdminUser()
  if (!admin) return { error: 'Unauthorized' }

  const room = await prisma.room.findUnique({ where: { roomCode } })
  if (!room) return { error: 'Room not found' }

  await prisma.roomParticipant.updateMany({
    where: { roomId: room.id, status: { notIn: ['COMPLETED'] } },
    data: { status: 'LEFT' },
  })

  await prisma.room.update({
    where: { roomCode },
    data: { status: 'CLOSED', endedAt: new Date(), allowJoining: false },
  })
  revalidatePath('/admin')
  return { success: true }
}

export async function toggleJoiningAction(roomCode: string, allow: boolean) {
  const admin = await getAdminUser()
  if (!admin) return { error: 'Unauthorized' }

  await prisma.room.update({ where: { roomCode }, data: { allowJoining: allow } })
  revalidatePath('/admin')
  return { success: true }
}
