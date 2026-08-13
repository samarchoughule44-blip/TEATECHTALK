/**
 * Server-side scoring calculations.
 * These are never exposed to clients — always run on the server.
 */

export interface TypingScoreInput {
  wpm: number
  accuracy: number // 0-100
  typingWeight: number // 0-1
  maxScore: number
}

export interface QuizScoreInput {
  correctAnswers: number
  totalQuestions: number
  quizWeight: number // 0-1
  maxScore: number
}

/**
 * Calculate typing score component.
 * Formula: ((WPM / 120) * 0.5 + (accuracy / 100) * 0.5) * (maxScore * typingWeight)
 * Capped at maxScore * typingWeight.
 */
export function calculateTypingScore(input: TypingScoreInput): number {
  const { wpm, accuracy, typingWeight, maxScore } = input
  const wpmNorm = Math.min(wpm / 120, 1) // 120 WPM = perfect
  const accNorm = accuracy / 100
  const raw = (wpmNorm * 0.5 + accNorm * 0.5) * (maxScore * typingWeight)
  return Math.round(Math.min(raw, maxScore * typingWeight) * 10) / 10
}

/**
 * Calculate quiz score component.
 * Formula: (correctAnswers / totalQuestions) * (maxScore * quizWeight)
 */
export function calculateQuizScore(input: QuizScoreInput): number {
  const { correctAnswers, totalQuestions, quizWeight, maxScore } = input
  if (totalQuestions === 0) return 0
  const raw = (correctAnswers / totalQuestions) * (maxScore * quizWeight)
  return Math.round(raw * 10) / 10
}

/**
 * Calculate final combined score.
 */
export function calculateFinalScore(typingScore: number, quizScore: number): number {
  return Math.round((typingScore + quizScore) * 10) / 10
}

/**
 * Validate and grade quiz answers server-side.
 * Returns { correctAnswers, wrongAnswers, score }
 */
export function gradeQuiz(
  questions: Array<{ id: string; correctOption: string }>,
  answers: Record<string, string>, // { questionId: "A" | "B" | "C" | "D" }
  quizWeight: number,
  maxScore: number
): { correctAnswers: number; wrongAnswers: number; score: number; totalQuestions: number } {
  let correct = 0
  let wrong = 0

  for (const q of questions) {
    const given = answers[q.id]
    if (!given) {
      wrong++
    } else if (given.toUpperCase() === q.correctOption.toUpperCase()) {
      correct++
    } else {
      wrong++
    }
  }

  const score = calculateQuizScore({
    correctAnswers: correct,
    totalQuestions: questions.length,
    quizWeight,
    maxScore,
  })

  return { correctAnswers: correct, wrongAnswers: wrong, score, totalQuestions: questions.length }
}
