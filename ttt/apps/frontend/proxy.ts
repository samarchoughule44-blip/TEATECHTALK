import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Run Supabase session refresh
  const response = await updateSession(request)

  // Inject the pathname into request headers so the root layout can read it
  // This allows the layout to conditionally show/hide Navbar & Footer
  const res = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers.entries()),
        'x-pathname': request.nextUrl.pathname,
      }),
    },
  })

  // Forward any cookies set by updateSession
  response.headers.forEach((value, key) => {
    if (key === 'set-cookie') res.headers.append(key, value)
  })

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
