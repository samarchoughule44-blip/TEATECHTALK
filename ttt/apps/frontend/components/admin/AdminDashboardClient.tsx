'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createRoomAction, startActivityAction, closeRoomAction, toggleJoiningAction } from '@/app/admin/actions'
import { RoomCreationModal } from '@/components/admin/RoomCreationModal'
import { ParticipantTable } from '@/components/admin/ParticipantTable'

type ParticipantStatus = 'JOINED' | 'TYPING' | 'TYPING_DONE' | 'QUIZ' | 'COMPLETED' | 'LEFT' | 'DISCONNECTED'
type RoomStatus = 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CLOSED'

interface FinalResult { finalScore: number; typingScore: number; quizScore: number; rank: number | null }
interface TypingResult { wpm: number; accuracy: number; score: number }
interface QuizResult { correctAnswers: number; score: number }

interface Participant {
  id: string
  name: string
  participantCode: string
  status: ParticipantStatus
  joinedAt: string
  completedAt: string | null
  finalResult: FinalResult | null
  typingResult: TypingResult | null
  quizResult: QuizResult | null
}

interface Room {
  id: string
  roomCode: string
  status: RoomStatus
  allowJoining: boolean
  typingDuration: number
  quizDuration: number
  createdAt: string
  startedAt: string | null
  endedAt: string | null
  participants: Participant[]
}

interface Props {
  adminName: string
  initialRooms: Room[]
}

