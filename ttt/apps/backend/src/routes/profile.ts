import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

/**
 * GET /api/profile?participantCode=<code>
 * Fetch room activity data for a participant (matched by their college roll no / participantCode).
 */
router.get('/', async (req: Request, res: Response) => {
  const participantCode = req.query.participantCode as string
  if (!participantCode || participantCode === 'N/A') {
    res.json({ roomActivities: [] })
    return
  }

  const roomParticipants = await prisma.roomParticipant.findMany({
    where: {
      participantCode,
      finalResult: { isNot: null },
    },
    include: {
      finalResult: true,
      typingResult: { select: { wpm: true, accuracy: true } },
      room: { select: { roomCode: true } },
    },
    orderBy: { completedAt: 'desc' },
  })

  const roomActivities = roomParticipants
    .filter((p) => p.finalResult)
    .map((p) => ({
      id: p.finalResult!.id,
      finalScore: p.finalResult!.finalScore,
      typingScore: p.finalResult!.typingScore,
      quizScore: p.finalResult!.quizScore,
      completedAt: p.finalResult!.completedAt,
      roomCode: p.room.roomCode,
      participantName: p.name,
      wpm: p.typingResult?.wpm ?? null,
      accuracy: p.typingResult?.accuracy ?? null,
    }))

  res.json({ roomActivities })
})

export default router
