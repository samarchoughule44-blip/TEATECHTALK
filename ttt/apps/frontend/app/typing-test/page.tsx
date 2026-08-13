"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PASSAGES } from "@/lib/passages";
import { RotateCcw, Trophy, Zap, Target, Clock, ChevronRight, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type CharState = "idle" | "correct" | "incorrect" | "current";
type TestState = "idle" | "running" | "finished";

interface Result {
  wpm: number;
  accuracy: number;
  errors: number;
  correct_chars: number;
  duration_seconds: number;
  points_earned: number;
}

// ─── Helper: get a random passage seeded by time + userId ────────────────────
function pickPassage(userId: string): string {
  const seed = `${Date.now()}-${userId}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    hash = (hash << 5) - hash + c;
    hash = hash & hash;
  }
  return PASSAGES[Math.abs(hash) % PASSAGES.length];
}

// ─── Points calculation ───────────────────────────────────────────────────────
function calcPoints(wpm: number, accuracy: number): number {
  let pts = 10; // participation
  if (wpm >= 50 && accuracy >= 90) pts += 30;
  if (wpm >= 70 && accuracy >= 95) pts += 60;
  if (wpm >= 90 && accuracy >= 98) pts += 100;
  return pts;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TypingTestPage() {
  const router = useRouter();
  const supabase = createClient();

  const DURATION = 60; // seconds

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Typist");
  const [passage, setPassage] = useState<string>("");
  const [charStates, setCharStates] = useState<CharState[]>([]);

  const [testState, setTestState] = useState<TestState>("idle");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);

  const [result, setResult] = useState<Result | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const totalTypedRef = useRef(0);
  const totalErrorsRef = useRef(0);

  // ─── Auth check ─────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      setUserName(user.user_metadata?.name?.split(" ")[0] ?? "Typist");
      initPassage(user.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initPassage(uid: string) {
    const p = pickPassage(uid);
    setPassage(p);
    setCharStates(Array(p.length).fill("idle"));
  }

  // ─── Timer ───────────────────────────────────────────────────────────────────
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestState("finished");

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const minutes = elapsed / 60;
    const finalWpm = minutes > 0 ? Math.round(totalTypedRef.current / 5 / minutes) : 0;
    const finalAcc = totalTypedRef.current > 0
      ? Math.round(((totalTypedRef.current - totalErrorsRef.current) / totalTypedRef.current) * 100)
      : 100;
    const finalCorrect = totalTypedRef.current - totalErrorsRef.current;
    const pts = calcPoints(finalWpm, finalAcc);

    const res: Result = {
      wpm: finalWpm,
      accuracy: finalAcc,
      errors: totalErrorsRef.current,
      correct_chars: Math.max(0, finalCorrect),
      duration_seconds: Math.round(elapsed),
      points_earned: pts,
    };
    setResult(res);
    saveResult(res);
  }, []);

  useEffect(() => {
    if (testState === "running") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [testState, finishTest]);

  // ─── Save result to Supabase ─────────────────────────────────────────────────
  async function saveResult(res: Result) {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase.from("typing_results").insert({
      user_id: userId,
      wpm: res.wpm,
      accuracy: res.accuracy,
      errors: res.errors,
      correct_chars: res.correct_chars,
      duration_seconds: res.duration_seconds,
      points_earned: res.points_earned,
    });
    if (error) setSaveError(error.message);
    setSaving(false);
  }

  // ─── Input handling ──────────────────────────────────────────────────────────
  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const typed = e.target.value;

    if (testState === "idle" && typed.length > 0) {
      setTestState("running");
      startTimeRef.current = Date.now();
    }
    if (testState === "finished") return;

    const newStates: CharState[] = Array(passage.length).fill("idle");
    let errCount = 0;
    let correctCount = 0;

    for (let i = 0; i < typed.length; i++) {
      if (i >= passage.length) break;
      if (typed[i] === passage[i]) {
        newStates[i] = "correct";
        correctCount++;
      } else {
        newStates[i] = "incorrect";
        errCount++;
      }
    }
    if (typed.length < passage.length) {
      newStates[typed.length] = "current";
    }

    // Track totals for WPM and accuracy at finish time
    totalTypedRef.current = typed.length;
    totalErrorsRef.current = errCount;

    // Live stats
    const elapsed = testState === "running" ? (Date.now() - startTimeRef.current) / 60000 : 0;
    const liveWpm = elapsed > 0 ? Math.round(typed.length / 5 / elapsed) : 0;
    const liveAcc = typed.length > 0 ? Math.round((correctCount / typed.length) * 100) : 100;

    setCharStates(newStates);
    setInputValue(typed);
    setErrors(errCount);
    setWpm(liveWpm);
    setAccuracy(liveAcc);
    setCorrectChars(correctCount);

    // Finished typing entire passage early
    if (typed.length >= passage.length) {
      finishTest();
    }
  }

  // ─── Reset ───────────────────────────────────────────────────────────────────
  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestState("idle");
    setTimeLeft(DURATION);
    setInputValue("");
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setResult(null);
    setSaveError(null);
    totalTypedRef.current = 0;
    totalErrorsRef.current = 0;
    if (userId) initPassage(userId);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  // ─── Timer display ────────────────────────────────────────────────────────────
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden py-10 flex flex-col items-center">
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <span
            className="font-display uppercase tracking-widest text-[8vw] sm:text-[6rem] leading-none font-black"
            style={{ color: "#f5bfc7", opacity: 0.5 }}
          >
            SPEED TEST
          </span>
        </div>
        <div className="relative z-10 text-center mt-6">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-widest border-b-4 border-black pb-2 inline-block">
            SPEED TEST
          </h1>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            Prove your speed. Climb the leaderboard. No mercy allowed.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-20">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "TIME REMAINING",
              value: `${mins}:${secs}`,
              red: testState === "running" && timeLeft <= 10,
            },
            {
              label: "WPM",
              value: testState === "idle" ? "--" : String(wpm),
              red: false,
            },
            {
              label: "ACCURACY",
              value: `${accuracy}%`,
              red: accuracy < 80 && testState === "running",
            },
            {
              label: "ERRORS",
              value: String(errors),
              red: errors > 0,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-2 border-black bg-white rounded-xl p-4 text-center shadow-[3px_3px_0px_0px_var(--color-ink)]"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                {stat.label}
              </p>
              <p
                className={`text-3xl font-black tabular-nums ${stat.red ? "text-[var(--color-brand)]" : "text-black"
                  }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Typing Area */}
        <div className="relative border-2 border-black bg-white rounded-xl p-6 shadow-[4px_4px_0px_0px_var(--color-ink)] mb-4">
          {/* PRO badge */}
          <span className="absolute top-0 right-4 -translate-y-1/2 bg-[var(--color-brand)] text-[#fff] text-[10px] font-black px-4 py-1 uppercase tracking-widest rounded-full">
            LIVE SESSION
          </span>

          {/* Passage display */}
          <div
            className="font-mono text-lg leading-relaxed mb-4 select-none cursor-text"
            onClick={() => inputRef.current?.focus()}
            aria-label="Typing passage"
          >
            {passage.split("").map((char, i) => {
              const state = charStates[i];
              let cls = "text-gray-400";
              if (state === "correct") cls = "text-black";
              if (state === "incorrect") cls = "bg-red-200 text-[var(--color-brand)] rounded-sm";
              if (state === "current") cls = "border-b-2 border-black text-black animate-pulse";
              return (
                <span key={i} className={cls}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Input */}
          <textarea
            ref={inputRef}
            id="typing-input"
            value={inputValue}
            onChange={handleInput}
            disabled={testState === "finished"}
            placeholder={
              testState === "idle"
                ? "Click here and start typing to begin the test…"
                : ""
            }
            className="w-full h-28 border-2 border-gray-300 rounded-lg p-3 font-mono text-sm text-gray-900 placeholder:text-gray-400 resize-none outline-none focus:border-black focus:ring-2 focus:ring-black transition-all"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            id="start-test-btn"
            onClick={() => {
              if (testState === "idle") inputRef.current?.focus();
            }}
            disabled={testState !== "idle"}
            className="flex-1 bg-[var(--color-brand)] text-[#fff] font-black uppercase tracking-widest text-sm py-4 rounded-md hover:bg-[var(--color-brand-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_var(--color-ink)]"
          >
            <ChevronRight className="w-4 h-4" />
            {testState === "idle" ? "START TYPING" : testState === "running" ? "TYPING…" : "DONE"}
          </button>
          <button
            id="reset-test-btn"
            onClick={reset}
            className="border-2 border-black bg-white text-black font-black px-5 py-4 rounded-md hover:bg-gray-100 transition-colors shadow-[3px_3px_0px_0px_var(--color-ink)]"
            title="New passage"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        {testState === "running" && (
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden border border-black">
            <div
              className="h-full bg-[var(--color-brand)] transition-all duration-300"
              style={{
                width: `${Math.round((inputValue.length / passage.length) * 100)}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* ─── Results Modal ───────────────────────────────────────────────────── */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_var(--color-ink)] max-w-md w-full p-8 relative">
            <button
              onClick={() => setResult(null)}
              className="absolute top-4 right-4 border-2 border-black rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="text-5xl mb-2">
                {result.wpm >= 70 ? "🏆" : result.wpm >= 40 ? "⚡" : "💪"}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-widest">
                {result.wpm >= 70 ? "IMPRESSIVE!" : result.wpm >= 40 ? "WELL DONE!" : "KEEP GOING!"}
              </h2>
              <p className="text-gray-500 text-sm font-medium mt-1">
                Test complete — {saving ? "saving your score…" : saveError ? "save failed: " + saveError : "score saved!"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: <Zap className="w-5 h-5" />, label: "WPM", value: result.wpm, color: "bg-[var(--color-brand)] text-[#fff]" },
                { icon: <Target className="w-5 h-5" />, label: "ACCURACY", value: `${result.accuracy}%`, color: "bg-black text-white" },
                { icon: <X className="w-5 h-5" />, label: "ERRORS", value: result.errors, color: "bg-white border-2 border-black text-black" },
                { icon: <Clock className="w-5 h-5" />, label: "TIME", value: `${result.duration_seconds}s`, color: "bg-white border-2 border-black text-black" },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl p-4 flex flex-col gap-1 ${stat.color}`}>
                  <div className="flex items-center gap-2 opacity-70">
                    {stat.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <span className="text-3xl font-black">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Points earned */}
            <div className="bg-[var(--color-brand-tint)] border-2 border-black rounded-xl p-4 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--color-brand)]" />
                <span className="font-black uppercase tracking-widest text-sm">Points Earned</span>
              </div>
              <span className="text-3xl font-black text-[var(--color-brand)]">+{result.points_earned}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                id="try-again-btn"
                className="flex-1 bg-[var(--color-brand)] text-[#fff] font-black uppercase tracking-widest text-sm py-3 rounded-md hover:bg-[var(--color-brand-dark)] transition-colors"
              >
                TRY AGAIN
              </button>
              <button
                onClick={() => router.push("/profile")}
                id="view-profile-btn"
                className="flex-1 border-2 border-black text-black font-black uppercase tracking-widest text-sm py-3 rounded-md hover:bg-black hover:text-white transition-colors"
              >
                VIEW PROFILE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
