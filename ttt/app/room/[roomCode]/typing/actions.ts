'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { calculateTypingScore, calculateFinalScore } from '@/lib/scoring/calculate'
import { redirect } from 'next/navigation'

export interface TypingSubmitInput {
  wpm: number
  accuracy: number
  errors: number
  correctChars: number
  totalChars: number
}

export async function submitTypingResult(data: TypingSubmitInput) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value
  if (!sessionToken) return { error: 'Not authenticated' }

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: { room: true, typingResult: true },
  })

  if (!participant) return { error: 'Session not found' }
  if (participant.room.status !== 'ACTIVE') return { error: 'Room is not active' }
  if (participant.typingResult) return { error: 'Typing result already submitted' }

  // Validate inputs
  const wpm = Math.max(0, Math.min(300, data.wpm))
  const accuracy = Math.max(0, Math.min(100, data.accuracy))
  const errors = Math.max(0, data.errors)
  const correctChars = Math.max(0, data.correctChars)
  const totalChars = Math.max(0, data.totalChars)

  // Calculate score server-side
  const score = calculateTypingScore({
    wpm,
    accuracy,
    typingWeight: participant.room.typingWeight,
    maxScore: participant.room.maxScore,
  })

  // Save typing result
  await prisma.roomTypingResult.create({
    data: {
      roomId: participant.roomId,
      participantId: participant.id,
      wpm,
      accuracy,
      errors,
      correctChars,
      totalChars,
      score,
    },
  })

  // Update participant status
  await prisma.roomParticipant.update({
    where: { id: participant.id },
    data: { status: 'TYPING_DONE' },
  })

  return { success: true, score, participantId: participant.id, roomCode: participant.room.roomCode }
}
