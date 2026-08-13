'use server'

import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

export interface TypingSubmitInput {
  wpm: number
  accuracy: number
  errors: number
  correctChars: number
  totalChars: number
}

export async function submitTypingResult(data: TypingSubmitInput) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value
  if (!sessionToken) return { error: 'Not authenticated' }

  const res = await fetch(`${BACKEND_URL}/api/typing/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `room_session=${sessionToken}`,
    },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (!res.ok) {
    return { error: result.error ?? 'Failed to submit typing result.' }
  }

  return result
}
