/**
 * Backend API client for server-side Next.js usage.
 * All requests include credentials (cookies) to pass the room_session cookie.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

/**
 * Make an authenticated fetch request to the backend.
 * On server, we need to forward the Cookie header manually.
 */
async function backendFetch(
  path: string,
  options: RequestInit & { cookieHeader?: string } = {}
): Promise<Response> {
  const { cookieHeader, ...fetchOptions } = options
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> ?? {}),
  }
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader
  }

  return fetch(`${BACKEND_URL}${path}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  })
}

// ── Room APIs ─────────────────────────────────────────────────────────────────

export async function getRoomStatus(roomCode: string) {
  const res = await backendFetch(`/api/room/${roomCode}/status`)
  if (!res.ok) return null
  return res.json()
}

export async function getRoomParticipants(roomCode: string) {
  const res = await backendFetch(`/api/room/${roomCode}/participants`)
  if (!res.ok) return null
  return res.json()
}

export async function getRoomLeaderboard(roomCode: string) {
  const res = await backendFetch(`/api/room/${roomCode}/leaderboard`)
  if (!res.ok) return null
  return res.json()
}

// ── Session API ───────────────────────────────────────────────────────────────

export async function getSession(cookieHeader?: string) {
  const res = await backendFetch('/api/session', { cookieHeader })
  if (!res.ok) return null
  return res.json()
}

// ── Join API ──────────────────────────────────────────────────────────────────

export async function joinRoom(data: { name: string; participantCode: string; roomCode: string }) {
  return backendFetch('/api/join', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ── Typing API ────────────────────────────────────────────────────────────────

export async function submitTypingResult(
  data: { wpm: number; accuracy: number; errors: number; correctChars: number; totalChars: number },
  cookieHeader?: string
) {
  return backendFetch('/api/typing/submit', {
    method: 'POST',
    body: JSON.stringify(data),
    cookieHeader,
  })
}

// ── Quiz API ──────────────────────────────────────────────────────────────────

export async function getQuizQuestions(cookieHeader?: string) {
  return backendFetch('/api/quiz/questions', { cookieHeader })
}

export async function submitQuizResult(
  data: { answers: Record<string, string>; questionIds: string[]; timeTakenSec: number },
  cookieHeader?: string
) {
  return backendFetch('/api/quiz/submit', {
    method: 'POST',
    body: JSON.stringify(data),
    cookieHeader,
  })
}

// ── Leaderboard API ───────────────────────────────────────────────────────────

export async function getGlobalLeaderboard() {
  const res = await backendFetch('/api/leaderboard')
  if (!res.ok) return null
  return res.json()
}

// ── Profile API ───────────────────────────────────────────────────────────────

export async function getProfileRoomActivities(participantCode: string) {
  const res = await backendFetch(`/api/profile?participantCode=${encodeURIComponent(participantCode)}`)
  if (!res.ok) return null
  return res.json()
}

// ── Admin API ─────────────────────────────────────────────────────────────────

export async function getAdminRooms() {
  const res = await backendFetch('/api/admin/rooms')
  if (!res.ok) return null
  return res.json()
}

export async function getAdminUser(email: string) {
  const res = await backendFetch(`/api/admin/user?email=${encodeURIComponent(email)}`)
  if (!res.ok) return null
  return res.json()
}
