import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

/**
 * GET /api/leaderboard
 * Global leaderboard — best score per participant across all rooms.
 */
router.get('/', async (_req: Request, res: Response) => {
  const allFinalResults = await prisma.roomFinalResult.findMany({
    include: {
      participant: {
        select: { name: true, participantCode: true },
      },
    },
    orderBy: { finalScore: 'desc' },
  })

  // Group by participantCode — pick highest score per person
  const byCode = new Map<string, {
    name: string
    participantCode: string
    bestScore: number
    totalScore: number
    roomCount: number
    bestTypingScore: number
    bestQuizScore: number
  }>()

  for (const r of allFinalResults) {
    const code = r.participant.participantCode
    const existing = byCode.get(code)
    if (!existing) {
      byCode.set(code, {
        name: r.participant.name,
        participantCode: code,
        bestScore: r.finalScore,
        totalScore: r.finalScore,
        roomCount: 1,
        bestTypingScore: r.typingScore,
        bestQuizScore: r.quizScore,
      })
    } else {
      existing.totalScore += r.finalScore
      existing.roomCount += 1
      if (r.finalScore > existing.bestScore) {
        existing.bestScore = r.finalScore
        existing.bestTypingScore = r.typingScore
        existing.bestQuizScore = r.quizScore
      }
      byCode.set(code, existing)
    }
  }

  const sorted = Array.from(byCode.values())
    .sort((a, b) => b.bestScore - a.bestScore || a.name.localeCompare(b.name))
    .map((u, i) => ({
      ...u,
      rank: i + 1,
      initials: u.name
        .split(' ')
        .map((w) => w[0] ?? '')
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    }))

  res.json({ leaderboard: sorted })
})

export default router
