import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

/**
 * GET /api/session
 * Get the current participant session from the room_session cookie.
 */
router.get('/', async (req: Request, res: Response) => {
  const sessionToken = req.cookies?.room_session
  if (!sessionToken) {
    res.status(401).json({ error: 'No session' })
    return
  }

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: { room: true },
  })

  if (!participant) {
    res.status(401).json({ error: 'Session not found' })
    return
  }

  res.json({
    id: participant.id,
    name: participant.name,
    participantCode: participant.participantCode,
    status: participant.status,
    roomCode: participant.room.roomCode,
    roomId: participant.room.id,
    roomStatus: participant.room.status,
    typingDuration: participant.room.typingDuration,
    quizDuration: participant.room.quizDuration,
  })
})

export default router
