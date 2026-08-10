import { Metadata } from 'next'
import { JoinRoomClient } from '@/components/room/JoinRoomClient'

export const metadata: Metadata = {
  title: 'Join Activity Room | Tea Tech Talks',
  description: 'Enter your details to join the activity room.',
}

export default function JoinPage() {
  return <JoinRoomClient />
}
