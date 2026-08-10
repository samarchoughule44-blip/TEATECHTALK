'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function joinRoomAction(prevState: unknown, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const participantCode = (formData.get('participantCode') as string)?.trim().toUpperCase()
  const roomCode = (formData.get('roomCode') as string)?.trim().toUpperCase()

  // Validate required fields
  if (!name || !participantCode || !roomCode) {
    return { error: 'All fields are required.' }
  }
  if (name.length < 2 || name.length > 80) {
    return { error: 'Name must be between 2 and 80 characters.' }
  }
  if (participantCode.length < 2 || participantCode.length > 30) {
    return { error: 'Participant ID must be between 2 and 30 characters.' }
  }

  // Find the room
  const room = await prisma.room.findUnique({ where: { roomCode } })
  if (!room) {
    return { error: `Room "${roomCode}" does not exist. Please check the Room ID.` }
  }

  // Check room status
  if (room.status === 'CLOSED') {
    return { error: 'This room has been closed by the administrator.' }
  }
  if (room.status === 'COMPLETED') {
    return { error: 'This activity has already been completed.' }
  }
  if (!room.allowJoining) {
    return { error: 'The administrator has locked this room. New participants cannot join.' }
  }
  if (room.status === 'ACTIVE') {
    // Allow joining active rooms if allowJoining is still true
    // (late joiners go directly to typing test after waiting room)
  }

  // Check for duplicate participant ID in this room
  const existing = await prisma.roomParticipant.findUnique({
    where: { roomId_participantCode: { roomId: room.id, participantCode } },
  })

  let participant
  if (existing) {
    // Allow reconnection via session token
    if (existing.status === 'LEFT') {
      return { error: 'You have already left this room. Contact the administrator to re-join.' }
    }
    // Re-use existing participant record (reconnect)
    participant = existing
  } else {
    // Create new participant
    participant = await prisma.roomParticipant.create({
      data: {
        roomId: room.id,
        name,
        participantCode,
        status: 'JOINED',
      },
    })
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set('room_session', participant.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
    sameSite: 'lax',
  })

  redirect(`/room/${roomCode}/waiting`)
}
