import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Activity Room | Tea Tech Talks',
}

// This layout strips the navbar/footer for a focused activity experience
export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {children}
    </div>
  )
}
