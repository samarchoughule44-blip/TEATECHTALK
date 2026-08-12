import { Trophy, Zap, Target, Keyboard, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Profile | Tea Tech Talks" };

// ─── Level system ─────────────────────────────────────────────────────────────
function getLevel(totalPoints: number): { level: number; label: string } {
  if (totalPoints >= 500) return { level: 5, label: "Champion" };
  if (totalPoints >= 300) return { level: 4, label: "Expert" };
  if (totalPoints >= 150) return { level: 3, label: "Advanced" };
  if (totalPoints >= 50) return { level: 2, label: "Rising" };
  return { level: 1, label: "Rookie" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
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

  // ─── Fetch standalone typing results from Supabase ──────────────────────────
  const { data: results } = await supabase
    .from("typing_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const typingResults = results ?? [];

  // ─── Fetch Room Activity results from Prisma ────────────────────────────────
  // Match by roll_no (user's college ID stored in Supabase metadata) ↔ participantCode in room
  let roomActivities: Array<{
    id: string;
    finalScore: number;
    typingScore: number;
    quizScore: number;
    completedAt: Date;
    roomCode: string;
    participantName: string;
    wpm: number | null;
    accuracy: number | null;
  }> = [];

  if (roll_no && roll_no !== "N/A") {
    const roomParticipants = await prisma.roomParticipant.findMany({
      where: {
        participantCode: roll_no,
        finalResult: { isNot: null },
      },
      include: {
        finalResult: true,
        typingResult: { select: { wpm: true, accuracy: true } },
        room: { select: { roomCode: true } },
      },
      orderBy: { completedAt: "desc" },
    });

    roomActivities = roomParticipants
      .filter((p) => p.finalResult)
      .map((p) => ({
        id: p.finalResult!.id,
        finalScore: p.finalResult!.finalScore,
        typingScore: p.finalResult!.typingScore,
        quizScore: p.finalResult!.quizScore,
        completedAt: p.finalResult!.completedAt,
        roomCode: p.room.roomCode,
        participantName: p.name,
        wpm: p.typingResult?.wpm ?? null,
        accuracy: p.typingResult?.accuracy ?? null,
      }));
  }

  // ─── Compute combined stats ─────────────────────────────────────────────────
  const standalonePts = typingResults.reduce((s, r) => s + (r.points_earned ?? 0), 0);
  const roomPts = roomActivities.reduce((s, r) => s + Math.round(r.finalScore), 0);
  const totalPoints = standalonePts + roomPts;

  const standaloneTestsCount = typingResults.length;
  
  const allWpms = [
    ...typingResults.map(r => r.wpm ?? 0).filter(w => w > 0),
    ...roomActivities.map(r => r.wpm ?? 0).filter(w => w > 0)
  ];
  
  const allAccuracies = [
    ...typingResults.map(r => r.accuracy ?? 0).filter(a => a > 0),
    ...roomActivities.map(r => r.accuracy ?? 0).filter(a => a > 0)
  ];

  const totalTestsCount = allWpms.length;
  const bestWpm = totalTestsCount > 0 ? Math.max(...allWpms) : 0;
  const avgAccuracy = totalTestsCount > 0
    ? Math.round(allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length)
    : 0;

  const { level, label: levelLabel } = getLevel(totalPoints);

  // ─── Merge activity log ─────────────────────────────────────────────────────
  type ActivityLog =
    | { kind: "typing"; id: string; created_at: string; wpm: number; accuracy: number; errors: number; points_earned: number; duration_seconds: number }
    | { kind: "room"; id: string; completedAt: Date; roomCode: string; finalScore: number; typingScore: number; quizScore: number; wpm: number | null; accuracy: number | null };

  const activityLog: ActivityLog[] = [
    ...typingResults.slice(0, 10).map((r) => ({ kind: "typing" as const, ...r })),
    ...roomActivities.slice(0, 10).map((r) => ({ kind: "room" as const, ...r })),
  ].sort((a, b) => {
    const aDate = a.kind === "typing" ? new Date(a.created_at) : a.completedAt;
    const bDate = b.kind === "typing" ? new Date(b.created_at) : b.completedAt;
    return bDate.getTime() - aDate.getTime();
  }).slice(0, 8);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] p-6 md:p-12 font-body pb-24">
      <div className="mx-auto max-w-5xl space-y-12">

        {/* ─── Top Grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* User Profile Card */}
          <div className="bg-[var(--color-paper)] border-4 border-[var(--color-ink)]
           p-8 flex flex-col items-center text-center shadow-[4px_4px_0px_0px_var(--color-ink)]">
            <div className="w-32 h-32 rounded-full border-4 border-[var(--color-ink)] overflow-hidden mb-6 bg-[var(--color-fog)] flex items-center justify-center">
              <span className="text-5xl font-black text-[var(--color-brand)]">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-1 text-[var(--color-ink)]">
              {firstName}<br />{lastName}
            </h1>
            <p className="text-gray-500 font-bold mb-6 mt-2 text-sm uppercase tracking-widest">
              {class_name} • Div {div} • Roll {roll_no}
            </p>
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] w-full py-3 rounded font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-[var(--color-brand)]" />
              Level {level} — {levelLabel}
            </div>
            <div className="mt-4 w-full bg-[var(--color-fog)] rounded-full h-2 border border-[var(--color-ink)] overflow-hidden">
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
              <div className="bg-[var(--color-brand)] text-[#fff] border-4 border-[var(--color-ink)] p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_var(--color-ink)]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Best WPM</h3>
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-7xl font-black tracking-tighter">{bestWpm || "--"}</span>
                  {bestWpm > 0 && <span className="text-2xl font-bold ml-1">wpm</span>}
                </div>
                <p className="text-white/70 text-xs font-medium mt-2">
                  {totalTestsCount === 0 ? "Take a test to see stats" : `${totalTestsCount} test${totalTestsCount !== 1 ? "s" : ""} taken`}
                </p>
              </div>

              {/* Avg Accuracy */}
              <div className="bg-[var(--color-paper)] text-[var(--color-ink)] border-4 border-[var(--color-ink)] p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_var(--color-ink)]">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Avg Accuracy</h3>
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-6xl font-black text-[var(--color-brand)]">{avgAccuracy || "--"}</span>
                  {avgAccuracy > 0 && <span className="text-4xl font-black text-[var(--color-ink)]">%</span>}
                </div>
                <div className="w-full h-2 bg-[var(--color-fog)] rounded-full mt-3 overflow-hidden border border-[var(--color-mist)]">
                  <div className="h-full bg-[var(--color-brand)] rounded-full transition-all" style={{ width: `${avgAccuracy}%` }} />
                </div>
              </div>

              {/* Total Points */}
              <div className="bg-[var(--color-ink)] text-[var(--color-paper)] border-4 border-[var(--color-ink)] p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_var(--color-ink)]">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[var(--color-brand)]" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Total Points</h3>
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-7xl font-black tracking-tighter">{totalPoints}</span>
                  <span className="text-xl font-bold ml-2 text-[var(--color-paper)] opacity-70">pts</span>
                </div>
                <div className="flex gap-3 mt-2">
                  <p className="text-xs text-[var(--color-paper)] opacity-70">Typing: <span className="text-[var(--color-paper)] opacity-100 font-bold">{standalonePts}</span></p>
                  <p className="text-xs text-[var(--color-paper)] opacity-70">Rooms: <span className="text-[var(--color-brand)] font-bold">{roomPts}</span></p>
                </div>
              </div>

              {/* Room Activities */}
              <div className="bg-[var(--color-paper)] text-[var(--color-ink)] border-4 border-[var(--color-ink)] p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_var(--color-ink)]">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Room Activities</h3>
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-6xl font-black text-[var(--color-brand)]">{roomActivities.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mt-2">
                  {standaloneTestsCount} standalone test{standaloneTestsCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Activity Log ──────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4 text-[var(--color-ink)]">Activity Log</h2>
          <div className="h-1 bg-[var(--color-ink)] w-full mb-8" />

          <div className="border-4 border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-[4px_4px_0px_0px_var(--color-ink)] flex flex-col">
            {activityLog.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <Keyboard className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-2">No Activities Yet</h3>
                <p className="text-gray-400 font-medium text-sm mb-6">Join a session or take a typing test to see your activity here.</p>
                <a
                  href="/activities"
                  className="bg-[var(--color-brand)] text-[#fff] font-black uppercase tracking-widest text-sm py-3 px-8 rounded-md hover:bg-[var(--color-brand-dark)] transition-colors"
                >
                  JOIN SESSION →
                </a>
              </div>
            ) : (
              activityLog.map((entry, i) => (
                <div key={entry.id} className={`flex items-center p-6 ${i < activityLog.length - 1 ? "border-b-2 border-[var(--color-ink)]" : ""}`}>
                  {entry.kind === "room" ? (
                    <>
                      <div className="bg-[var(--color-ink)] rounded-lg p-3 mr-6 shrink-0">
                        <Trophy className="w-6 h-6 text-[var(--color-brand)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg">Room Activity — {entry.roomCode}</h4>
                        <p className="text-gray-500 text-sm font-medium">
                          {formatDate(entry.completedAt.toISOString())} · Typing + Quiz
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Typing: {entry.typingScore.toFixed(1)} pts · Quiz: {entry.quizScore.toFixed(1)} pts
                          {entry.wpm ? ` · ${Math.round(entry.wpm)} WPM` : ""}
                          {entry.accuracy ? ` · ${entry.accuracy.toFixed(0)}% acc` : ""}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                        <div className="text-[var(--color-brand)] font-black text-xl">
                          +{Math.round(entry.finalScore)}
                        </div>
                        <div className="text-xs text-gray-500 font-bold">Final Score</div>
                        <div className="bg-[var(--color-brand)] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                          ROOM
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-[var(--color-brand)] rounded-lg p-3 mr-6 shrink-0">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg">Speed Typing Test</h4>
                        <p className="text-gray-500 text-sm font-medium">
                          {formatDate(entry.created_at)} · {entry.duration_seconds}s session
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                        <div className="text-[var(--color-brand)] font-black text-xl">
                          +{entry.points_earned}
                        </div>
                        <div className="text-xs text-gray-500 font-bold">
                          {entry.wpm} WPM · {entry.accuracy}% acc
                        </div>
                        <div className="text-xs text-gray-400">
                          {entry.errors} error{entry.errors !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
