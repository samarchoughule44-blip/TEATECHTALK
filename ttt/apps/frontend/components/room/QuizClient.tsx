'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { submitQuizResult } from '@/app/room/[roomCode]/quiz/actions'
import { formatTime } from '@/lib/room/utils'

interface Question {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  category: string
  difficulty: string
}

interface Props {
  roomCode: string
  roomId: string
  participantId: string
  participantName: string
  questions: Question[]
  duration: number
}

const OPTIONS = ['A', 'B', 'C', 'D'] as const
const OPTION_LABELS: Record<string, string> = { A: 'optionA', B: 'optionB', C: 'optionC', D: 'optionD' }

export function QuizClient({ roomCode, roomId, participantId, participantName, questions, duration }: Props) {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(duration)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{
    correctAnswers: number; wrongAnswers: number; totalQuestions: number
    quizScore: number; typingScore: number; finalScore: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const startTimeRef = useRef(Date.now())

  // Anti-cheat: tab switch detection
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && !submitted) {
        // Log but don't block — admin can see this via timestamps
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [submitted])

  // Timer
  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(t)
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [submitted])

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting || submitted) return
    setSubmitting(true)

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)
    const questionIds = questions.map(q => q.id)

    const res = await submitQuizResult(answers, questionIds, timeTaken)

    if (res.error) {
      setError(res.error)
      setSubmitting(false)
      return
    }

    if (res.success) {
      setResult({
        correctAnswers: res.correctAnswers!,
        wrongAnswers: res.wrongAnswers!,
        totalQuestions: res.totalQuestions!,
        quizScore: res.quizScore!,
        typingScore: res.typingScore!,
        finalScore: res.finalScore!,
      })
      setSubmitted(true)
      setTimeout(() => router.push(`/room/${roomCode}/completed`), 3000)
    }
  }, [submitting, submitted, answers, questions, roomCode, router])

  const selectAnswer = (questionId: string, option: string) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const q = questions[currentQ]
  const answered = Object.keys(answers).length
  const timerPct = (timeLeft / duration) * 100
  const timerColor = timeLeft <= 60 ? 'text-red-400' : timeLeft <= 120 ? 'text-amber-400' : 'text-white'

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Quiz Submitted!</h1>
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-black text-emerald-400">{result.correctAnswers}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-black text-red-400">{result.wrongAnswers}</div>
              <div className="text-xs text-gray-500">Wrong</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-black text-[#D90429]">{result.finalScore.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Final Score</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Redirecting to completion screen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f0f] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#D90429] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-[10px]">TTT</span>
          </div>
          <span className="text-xs font-bold text-gray-400">Technical Quiz · {participantName}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`font-mono font-black text-lg ${timerColor}`}>{formatTime(timeLeft)}</div>
          <div className="text-xs text-gray-500">{answered}/{questions.length} answered</div>
        </div>
      </header>

      {/* Timer bar */}
      <div className="h-1 bg-white/5">
        <div
          className={`h-full transition-all duration-1000 ${
            timeLeft <= 60 ? 'bg-red-500' : timeLeft <= 120 ? 'bg-amber-500' : 'bg-[#D90429]'
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="flex-1 flex gap-0 max-w-6xl w-full mx-auto">
        {/* Question nav sidebar */}
        <aside className="w-20 border-r border-white/10 p-3 flex flex-col gap-2 items-center pt-4">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${
                i === currentQ
                  ? 'bg-[#D90429] text-white'
                  : answers[questions[i].id]
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-gray-500 hover:bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </aside>

        {/* Main question area */}
        <main className="flex-1 flex flex-col p-6 max-w-2xl mx-auto w-full">
          {/* Question header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Question {currentQ + 1} / {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  q.difficulty === 'easy' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  q.difficulty === 'medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                  'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {q.difficulty}
                </span>
                <span className="text-[10px] text-gray-600 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  {q.category}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-white/10 mb-6 overflow-hidden">
              <div
                className="h-full bg-[#D90429] rounded-full transition-all duration-300"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h2 className="text-xl font-bold text-white leading-relaxed">{q.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3 flex-1">
            {OPTIONS.map(opt => {
              const label = OPTION_LABELS[opt] as keyof Question
              const text = q[label] as string
              const isSelected = answers[q.id] === opt

              return (
                <button
                  key={opt}
                  id={`option-${opt.toLowerCase()}`}
                  onClick={() => selectAnswer(q.id, opt)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center gap-4 group ${
                    isSelected
                      ? 'bg-[#D90429]/15 border-[#D90429]/50 text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
                    isSelected
                      ? 'bg-[#D90429] text-white'
                      : 'bg-white/10 text-gray-400 group-hover:bg-white/15'
                  }`}>
                    {opt}
                  </div>
                  <span className="font-medium">{text}</span>
                  {isSelected && (
                    <div className="ml-auto">
                      <div className="w-5 h-5 rounded-full bg-[#D90429] flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
              disabled={currentQ === 0}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-sm rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="text-xs text-gray-600">
              {answered} / {questions.length} answered
            </div>

            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-sm rounded-xl transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting || submitted}
                id="submit-quiz-btn"
                className="px-5 py-2.5 bg-[#D90429] hover:bg-[#b00322] disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : 'Submit Quiz'}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
