import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// GET /api/room/:roomCode/status
router.get('/:roomCode/status', async (req: Request, res: Response) => {
  const { roomCode } = req.params

  const room = await prisma.room.findUnique({
    where: { roomCode },
    select: {
      id: true,
      roomCode: true,
      status: true,
      allowJoining: true,
      typingDuration: true,
      quizDuration: true,
      startedAt: true,
      _count: { select: { participants: true } },
    },
  })

  if (!room) {
    res.status(404).json({ error: 'Room not found' })
    return
  }

  res.json({ ...room, count: room._count.participants })
})

// GET /api/room/:roomCode/participants
router.get('/:roomCode/participants', async (req: Request, res: Response) => {
  const { roomCode } = req.params

  const room = await prisma.room.findUnique({
    where: { roomCode },
    include: {
      participants: {
        select: {
          id: true,
          name: true,
          participantCode: true,
          status: true,
          joinedAt: true,
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })

  if (!room) {
    res.status(404).json({ error: 'Room not found' })
    return
  }

  res.json({ count: room.participants.length, participants: room.participants })
})

// GET /api/room/:roomCode/leaderboard
router.get('/:roomCode/leaderboard', async (req: Request, res: Response) => {
  const { roomCode } = req.params

  const room = await prisma.room.findUnique({ where: { roomCode } })
  if (!room) {
    res.status(404).json({ error: 'Room not found' })
    return
  }

  const results = await prisma.roomFinalResult.findMany({
    where: { roomId: room.id },
    orderBy: [{ finalScore: 'desc' }, { completedAt: 'asc' }],
    include: {
      participant: {
        select: { name: true, participantCode: true, status: true, completedAt: true },
      },
    },
  })

  const enriched = await Promise.all(
    results.map(async (r) => {
      const typing = await prisma.roomTypingResult.findUnique({
        where: { participantId: r.participantId },
        select: { wpm: true, accuracy: true },
      })
      const quiz = await prisma.roomQuizResult.findUnique({
        where: { participantId: r.participantId },
        select: { correctAnswers: true, totalQuestions: true },
      })
      return { ...r, typing, quiz }
    })
  )

  res.json({ results: enriched })
})

// POST /api/room/:roomCode/ping
router.post('/:roomCode/ping', async (req: Request, res: Response) => {
  const sessionToken = req.cookies?.room_session
  if (!sessionToken) {
    res.status(401).json({ ok: false })
    return
  }

  await prisma.roomParticipant
    .update({
      where: { sessionToken },
      data: { lastSeenAt: new Date() },
    })
    .catch(() => {})

  res.json({ ok: true })
})

export default router
