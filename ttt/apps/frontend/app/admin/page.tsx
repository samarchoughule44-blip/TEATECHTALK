import { createClient } from '@/lib/supabase/server'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

export const metadata = {
  title: 'Admin Dashboard | Tea Tech Talks',
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch admin user info
  const userRes = await fetch(
    `${BACKEND_URL}/api/admin/user?email=${encodeURIComponent(user!.email ?? '')}`,
    { cache: 'no-store' }
  )
  const dbUser = userRes.ok ? await userRes.json() : null

  // Fetch rooms
  const roomsRes = await fetch(`${BACKEND_URL}/api/admin/rooms`, { cache: 'no-store' })
  const roomsData = roomsRes.ok ? await roomsRes.json() : { rooms: [] }

  return (
    <AdminDashboardClient
      adminName={dbUser?.name ?? 'Admin'}
      initialRooms={JSON.parse(JSON.stringify(roomsData.rooms))}
    />
  )
}
