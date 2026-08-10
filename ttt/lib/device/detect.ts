/**
 * Device detection utilities.
 * Uses both user-agent string AND viewport size for robust detection.
 */

/**
 * Server-side: detect mobile/tablet from request headers (user-agent)
 */
export function isMobileUA(userAgent: string): boolean {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent)
}

/**
 * Client-side: comprehensive device detection
 * Returns true if device is mobile/tablet (should be restricted)
 */
export function isRestrictedDevice(): boolean {
  if (typeof window === 'undefined') return false

  const ua = navigator.userAgent
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)
  const isTabletUA = /ipad|tablet|kindle|playbook|silk|(android(?!.*mobile))/i.test(ua)

  // Check touch points (mobile/tablet usually have > 0 touch points)
  const hasTouchScreen = navigator.maxTouchPoints > 1

  // Viewport width check
  const isSmallScreen = window.innerWidth < 1024

  // A device is restricted if it's identified as mobile/tablet via UA
  // OR if it has touch + small screen (catches cases UA spoofing won't)
  return isMobileUA || isTabletUA || (hasTouchScreen && isSmallScreen)
}

/**
 * Get a human-readable device description for restriction messages
 */
export function getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
  if (typeof window === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/ipad|tablet|kindle|playbook/i.test(ua)) return 'tablet'
  if (/android|iphone|ipod|mobile/i.test(ua)) return 'mobile'
  return 'desktop'
}
