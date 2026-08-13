'use server'

import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

export async function submitQuizResult(
  answers: Record<string, string>,
  questionIds: string[],
  timeTakenSec: number
) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value
  if (!sessionToken) return { error: 'Not authenticated' }

  const res = await fetch(`${BACKEND_URL}/api/quiz/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `room_session=${sessionToken}`,
    },
    body: JSON.stringify({ answers, questionIds, timeTakenSec }),
  })

  const result = await res.json()

  if (!res.ok) {
    return { error: result.error ?? 'Failed to submit quiz result.' }
  }

  return result
}
