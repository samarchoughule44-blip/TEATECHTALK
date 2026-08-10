import { Trophy, Zap, Target, Clock, Keyboard, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Profile | Tea Tech Talks" };

// ─── Level system ─────────────────────────────────────────────────────────────
function getLevel(totalPoints: number): { level: number; label: string } {
  if (totalPoints >= 500) return { level: 5, label: "Champion" };
  if (totalPoints >= 300) return { level: 4, label: "Expert" };
  if (totalPoints >= 150) return { level: 3, label: "Advanced" };
  if (totalPoints >= 50)  return { level: 2, label: "Rising" };
  return { level: 1, label: "Rookie" };
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { name = "Unknown User", roll_no = "N/A", class_name = "N/A", div = "N/A" } =
    user.user_metadata || {};

  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  // ─── Fetch typing results from Supabase ────────────────────────────────────
  const { data: results } = await supabase
    .from("typing_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const typingResults = results ?? [];

  // ─── Compute real stats ────────────────────────────────────────────────────
  const testsCount = typingResults.length;
  const totalPoints = typingResults.reduce((s, r) => s + (r.points_earned ?? 0), 0);
  const bestWpm = testsCount > 0 ? Math.max(...typingResults.map((r) => r.wpm ?? 0)) : 0;
  const avgAccuracy =
    testsCount > 0
      ? Math.round(typingResults.reduce((s, r) => s + (r.accuracy ?? 0), 0) / testsCount)
      : 0;

  const { level, label: levelLabel } = getLevel(totalPoints);
  const recentTests = typingResults.slice(0, 5);

  // ─── Format date helper ────────────────────────────────────────────────────
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] p-6 md:p-12 font-body pb-24">
      <div className="mx-auto max-w-5xl space-y-12">

        {/* ─── Top Grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* User Profile Card */}
          <div className="bg-white border-4 border-black p-8 flex flex-col items-center text-center shadow-[4px_4px_0px_0px_var(--color-ink)]">
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden mb-6 bg-gray-100 flex items-center justify-center">
              <span className="text-5xl font-black text-[var(--color-brand)]">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-1">
              {firstName}<br />{lastName}
            </h1>
            <p className="text-gray-500 font-bold mb-6 mt-2 text-sm uppercase tracking-widest">
              {class_name} • Div {div} • Roll {roll_no}
            </p>
            <div className="bg-black text-white w-full py-3 rounded font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-[var(--color-brand)]" />
              Level {level} — {levelLabel}
            </div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-2 border border-black overflow-hidden">
              <div
                className="h-full bg-[var(--color-brand)] transition-all"
                style={{ width: `${Math.min((totalPoints / 500) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 font-medium mt-1">{totalPoints} / 500 pts to max level</p>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 flex flex-col gap-8">

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-6">

              {/* Best WPM */}
              <div className="bg-[var(--color-brand)] text-[#fff] border-4 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_var(--color-ink)]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Best WPM</h3>
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-7xl font-black tracking-tighter">{bestWpm || "--"}</span>
                  {bestWpm > 0 && <span className="text-2xl font-bold ml-1">wpm</span>}
                </div>
                <p className="text-white/70 text-xs font-medium mt-2">
                  {testsCount === 0 ? "Take a test to see stats" : `${testsCount} test${testsCount !== 1 ? "s" : ""} taken`}
                </p>
              </div>

              {/* Accuracy */}
              <div className="bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_var(--color-ink)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Avg Accuracy</h3>
                  </div>
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-6xl font-black text-[var(--color-brand)]">{avgAccuracy || "--"}</span>
                  {avgAccuracy > 0 && <span className="text-4xl font-black text-black">%</span>}
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden border border-gray-300">
                  <div
                    className="h-full bg-[var(--color-brand)] rounded-full transition-all"
                    style={{ width: `${avgAccuracy}%` }}
                  />
                </div>
              </div>

              {/* Total Points */}
              <div className="bg-black text-white border-4 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_var(--color-ink)]">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[var(--color-brand)]" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Total Points</h3>
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-7xl font-black tracking-tighter">{totalPoints}</span>
                  <span className="text-xl font-bold ml-2 text-gray-400">pts</span>
                </div>
              </div>

              {/* Tests Taken */}
              <div className="bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_var(--color-ink)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Tests Taken</h3>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-6xl font-black text-[var(--color-brand)]">{testsCount}</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mt-2">Speed test sessions</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Activity Log ──────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Activity Log</h2>
          <div className="h-1 bg-black w-full mb-8" />

          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_var(--color-ink)] flex flex-col">
            {recentTests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <Keyboard className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-2">
                  No Tests Yet
                </h3>
                <p className="text-gray-400 font-medium text-sm mb-6">
                  Join a typing session to see your activity here.
                </p>
                <a
                  href="/activities"
                  className="bg-[var(--color-brand)] text-[#fff] font-black uppercase tracking-widest text-sm py-3 px-8 rounded-md hover:bg-[var(--color-brand-dark)] transition-colors"
                >
                  JOIN SESSION →
                </a>
              </div>
            ) : (
              recentTests.map((r, i) => (
                <div
                  key={r.id}
                  className={`flex items-center p-6 ${i < recentTests.length - 1 ? "border-b-2 border-black" : ""}`}
                >
                  <div className="bg-[var(--color-brand)] rounded-lg p-3 mr-6 shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg">Speed Typing Test</h4>
                    <p className="text-gray-500 text-sm font-medium">
                      {formatDate(r.created_at)} · {r.duration_seconds}s session
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                    <div className="text-[var(--color-brand)] font-black text-xl">
                      +{r.points_earned}
                    </div>
                    <div className="text-xs text-gray-500 font-bold">
                      {r.wpm} WPM · {r.accuracy}% acc
                    </div>
                    <div className="text-xs text-gray-400">
                      {r.errors} error{r.errors !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
