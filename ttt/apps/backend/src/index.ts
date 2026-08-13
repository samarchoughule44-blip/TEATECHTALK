import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import roomRouter from './routes/room'
import joinRouter from './routes/join'
import sessionRouter from './routes/session'
import typingRouter from './routes/typing'
import quizRouter from './routes/quiz'
import leaderboardRouter from './routes/leaderboard'
import adminRouter from './routes/admin'
import profileRouter from './routes/profile'

const app = express()
const PORT = process.env.PORT ?? 3001
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000'

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true, // Required to accept cookies from the frontend
}))
app.use(express.json())
app.use(cookieParser())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/room', roomRouter)
app.use('/api/join', joinRouter)
app.use('/api/session', sessionRouter)
app.use('/api/typing', typingRouter)
app.use('/api/quiz', quizRouter)
app.use('/api/leaderboard', leaderboardRouter)
app.use('/api/admin', adminRouter)
app.use('/api/profile', profileRouter)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`)
  console.log(`   Accepting requests from: ${FRONTEND_URL}`)
})

export default app