const STATUS_CONFIG: Record<ParticipantStatus, { label: string; color: string; dot: string }> = {
  JOINED: { label: 'Waiting', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  TYPING: { label: 'Typing Test', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  TYPING_DONE: { label: 'Typing Done', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
  QUIZ: { label: 'Quiz', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', dot: 'bg-purple-400' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  LEFT: { label: 'Left', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30', dot: 'bg-gray-400' },
  DISCONNECTED: { label: 'Disconnected', color: 'bg-red-500/10 text-red-400 border-red-500/30', dot: 'bg-red-400' },
}

const ROOM_STATUS_CONFIG: Record<RoomStatus, { label: string; color: string }> = {
  WAITING: { label: 'Waiting', color: 'text-blue-400' },
  ACTIVE: { label: 'Active', color: 'text-emerald-400' },
  COMPLETED: { label: 'Completed', color: 'text-gray-400' },
  CLOSED: { label: 'Closed', color: 'text-red-400' },
}

export function AdminDashboardClient({ adminName, initialRooms }: Props) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(
    initialRooms.find(r => r.status === 'ACTIVE' || r.status === 'WAITING') ?? initialRooms[0] ?? null
  )
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Update clock
  useEffect(() => {
    setIsMounted(true)
    setCurrentTime(new Date())
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Supabase Realtime — subscribe to participant changes
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'RoomParticipant' }, (payload) => {
        setRooms(prev => prev.map(room => {
          if (!room.participants.some(p => p.id === (payload.new as Participant)?.id)) {
            // Check if this participant belongs to this room
            if ((payload.new as Participant & { roomId: string })?.roomId !== room.id) return room
          }
          if (payload.eventType === 'INSERT') {
            const exists = room.participants.find(p => p.id === (payload.new as Participant).id)
            if (exists) return room
            return { ...room, participants: [...room.participants, payload.new as Participant] }
          }
          if (payload.eventType === 'UPDATE') {
            return {
              ...room,
              participants: room.participants.map(p =>
                p.id === (payload.new as Participant).id ? { ...p, ...(payload.new as Participant) } : p
              ),
            }
          }
          return room
        }))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Room' }, (payload) => {
        setRooms(prev => prev.map(r =>
          r.id === (payload.new as Room).id ? { ...r, ...(payload.new as Room) } : r
        ))
        setSelectedRoom(prev =>
          prev && prev.id === (payload.new as Room).id ? { ...prev, ...(payload.new as Room) } : prev
        )
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Sync selectedRoom when rooms update
  useEffect(() => {
    if (selectedRoom) {
      const updated = rooms.find(r => r.id === selectedRoom.id)
      if (updated) setSelectedRoom(updated)
    }
  }, [rooms])

  function showMsg(type: 'success' | 'error', text: string) {
    setActionMsg({ type, text })
    setTimeout(() => setActionMsg(null), 3000)
  }

  async function handleStartActivity() {
    if (!selectedRoom) return
    startTransition(async () => {
      const res = await startActivityAction(selectedRoom.roomCode)
      if (res.success) showMsg('success', 'Activity started! All participants notified.')
      else showMsg('error', res.error ?? 'Failed to start activity')
    })
  }

  async function handleCloseRoom() {
    if (!selectedRoom) return
    if (!confirm('Are you sure you want to close this room? All active participants will be marked as Left.')) return
    startTransition(async () => {
      const res = await closeRoomAction(selectedRoom.roomCode)
      if (res.success) showMsg('success', 'Room closed.')
      else showMsg('error', res.error ?? 'Failed to close room')
    })
  }

  async function handleToggleJoining() {
    if (!selectedRoom) return
    startTransition(async () => {
      const res = await toggleJoiningAction(selectedRoom.roomCode, !selectedRoom.allowJoining)
      if (res.success) showMsg('success', selectedRoom.allowJoining ? 'Joining disabled.' : 'Joining enabled.')
      else showMsg('error', res.error ?? 'Failed to toggle joining')
    })
  }

  function handleRoomCreated(newRoom: Room) {
    setRooms(prev => [newRoom, ...prev])
    setSelectedRoom(newRoom)
    setShowCreateModal(false)
  }

  const room = selectedRoom
  const total = room?.participants?.length ?? 0
  const completed = room?.participants?.filter(p => p.status === 'COMPLETED').length ?? 0
  const inProgress = room?.participants?.filter(p => ['TYPING', 'TYPING_DONE', 'QUIZ'].includes(p.status)).length ?? 0
  const waiting = room?.participants?.filter(p => p.status === 'JOINED').length ?? 0
  const left = room?.participants?.filter(p => ['LEFT', 'DISCONNECTED'].includes(p.status)).length ?? 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-[#0f0f0f] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#D90429] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">TTT</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">Tea Tech Talks</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block w-[120px]">
            {isMounted && currentTime ? (
              <>
                <div className="text-xs text-gray-400">{currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                <div className="text-sm font-mono font-bold text-white">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
            <div className="w-6 h-6 rounded-full bg-[#D90429] flex items-center justify-center text-white text-xs font-bold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-300 font-medium">{adminName}</span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Left sidebar — room list */}
        <aside className="w-64 border-r border-white/10 bg-[#0f0f0f] flex flex-col">
          <div className="p-4 border-b border-white/10">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-[#D90429] hover:bg-[#b00322] text-white font-bold text-sm py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create New Room
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-2 mb-3">Rooms</p>
            {rooms.length === 0 && (
              <p className="text-xs text-gray-600 text-center py-8">No rooms yet.</p>
            )}
            {rooms.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRoom(r)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-150 ${selectedRoom?.id === r.id
                  ? 'bg-white/10 border-white/20'
                  : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-sm text-white">{r.roomCode}</span>
                  <span className={`text-[10px] font-bold ${ROOM_STATUS_CONFIG[r.status].color}`}>
                    {ROOM_STATUS_CONFIG[r.status].label}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{r.participants.length} participants</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {!room ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Create a room to get started</p>
                <button onClick={() => setShowCreateModal(true)} className="mt-4 text-[#D90429] hover:text-red-400 text-sm font-bold">
                  + Create New Room
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Action message */}
              {actionMsg && (
                <div className={`rounded-lg px-4 py-3 text-sm font-medium border ${actionMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                  {actionMsg.text}
                </div>
              )}

              {/* Room header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black font-mono tracking-wider text-white">{room.roomCode}</h2>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${room.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      room.status === 'WAITING' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                        room.status === 'COMPLETED' ? 'bg-gray-500/10 border-gray-500/30 text-gray-400' :
                          'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                      {room.status === 'ACTIVE' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />}
                      {ROOM_STATUS_CONFIG[room.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Typing: {room.typingDuration}s &middot; Quiz: {Math.floor(room.quizDuration / 60)}min
                    {room.startedAt && isMounted && <> &middot; Started {new Date(room.startedAt).toLocaleTimeString()}</>}
                  </p>
                </div>

                {/* Control buttons */}
                <div className="flex flex-wrap gap-2">
                  {room.status === 'WAITING' && (
                    <button
                      onClick={handleStartActivity}
                      disabled={isPending}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Start Activity
                    </button>
                  )}

                  {(room.status === 'WAITING' || room.status === 'ACTIVE') && (
                    <button
                      onClick={handleToggleJoining}
                      disabled={isPending}
                      className={`font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200 border ${room.allowJoining
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                    >
                      {room.allowJoining ? '🔒 Lock Joining' : '🔓 Allow Joining'}
                    </button>
                  )}

                  {(room.status === 'WAITING' || room.status === 'ACTIVE') && (
                    <button
                      onClick={handleCloseRoom}
                      disabled={isPending}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      Close Room
                    </button>
                  )}

                  <a
                    href={`/room/${room.roomCode}/leaderboard`}
                    target="_blank"
                    className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Leaderboard ↗
                  </a>
                </div>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: 'Total', value: total, color: 'text-white' },
                  { label: 'Waiting', value: waiting, color: 'text-blue-400' },
                  { label: 'In Progress', value: inProgress, color: 'text-amber-400' },
                  { label: 'Completed', value: completed, color: 'text-emerald-400' },
                  { label: 'Left', value: left, color: 'text-gray-500' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Room share info */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Share this Room ID with participants</p>
                  <p className="font-mono font-black text-2xl text-white tracking-widest">{room.roomCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Join URL</p>
                  <code className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                    {isMounted ? `${window.location.origin}/join` : '/join'}
                  </code>
                </div>
              </div>

              {/* Participant table */}
              <ParticipantTable participants={room.participants} statusConfig={STATUS_CONFIG} />
            </div>
          )}
        </main>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <RoomCreationModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleRoomCreated}
          createAction={createRoomAction}
        />
      )}
    </div>
  )
}
