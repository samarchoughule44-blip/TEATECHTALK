'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { generateRoomCode } from '@/lib/room/utils'

async function getAdminUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) return null

    // Try finding user in database by email (case-insensitive fallback)
    const dbUser = await prisma.user.findFirst({
      where: { email: { equals: user.email, mode: 'insensitive' } },
    })

    if (dbUser) {
      if (dbUser.role !== 'ADMIN') return null
      return dbUser
    }

    // Fallback: If user is authenticated via Supabase as admin (e.g. metadata or admin email)
    const isSupabaseAdmin = user.user_metadata?.role === 'ADMIN' || user.email.toLowerCase().includes('admin')
    if (isSupabaseAdmin) {
      return { id: user.id, name: user.user_metadata?.name || 'Admin', email: user.email, role: 'ADMIN' }
    }

    return null
  } catch (err) {
    console.error('[getAdminUser Error]', err)
    return null
  }
}

export async function createRoomAction(prevState: unknown, formData: FormData) {
  try {
    const admin = await getAdminUser()
    if (!admin) return { error: 'Unauthorized: Admin privileges required' }

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
  } catch (err: any) {
    console.error('[createRoomAction Error]', err)
    return { error: err?.message || 'Failed to create room' }
  }
}

export async function startActivityAction(roomCode: string) {
  try {
    const admin = await getAdminUser()
    if (!admin) return { error: 'Unauthorized: Admin privileges required' }

    await prisma.room.update({
      where: { roomCode },
      data: { status: 'ACTIVE', startedAt: new Date() },
    })
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    console.error('[startActivityAction Error]', err)
    return { error: err?.message || 'Failed to start activity' }
  }
}

export async function closeRoomAction(roomCode: string) {
  try {
    const admin = await getAdminUser()
    if (!admin) return { error: 'Unauthorized: Admin privileges required' }

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
  } catch (err: any) {
    console.error('[closeRoomAction Error]', err)
    return { error: err?.message || 'Failed to close room' }
  }
}

export async function toggleJoiningAction(roomCode: string, allow: boolean) {
  try {
    const admin = await getAdminUser()
    if (!admin) return { error: 'Unauthorized: Admin privileges required' }

    await prisma.room.update({ where: { roomCode }, data: { allowJoining: allow } })
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    console.error('[toggleJoiningAction Error]', err)
    return { error: err?.message || 'Failed to toggle joining status' }
  }
}
