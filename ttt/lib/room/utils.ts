// Room code generation and utility helpers

const ADJECTIVES = ['TECH', 'CODE', 'HACK', 'DEV', 'NET', 'SYS', 'DATA', 'BYTE']
const YEARS = ['2025', '2026', '2027']

/**
 * Generate a short, memorable room code like TECH2026 or CODE7382
 */
export function generateRoomCode(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  // Either append a year or a 4-digit number
  const useYear = Math.random() > 0.5
  if (useYear) {
    const year = YEARS[Math.floor(Math.random() * YEARS.length)]
    return `${adj}${year}`
  }
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${adj}${num}`
}

/**
 * Detect whether a user-agent string is from a mobile/tablet device
 */
export function isMobileUserAgent(ua: string): boolean {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(ua)
}

/**
 * Format seconds into mm:ss
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
