import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'

export const metadata = {
  title: 'Admin Dashboard | Tea Tech Talks',
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const dbUser = await prisma.user.findUnique({ where: { email: user!.email } })

  // Fetch active/waiting rooms with participants
  const rooms = await prisma.room.findMany({
    where: { status: { in: ['WAITING', 'ACTIVE', 'COMPLETED'] } },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      participants: {
        include: {
          finalResult: { select: { finalScore: true, typingScore: true, quizScore: true, rank: true } },
          typingResult: { select: { wpm: true, accuracy: true, score: true } },
          quizResult: { select: { correctAnswers: true, score: true } },
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })

  return (
    <AdminDashboardClient
      adminName={dbUser?.name ?? 'Admin'}
      initialRooms={JSON.parse(JSON.stringify(rooms))}
    />
  )
}
