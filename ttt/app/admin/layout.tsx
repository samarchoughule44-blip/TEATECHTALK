import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

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

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {children}
    </div>
  )
}
