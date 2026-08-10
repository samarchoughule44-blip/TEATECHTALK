import { prisma } from '@/lib/prisma'
import type { RoomStatus, ParticipantStatus } from '@/src/generated/prisma'


export interface RoomWithParticipants {
  id: string
  roomCode: string
  status: RoomStatus
  allowJoining: boolean
  typingDuration: number
  quizDuration: number
  typingWeight: number
  quizWeight: number
  maxScore: number
  createdAt: Date
  startedAt: Date | null
  endedAt: Date | null
  participants: ParticipantRow[]
}

export interface ParticipantRow {
  id: string
  name: string
  participantCode: string
  status: ParticipantStatus
  joinedAt: Date
  completedAt: Date | null
  finalResult: { finalScore: number; typingScore: number; quizScore: number; rank: number | null } | null
  typingResult: { wpm: number; accuracy: number; score: number } | null
  quizResult: { correctAnswers: number; score: number } | null
}

// Get room by code with participants
export async function getRoomByCode(roomCode: string): Promise<RoomWithParticipants | null> {
  const room = await prisma.room.findUnique({
    where: { roomCode },
    include: {
      participants: {
        orderBy: { joinedAt: 'asc' },
        include: {
          finalResult: {
            select: { finalScore: true, typingScore: true, quizScore: true, rank: true },
          },
          typingResult: {
            select: { wpm: true, accuracy: true, score: true },
          },
          quizResult: {
            select: { correctAnswers: true, score: true },
          },
        },
      },
    },
  })
  return room as RoomWithParticipants | null
}

// Get participant by session token
export async function getParticipantByToken(sessionToken: string) {
  return prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: {
      room: true,
      typingResult: true,
      quizResult: true,
      finalResult: true,
    },
  })
}

// Get leaderboard for a room
export async function getRoomLeaderboard(roomId: string) {
  return prisma.roomFinalResult.findMany({
    where: { roomId },
    orderBy: [
      { finalScore: 'desc' },
      { completedAt: 'asc' },
    ],
    include: {
      participant: {
        select: { name: true, participantCode: true, status: true },
      },
      room: {
        select: { roomCode: true },
      },
    },
  })
}

// Get quiz questions (random 10 for a test session)
export async function getQuizQuestions(count = 10) {
  const all = await prisma.roomQuizQuestion.findMany()
  // Shuffle and pick `count`
  const shuffled = all.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Update participant last seen
export async function updateParticipantLastSeen(participantId: string) {
  await prisma.roomParticipant.update({
    where: { id: participantId },
    data: { lastSeenAt: new Date() },
  })
}

// Update participant status
export async function updateParticipantStatus(participantId: string, status: ParticipantStatus) {
  return prisma.roomParticipant.update({
    where: { id: participantId },
    data: { status },
  })
}
