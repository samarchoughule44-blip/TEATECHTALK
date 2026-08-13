import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

/**
 * POST /api/join
 * Join a room. Creates or reconnects a participant and sets a session cookie.
 * Body: { name, participantCode, roomCode }
 */
router.post('/', async (req: Request, res: Response) => {
  const { name: rawName, participantCode: rawCode, roomCode: rawRoom } = req.body

  const name = rawName?.trim()
  const participantCode = rawCode?.trim().toUpperCase()
  const roomCode = rawRoom?.trim().toUpperCase()

  // Validate required fields
  if (!name || !participantCode || !roomCode) {
    res.status(400).json({ error: 'All fields are required.' })
    return
  }
  if (name.length < 2 || name.length > 80) {
    res.status(400).json({ error: 'Name must be between 2 and 80 characters.' })
    return
  }
  if (participantCode.length < 2 || participantCode.length > 30) {
    res.status(400).json({ error: 'Participant ID must be between 2 and 30 characters.' })
    return
  }

  // Find the room
  const room = await prisma.room.findUnique({ where: { roomCode } })
  if (!room) {
    res.status(404).json({ error: `Room "${roomCode}" does not exist. Please check the Room ID.` })
    return
  }

  // Check room status
  if (room.status === 'CLOSED') {
    res.status(403).json({ error: 'This room has been closed by the administrator.' })
    return
  }
  if (room.status === 'COMPLETED') {
    res.status(403).json({ error: 'This activity has already been completed.' })
    return
  }
  if (!room.allowJoining) {
    res.status(403).json({ error: 'The administrator has locked this room. New participants cannot join.' })
    return
  }

  // Check for duplicate participant ID in this room
  const existing = await prisma.roomParticipant.findUnique({
    where: { roomId_participantCode: { roomId: room.id, participantCode } },
  })

  let participant
  if (existing) {
    if (existing.status === 'LEFT') {
      res.status(403).json({ error: 'You have already left this room. Contact the administrator to re-join.' })
      return
    }
    // Re-use existing participant record (reconnect)
    participant = existing
  } else {
    // Create new participant
    participant = await prisma.roomParticipant.create({
      data: {
        roomId: room.id,
        name,
        participantCode,
        status: 'JOINED',
      },
    })
  }

  // Set session cookie (httpOnly)
  res.cookie('room_session', participant.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8 * 1000, // 8 hours in ms
    path: '/',
    sameSite: 'lax',
  })

  res.json({ success: true, roomCode })
})

export default router
