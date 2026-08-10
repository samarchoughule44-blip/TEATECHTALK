'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type RoomStatus = 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CLOSED'

interface LeaderboardEntry {
  id: string
  participantId: string
  typingScore: number
  quizScore: number
  finalScore: number
  rank: number | null
  completedAt: string
  participant: {
    name: string
    participantCode: string
    status: string
    completedAt: string | null
  }
  typing: { wpm: number; accuracy: number } | null
  quiz: { correctAnswers: number; totalQuestions: number } | null
}

interface Props {
  roomCode: string
  roomId: string
  roomStatus: RoomStatus
  initialResults: LeaderboardEntry[]
}

const MEDALS = ['🥇', '🥈', '🥉']

export function RoomLeaderboardClient({ roomCode, roomId, roomStatus, initialResults }: Props) {
  const [results, setResults] = useState<LeaderboardEntry[]>(initialResults)

  // Subscribe to new final results
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`leaderboard-${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'RoomFinalResult',
        filter: `roomId=eq.${roomId}`,
      }, async () => {
        // Refetch from API
        const res = await fetch(`/api/room/${roomCode}/leaderboard`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.results)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId, roomCode])

  const top3 = results.slice(0, 3)
  const rest = results.slice(3)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f0f] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#D90429] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-[10px]">TTT</span>
          </div>
          <span className="text-sm font-bold text-white">Tea Tech Talks</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-white text-sm bg-white/10 border border-white/10 px-3 py-1 rounded-lg">{roomCode}</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-[#D90429] uppercase tracking-wider mb-2"
            style={{ fontFamily: 'var(--font-anton), Anton, Impact, sans-serif' }}>
            Leaderboard
          </h1>
          <p className="text-gray-500 text-sm">{results.length} participant{results.length !== 1 ? 's' : ''} completed</p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-400 font-bold text-lg">No results yet</p>
            <p className="text-gray-600 text-sm mt-2">Results will appear here as participants complete the activity</p>
          </div>
        ) : (
          <>
            {/* Podium — top 3 */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-4 mb-10">
                {/* Rearrange for podium: 2nd, 1st, 3rd */}
                {[top3[1], top3[0], top3[2]].filter(Boolean).map((r, podiumIdx) => {
                  const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
                  const heights = ['h-32', 'h-48', 'h-24']
                  const sizes = ['w-16 h-16', 'w-24 h-24', 'w-16 h-16']

                  return (
                    <div key={r.id} className="flex flex-col items-center">
                      <div className="text-2xl mb-1">{MEDALS[actualRank - 1]}</div>
                      <div className={`${sizes[podiumIdx]} rounded-full bg-[#D90429]/10 border-2 border-[#D90429]/30 flex items-center justify-center mb-2`}>
                        <span className="font-black text-white text-lg">
                          {r.participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-bold text-white text-sm mb-1 max-w-[100px] truncate text-center">{r.participant.name}</p>
                      <div className="bg-[#D90429]/10 border border-[#D90429]/30 rounded-lg px-3 py-1 mb-2">
                        <span className="font-black text-[#D90429] text-sm">{r.finalScore.toFixed(1)} pts</span>
                      </div>
                      <div className={`w-24 sm:w-32 ${heights[podiumIdx]} rounded-t-xl flex items-center justify-center border border-white/10 ${
                        podiumIdx === 1 ? 'bg-[#D90429]/20' : 'bg-white/5'
                      }`}>
                        <span className="text-4xl font-black text-white/30">{actualRank}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Full table */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">Rank</div>
                <div className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">Participant</div>
                <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 text-center">WPM</div>
                <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 text-center">Accuracy</div>
                <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-600 text-center">Quiz</div>
                <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 text-right">Score</div>
              </div>

              {results.map((r, i) => (
                <div
                  key={r.id}
                  className={`grid grid-cols-12 gap-2 px-5 py-4 border-b border-white/5 last:border-0 items-center ${
                    i < 3 ? 'bg-[#D90429]/5' : 'hover:bg-white/[0.02]'
                  } transition-colors`}
                >
                  <div className="col-span-1">
                    <span className="text-sm font-black text-gray-400">
                      {i < 3 ? MEDALS[i] : `#${i + 1}`}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <p className="font-bold text-white text-sm truncate">{r.participant.name}</p>
                    <p className="text-xs text-gray-600 font-mono">{r.participant.participantCode}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-bold text-white">{r.typing ? Math.round(r.typing.wpm) : '—'}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-bold text-white">{r.typing ? `${r.typing.accuracy.toFixed(1)}%` : '—'}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-sm font-bold text-white">
                      {r.quiz ? `${r.quiz.correctAnswers}/${r.quiz.totalQuestions}` : '—'}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`font-black text-base ${i === 0 ? 'text-[#D90429]' : 'text-white'}`}>
                      {r.finalScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="text-center text-xs text-gray-700 mt-6">
          Updates automatically as participants complete the activity
        </p>
      </div>
    </div>
  )
}
