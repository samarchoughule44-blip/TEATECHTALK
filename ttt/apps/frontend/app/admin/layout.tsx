import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check admin role via backend
  const res = await fetch(
    `${BACKEND_URL}/api/admin/user?email=${encodeURIComponent(user.email ?? '')}`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    redirect('/')
  }

  const dbUser = await res.json()

  if (dbUser.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {children}
    </div>
  )
}
