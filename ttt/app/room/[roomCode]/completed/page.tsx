import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ roomCode: string }>
}

export default async function CompletedPage({ params }: Props) {
  const { roomCode } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('room_session')?.value

  if (!sessionToken) redirect('/join')

  const participant = await prisma.roomParticipant.findUnique({
    where: { sessionToken },
    include: {
      room: true,
      typingResult: true,
      quizResult: true,
      finalResult: true,
    },
  })

  if (!participant) redirect('/join')
  if (participant.room.roomCode !== roomCode) redirect('/join')

  // If not yet completed, redirect back
  if (!participant.finalResult) redirect(`/room/${roomCode}/quiz`)

  const r = participant.finalResult
  const t = participant.typingResult!
  const q = participant.quizResult!

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Celebration */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center mb-4">
            <span className="text-5xl">🏆</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Activity Completed!</h1>
          <p className="text-gray-400">
            Congratulations, <span className="text-white font-bold">{participant.name}</span>!
          </p>
        </div>

        {/* Score card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden mb-6">
          {/* Final score banner */}
          <div className="bg-[#D90429]/10 border-b border-[#D90429]/20 p-6 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Final Score</p>
            <div className="text-6xl font-black text-[#D90429]">{r.finalScore.toFixed(1)}</div>
            {r.rank && (
              <div className="mt-2 inline-flex items-center gap-2 bg-[#D90429]/20 border border-[#D90429]/30 rounded-full px-3 py-1">
                <span className="text-[#D90429] font-black text-sm">#{r.rank}</span>
                <span className="text-gray-400 text-xs">on Leaderboard</span>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Typing score */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
                <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">⌨️ Typing Test</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">WPM</span>
                    <span className="font-bold text-white">{Math.round(t.wpm)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Accuracy</span>
                    <span className="font-bold text-white">{t.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Errors</span>
                    <span className="font-bold text-white">{t.errors}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/10 pt-1.5 mt-1.5">
                    <span className="text-gray-400">Score</span>
                    <span className="font-black text-amber-400">{r.typingScore.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Quiz score */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
                <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">📝 Technical Quiz</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Correct</span>
                    <span className="font-bold text-emerald-400">{q.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Wrong</span>
                    <span className="font-bold text-red-400">{q.wrongAnswers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total</span>
                    <span className="font-bold text-white">{q.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/10 pt-1.5 mt-1.5">
                    <span className="text-gray-400">Score</span>
                    <span className="font-black text-purple-400">{r.quizScore.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score formula */}
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600">
                Typing Score <span className="text-amber-400 font-bold">{r.typingScore.toFixed(1)}</span>
                {' '}+ Quiz Score <span className="text-purple-400 font-bold">{r.quizScore.toFixed(1)}</span>
                {' '}= Final Score <span className="text-[#D90429] font-bold">{r.finalScore.toFixed(1)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/leaderboard"
            className="flex-1 bg-[#D90429] hover:bg-[#b00322] text-white font-bold py-3 rounded-xl transition-colors text-sm text-center"
          >
            🏆 View Leaderboard
          </Link>
          <Link
            href="/"
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold py-3 rounded-xl transition-colors text-sm text-center"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-xs text-gray-600 mt-4">
          Completed at {new Date(participant.completedAt!).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}
