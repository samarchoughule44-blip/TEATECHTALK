import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { gradeQuiz, calculateFinalScore } from '../lib/scoring'

const router = Router()

/**
 * GET /api/quiz/questions
 * Fetch quiz questions (no correct answers exposed). Reads session from cookie.
 */
router.get('/questions', async (req: Request, res: Response) => {
  const sessionToken = req.cookies?.room_session
  if (!sessionToken) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: { room: true, typingResult: true, quizResult: true },
  })

  if (!participant) {
    res.status(401).json({ error: 'Session not found' })
    return
  }
  if (participant.room.status !== 'ACTIVE') {
    res.status(403).json({ error: 'Room is not active' })
    return
  }
  if (!participant.typingResult) {
    res.status(403).json({ error: 'Complete the typing test first' })
    return
  }
  if (participant.quizResult) {
    res.status(403).json({ error: 'Quiz already submitted' })
    return
  }

  // Fetch questions without exposing correct answers
  const questions = await prisma.roomQuizQuestion.findMany({
    take: 10,
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      question: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
      category: true,
      difficulty: true,
      // NOTE: correctOption is intentionally excluded
    },
  })

  res.json({
    questions,
    duration: participant.room.quizDuration,
    roomCode: participant.room.roomCode,
    roomId: participant.room.id,
    participantId: participant.id,
    participantName: participant.name,
  })
})

/**
 * POST /api/quiz/submit
 * Submit quiz answers. Grades server-side and calculates final score.
 * Body: { answers: Record<string, string>, questionIds: string[], timeTakenSec: number }
 */
router.post('/submit', async (req: Request, res: Response) => {
  const sessionToken = req.cookies?.room_session
  if (!sessionToken) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: { room: true, typingResult: true, quizResult: true },
  })

  if (!participant) {
    res.status(401).json({ error: 'Session not found' })
    return
  }
  if (participant.room.status !== 'ACTIVE') {
    res.status(400).json({ error: 'Room is not active' })
    return
  }
  if (participant.quizResult) {
    res.status(400).json({ error: 'Quiz already submitted' })
    return
  }
  if (!participant.typingResult) {
    res.status(400).json({ error: 'Complete the typing test first' })
    return
  }

  const { answers, questionIds, timeTakenSec } = req.body

  // Fetch the actual questions from DB to grade server-side
  const questions = await prisma.roomQuizQuestion.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, correctOption: true },
  })

  const { correctAnswers, wrongAnswers, score: quizScore, totalQuestions } = gradeQuiz(
    questions,
    answers,
    participant.room.quizWeight,
    participant.room.maxScore
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
  await prisma.roomFinalResult.create({
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
  })

  // Update ranks
  for (let i = 0; i < allFinals.length; i++) {
    await prisma.roomFinalResult.update({
      where: { id: allFinals[i].id },
      data: { rank: i + 1 },
    })
  }

  res.json({
    success: true,
    correctAnswers,
    wrongAnswers,
    totalQuestions,
    quizScore,
    typingScore,
    finalScore,
    roomCode: participant.room.roomCode,
  })
})

export default router
