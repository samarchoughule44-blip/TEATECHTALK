import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { calculateTypingScore } from '../lib/scoring'

const router = Router()

/**
 * POST /api/typing/submit
 * Submit typing test results. Reads session from cookie.
 * Body: { wpm, accuracy, errors, correctChars, totalChars }
 */
router.post('/submit', async (req: Request, res: Response) => {
  const sessionToken = req.cookies?.room_session
  if (!sessionToken) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: { room: true, typingResult: true },
  })

  if (!participant) {
    res.status(401).json({ error: 'Session not found' })
    return
  }
  if (participant.room.status !== 'ACTIVE') {
    res.status(400).json({ error: 'Room is not active' })
    return
  }
  if (participant.typingResult) {
    res.status(400).json({ error: 'Typing result already submitted' })
    return
  }

  // Sanitize inputs
  const wpm = Math.max(0, Math.min(300, Number(req.body.wpm) || 0))
  const accuracy = Math.max(0, Math.min(100, Number(req.body.accuracy) || 0))
  const errors = Math.max(0, Number(req.body.errors) || 0)
  const correctChars = Math.max(0, Number(req.body.correctChars) || 0)
  const totalChars = Math.max(0, Number(req.body.totalChars) || 0)

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

  res.json({ success: true, score, participantId: participant.id, roomCode: participant.room.roomCode })
})

export default router
