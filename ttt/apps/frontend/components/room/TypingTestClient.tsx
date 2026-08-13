'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { submitTypingResult } from '@/app/room/[roomCode]/typing/actions'
import { formatTime } from '@/lib/room/utils'

interface Props {
  roomCode: string
  roomId: string
  participantId: string
  participantName: string
  passage: string
  duration: number
}

type CharState = 'pending' | 'correct' | 'incorrect'

export function TypingTestClient({ roomCode, roomId, participantId, participantName, passage, duration }: Props) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(duration)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [input, setInput] = useState('')
  const [charStates, setCharStates] = useState<CharState[]>(Array(passage.length).fill('pending'))
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const tabWarnings = useRef(0)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Anti-cheat: detect tab switch
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && started && !finished) {
        tabWarnings.current++
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [started, finished])

  // Countdown timer
  useEffect(() => {
    if (!started || finished) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          handleFinish()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started, finished])

  // Calculate stats
  const calcStats = useCallback((currentInput: string) => {
    const elapsed = (Date.now() - startTimeRef.current) / 60000 // minutes
    const wordsTyped = currentInput.trim().split(/\s+/).filter(Boolean).length
    const currentWpm = elapsed > 0 ? Math.round(wordsTyped / elapsed) : 0

    let correct = 0, incorrect = 0
    const newStates: CharState[] = Array(passage.length).fill('pending')
    for (let i = 0; i < currentInput.length && i < passage.length; i++) {
      if (currentInput[i] === passage[i]) {
        correct++
        newStates[i] = 'correct'
      } else {
        incorrect++
        newStates[i] = 'incorrect'
      }
    }

    const totalTyped = correct + incorrect
    const currentAccuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100

    setWpm(currentWpm)
    setAccuracy(currentAccuracy)
    setErrors(incorrect)
    setCharStates(newStates)
    return { correct, incorrect, wpm: currentWpm, accuracy: currentAccuracy }
  }, [passage])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!started) {
      setStarted(true)
      startTimeRef.current = Date.now()
    }
    if (finished) return
    setInput(value)
    calcStats(value)

    // Auto-finish when full passage is typed
    if (value.length >= passage.length) {
      handleFinish(value)
    }
  }

  const handleFinish = useCallback(async (finalInput?: string) => {
    if (finished || submitting) return
    setFinished(true)
    if (timerRef.current) clearInterval(timerRef.current)

    const currentInput = finalInput ?? input
    const elapsed = Math.max(1, (Date.now() - startTimeRef.current) / 60000)
    const wordsTyped = currentInput.trim().split(/\s+/).filter(Boolean).length
    const finalWpm = Math.round(wordsTyped / elapsed)

    let correct = 0, incorrect = 0
    for (let i = 0; i < currentInput.length && i < passage.length; i++) {
      if (currentInput[i] === passage[i]) correct++
      else incorrect++
    }
    const totalTyped = correct + incorrect
    const finalAccuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 0

    setSubmitting(true)
    const result = await submitTypingResult({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      errors: incorrect,
      correctChars: correct,
      totalChars: totalTyped,
    })

    if (result.error) {
      setSubmitError(result.error)
      setSubmitting(false)
      return
    }

    setTimeout(() => router.push(`/room/${roomCode}/quiz`), 2000)
  }, [finished, submitting, input, passage, roomCode, router])

  const timerPct = (timeLeft / duration) * 100
  const timerColor = timeLeft <= 10 ? 'text-red-400' : timeLeft <= 20 ? 'text-amber-400' : 'text-white'

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f0f] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#D90429] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-[10px]">TTT</span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400">Typing Test</span>
            <span className="text-xs text-gray-600 ml-2">· {participantName}</span>
          </div>
        </div>
        <div className="font-mono text-xs text-gray-500">Room: <span className="text-white font-bold">{roomCode}</span></div>
      </header>

      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-6 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {/* Timer */}
          <div className={`bg-white/5 border rounded-xl p-4 text-center col-span-1 ${
            timeLeft <= 10 ? 'border-red-500/30' : 'border-white/10'
          }`}>
            <div className={`text-3xl font-black font-mono ${timerColor}`}>{formatTime(timeLeft)}</div>
            <div className="text-xs text-gray-500 mt-1">Time Left</div>
            <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-amber-500' : 'bg-[#D90429]'
                }`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-black text-white">{wpm}</div>
            <div className="text-xs text-gray-500 mt-1">WPM</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className={`text-3xl font-black ${accuracy >= 90 ? 'text-emerald-400' : accuracy >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
              {accuracy}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Accuracy</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className={`text-3xl font-black ${errors === 0 ? 'text-emerald-400' : 'text-red-400'}`}>{errors}</div>
            <div className="text-xs text-gray-500 mt-1">Errors</div>
          </div>
        </div>

        {/* Passage display */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4 relative">
          {!started && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl z-10">
              <div className="text-center">
                <p className="text-white font-bold text-lg mb-1">Ready?</p>
                <p className="text-gray-400 text-sm">Start typing to begin the test</p>
              </div>
            </div>
          )}

          <div className="font-mono text-lg leading-relaxed select-none" aria-label="Typing passage">
            {passage.split('').map((char, i) => (
              <span
                key={i}
                className={
                  charStates[i] === 'correct' ? 'text-emerald-400' :
                  charStates[i] === 'incorrect' ? 'text-red-400 bg-red-500/20' :
                  i === input.length ? 'text-white bg-white/20 rounded' :
                  'text-gray-500'
                }
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            disabled={finished}
            onPaste={e => e.preventDefault()}
            onCopy={e => e.preventDefault()}
            onCut={e => e.preventDefault()}
            onContextMenu={e => e.preventDefault()}
            onDrop={e => e.preventDefault()}
            onKeyDown={e => {
              // Block shortcuts
              if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
                if (e.key.toLowerCase() !== 'a') e.preventDefault()
              }
            }}
            placeholder={started ? '' : 'Click here and start typing...'}
            className="w-full bg-white/5 border border-white/10 focus:border-[#D90429]/50 text-white rounded-xl px-5 py-4 font-mono text-base focus:outline-none placeholder:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {!started && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="text-xs text-gray-600">Timer starts on first keystroke</span>
            </div>
          )}
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
            {submitError}
          </div>
        )}

        {/* Finished overlay */}
        {finished && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
            {submitting ? (
              <>
                <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-emerald-400 font-bold">Submitting results...</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">✅</div>
                <h2 className="text-xl font-black text-white mb-1">Typing Test Complete!</h2>
                <p className="text-gray-400 text-sm mb-3">
                  {wpm} WPM · {accuracy}% Accuracy · {errors} Errors
                </p>
                <p className="text-emerald-400 text-sm font-medium">Navigating to Technical Quiz...</p>
              </>
            )}
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>{input.length} / {passage.length} characters</span>
          <span>
            {Math.round((input.length / passage.length) * 100)}% complete
          </span>
        </div>
        <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[#D90429] rounded-full transition-all duration-100"
            style={{ width: `${Math.min((input.length / passage.length) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
