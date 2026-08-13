'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

export async function joinRoomAction(prevState: unknown, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const participantCode = (formData.get('participantCode') as string)?.trim().toUpperCase()
  const roomCode = (formData.get('roomCode') as string)?.trim().toUpperCase()

  // Validate required fields
  if (!name || !participantCode || !roomCode) {
    return { error: 'All fields are required.' }
  }
  if (name.length < 2 || name.length > 80) {
    return { error: 'Name must be between 2 and 80 characters.' }
  }
  if (participantCode.length < 2 || participantCode.length > 30) {
    return { error: 'Participant ID must be between 2 and 30 characters.' }
  }

  // Call backend
  const res = await fetch(`${BACKEND_URL}/api/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, participantCode, roomCode }),
  })

  const data = await res.json()

  if (!res.ok) {
    return { error: data.error ?? 'Failed to join room.' }
  }

  // Forward the session cookie from backend response to the browser
  const setCookie = res.headers.get('set-cookie')
  if (setCookie) {
    // Parse the room_session cookie value from the Set-Cookie header
    const match = setCookie.match(/room_session=([^;]+)/)
    if (match) {
      const cookieStore = await cookies()
      cookieStore.set('room_session', match[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
        sameSite: 'lax',
      })
    }
  }

  redirect(`/room/${roomCode}/waiting`)
}
