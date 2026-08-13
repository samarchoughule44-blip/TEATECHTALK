'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type RoomStatus = 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CLOSED'

interface Props {
  roomCode: string
  roomId: string
  roomStatus: RoomStatus
  participantName: string
  participantId: string
  typingDuration: number
}

function Dot({ delay }: { delay: string }) {
  return <span className="w-2 h-2 rounded-full bg-[#D90429] animate-bounce" style={{ animationDelay: delay }} />
}

export function WaitingRoomClient({
  roomCode, roomId, roomStatus, participantName, participantId, typingDuration
}: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<RoomStatus>(roomStatus)
  const [participantCount, setParticipantCount] = useState(0)
  const [dots, setDots] = useState(0)

  // Animate waiting dots
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 600)
    return () => clearInterval(t)
  }, [])

  // Update participant last-seen every 30 seconds
  useEffect(() => {
    const ping = async () => {
      await fetch(`/api/room/${roomCode}/ping`, { method: 'POST' })
    }
    ping()
    const t = setInterval(ping, 30000)
    return () => clearInterval(t)
  }, [roomCode])

  // Subscribe to realtime updates on the room
  useEffect(() => {
    const supabase = createClient()

    // Subscribe to room status changes
    const roomChannel = supabase
      .channel(`waiting-room-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'Room',
        filter: `id=eq.${roomId}`,
      }, (payload) => {
        const newStatus = (payload.new as { status: RoomStatus }).status
        setStatus(newStatus)
        if (newStatus === 'ACTIVE') {
          // Small delay for smooth transition
          setTimeout(() => router.push(`/room/${roomCode}/typing`), 500)
        }
        if (newStatus === 'CLOSED') {
          router.push('/join')
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'RoomParticipant',
        filter: `roomId=eq.${roomId}`,
      }, (payload) => {
        // Re-fetch count (simple approach)
        fetchCount()
      })
      .subscribe()

    fetchCount()
    return () => { supabase.removeChannel(roomChannel) }
  }, [roomId, roomCode, router])

  async function fetchCount() {
    try {
      const res = await fetch(`/api/room/${roomCode}/participants`)
      const data = await res.json()
      setParticipantCount(data.count ?? 0)
    } catch {}
  }

  const isActive = status === 'ACTIVE'

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D90429]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Room code badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-gray-400">Room</span>
          <span className="font-mono font-black text-white tracking-widest">{roomCode}</span>
        </div>

        {/* Status indicator */}
        {!isActive ? (
          <>
            {/* Waiting animation */}
            <div className="flex justify-center gap-2 mb-8">
              <Dot delay="0ms" />
              <Dot delay="150ms" />
              <Dot delay="300ms" />
            </div>

            <h1 className="text-3xl font-black text-white mb-3">
              Hey, {participantName}! 👋
            </h1>
            <p className="text-gray-400 text-base mb-2">
              You&apos;re successfully connected to the activity room.
            </p>
            <p className="text-gray-500 text-sm mb-10">
              Please wait for the Admin to start the activity.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-emerald-400 mb-3">Activity Started!</h1>
            <p className="text-gray-400 text-sm mb-6">Redirecting you to the Typing Test...</p>
          </>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-black text-white">{participantCount}</div>
            <div className="text-xs text-gray-500 mt-1">Participants</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-black text-amber-400">{typingDuration}s</div>
            <div className="text-xs text-gray-500 mt-1">Typing Time</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className={`text-xs font-black uppercase tracking-wider mt-1 ${
              status === 'WAITING' ? 'text-blue-400' : 'text-emerald-400'
            }`}>
              {status === 'WAITING' ? '⏳ Waiting' : '🟢 Active'}
            </div>
            <div className="text-xs text-gray-500 mt-1">Status</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Activity Instructions</h3>
          <ul className="space-y-2">
            {[
              'Typing Test: Type the given passage as accurately and quickly as possible.',
              'Technical Quiz: Answer 10 multiple-choice questions within the time limit.',
              'Do NOT refresh the page during the activities.',
              'Do NOT switch tabs or leave the browser during the test.',
              'Once started, you must complete both activities in sequence.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#D90429] font-bold shrink-0">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-600 mt-6">
          This page updates automatically — no need to refresh.
        </p>
      </div>
    </div>
  )
}
