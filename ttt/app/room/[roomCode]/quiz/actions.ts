'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { gradeQuiz, calculateFinalScore } from '@/lib/scoring/calculate'

export async function submitQuizResult(answers: Record<string, string>, questionIds: string[], timeTakenSec: number) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value
  if (!sessionToken) return { error: 'Not authenticated' }

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: { room: true, typingResult: true, quizResult: true },
  })

  if (!participant) return { error: 'Session not found' }
  if (participant.room.status !== 'ACTIVE') return { error: 'Room is not active' }
  if (participant.quizResult) return { error: 'Quiz already submitted' }
  if (!participant.typingResult) return { error: 'Complete the typing test first' }

  // Fetch the actual questions from DB to grade server-side
  const questions = await prisma.roomQuizQuestion.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, correctOption: true },
  })

  const { correctAnswers, wrongAnswers, score: quizScore, totalQuestions } = gradeQuiz(
    questions,
    answers,
    participant.room.quizWeight,
    participant.room.maxScore,
  )

  // Save quiz result
  await prisma.roomQuizResult.create({
    data: {
      roomId: participant.roomId,
      participantId: participant.id,
      correctAnswers,
      wrongAnswers,
      totalQuestions,
      score: quizScore,
      timeTakenSec,
      answers: answers,
    },
  })

  // Calculate final score
  const typingScore = participant.typingResult.score
  const finalScore = calculateFinalScore(typingScore, quizScore)

  // Save final result
  const finalResult = await prisma.roomFinalResult.create({
    data: {
      roomId: participant.roomId,
      participantId: participant.id,
      typingScore,
      quizScore,
      finalScore,
    },
  })

  // Update participant status
  await prisma.roomParticipant.update({
    where: { id: participant.id },
    data: { status: 'COMPLETED', completedAt: new Date() },
  })

  // Recalculate ranks for all completed participants in this room
  const allFinals = await prisma.roomFinalResult.findMany({
    where: { roomId: participant.roomId },
    orderBy: [{ finalScore: 'desc' }, { completedAt: 'asc' }],
    include: { participant: { include: { typingResult: { select: { accuracy: true, wpm: true } } } } },
  })

  // Update ranks
  for (let i = 0; i < allFinals.length; i++) {
    await prisma.roomFinalResult.update({
      where: { id: allFinals[i].id },
      data: { rank: i + 1 },
    })
  }

  return {
    success: true,
    correctAnswers,
    wrongAnswers,
    totalQuestions,
    quizScore,
    typingScore,
    finalScore,
    roomCode: participant.room.roomCode,
  }
}
