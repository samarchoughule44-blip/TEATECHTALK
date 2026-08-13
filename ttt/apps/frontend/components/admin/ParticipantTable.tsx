'use client'

type ParticipantStatus = 'JOINED' | 'TYPING' | 'TYPING_DONE' | 'QUIZ' | 'COMPLETED' | 'LEFT' | 'DISCONNECTED'

interface Participant {
  id: string
  name: string
  participantCode: string
  status: ParticipantStatus
  joinedAt: string
  completedAt: string | null
  finalResult: { finalScore: number; typingScore: number; quizScore: number; rank: number | null } | null
  typingResult: { wpm: number; accuracy: number; score: number } | null
  quizResult: { correctAnswers: number; score: number } | null
}

interface StatusConfig {
  label: string
  color: string
  dot: string
}

interface Props {
  participants: Participant[]
  statusConfig: Record<ParticipantStatus, StatusConfig>
}

export function ParticipantTable({ participants, statusConfig }: Props) {
  if (participants.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No participants yet</p>
        <p className="text-gray-600 text-xs mt-1">Share the Room ID so participants can join</p>
      </div>
    )
  }

  // Sort: completed first (by score desc), then in-progress, then waiting, then left
  const sorted = [...participants].sort((a, b) => {
    const scoreA = a.finalResult?.finalScore ?? -1
    const scoreB = b.finalResult?.finalScore ?? -1
    if (a.status === 'COMPLETED' && b.status === 'COMPLETED') return scoreB - scoreA
    if (a.status === 'COMPLETED') return -1
    if (b.status === 'COMPLETED') return 1
    return 0
  })

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">#</div>
        <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">Name</div>
        <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">ID</div>
        <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">Status</div>
        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-600 text-center">WPM</div>
        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-600 text-center">Quiz</div>
        <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 text-right">Score</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
        {sorted.map((p, idx) => {
          const cfg = statusConfig[p.status]
          return (
            <div key={p.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-white/[0.03] transition-colors">
              <div className="col-span-1 text-xs text-gray-600 font-bold">{idx + 1}</div>

              <div className="col-span-3">
                <p className="text-sm font-bold text-white truncate">{p.name}</p>
              </div>

              <div className="col-span-2">
                <p className="text-xs text-gray-500 font-mono truncate">{p.participantCode}</p>
              </div>

              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${p.status === 'TYPING' || p.status === 'QUIZ' ? 'animate-pulse' : ''}`} />
                  {cfg.label}
                </span>
              </div>

              <div className="col-span-1 text-center">
                <span className="text-xs font-bold text-white">
                  {p.typingResult ? `${Math.round(p.typingResult.wpm)}` : '—'}
                </span>
              </div>

              <div className="col-span-1 text-center">
                <span className="text-xs font-bold text-white">
                  {p.quizResult ? `${p.quizResult.correctAnswers}✓` : '—'}
                </span>
              </div>

              <div className="col-span-2 text-right">
                {p.finalResult ? (
                  <span className="text-sm font-black text-[#D90429]">
                    {p.finalResult.finalScore.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-xs text-gray-600">—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-gray-600">{participants.length} participant{participants.length !== 1 ? 's' : ''} total</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-gray-600">Live updates</span>
        </div>
      </div>
    </div>
  )
}
