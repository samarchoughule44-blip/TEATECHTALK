import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

/**
 * GET /api/admin/rooms
 * Admin: fetch recent rooms with participants and results.
 * NOTE: In production, protect this route with Supabase auth middleware.
 */
router.get('/rooms', async (_req: Request, res: Response) => {
  const rooms = await prisma.room.findMany({
    where: { status: { in: ['WAITING', 'ACTIVE', 'COMPLETED'] } },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      participants: {
        include: {
          finalResult: { select: { finalScore: true, typingScore: true, quizScore: true, rank: true } },
          typingResult: { select: { wpm: true, accuracy: true, score: true } },
          quizResult: { select: { correctAnswers: true, score: true } },
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })

  res.json({ rooms })
})

/**
 * GET /api/admin/user
 * Check if the authenticated Supabase user is an admin.
 * Body: { email: string }
 */
router.get('/user', async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string
    if (!email) {
      res.status(400).json({ error: 'email query param required' })
      return
    }

    const dbUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    })

    if (!dbUser) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ name: dbUser.name, role: dbUser.role })
  } catch (err) {
    console.error('Error fetching admin user:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
