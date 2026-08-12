import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Leaderboard | Tea Tech Talks",
};

export const revalidate = 30;

const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_COLORS = [
  "border-yellow-400 bg-yellow-400/10",
  "border-gray-300 bg-gray-300/10",
  "border-amber-600 bg-amber-600/10",
];
const PODIUM_HEIGHTS = ["h-36", "h-52", "h-24"];
const PODIUM_SIZES = ["w-16 h-16", "w-24 h-24", "w-16 h-16"];

async function getLeaderboardData() {
  // Aggregate best final score per participant (across all rooms)
  const allFinalResults = await prisma.roomFinalResult.findMany({
    include: {
      participant: {
        select: { name: true, participantCode: true },
      },
    },
    orderBy: { finalScore: "desc" },
  });

  // Group by participantCode — pick highest score per person
  const byCode = new Map<string, {
    name: string;
    participantCode: string;
    bestScore: number;
    totalScore: number;
    roomCount: number;
    bestTypingScore: number;
    bestQuizScore: number;
  }>();

  for (const r of allFinalResults) {
    const code = r.participant.participantCode;
    const existing = byCode.get(code);
    if (!existing) {
      byCode.set(code, {
        name: r.participant.name,
        participantCode: code,
        bestScore: r.finalScore,
        totalScore: r.finalScore,
        roomCount: 1,
        bestTypingScore: r.typingScore,
        bestQuizScore: r.quizScore,
      });
    } else {
      existing.totalScore += r.finalScore;
      existing.roomCount += 1;
      if (r.finalScore > existing.bestScore) {
        existing.bestScore = r.finalScore;
        existing.bestTypingScore = r.typingScore;
        existing.bestQuizScore = r.quizScore;
      }
      byCode.set(code, existing);
    }
  }

  // Sort by best score descending
  const sorted = Array.from(byCode.values())
    .sort((a, b) => b.bestScore - a.bestScore || a.name.localeCompare(b.name))
    .map((u, i) => ({
      ...u,
      rank: i + 1,
      initials: u.name
        .split(" ")
        .map((w) => w[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    }));

  return sorted;
}

export default async function LeaderboardPage() {
  let leaderboard: Awaited<ReturnType<typeof getLeaderboardData>> = [];
  try {
    leaderboard = await getLeaderboardData();
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
  }

  const top3 = leaderboard.slice(0, 3);
  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="mx-auto max-w-2xl px-4 py-12 flex flex-col items-center">

        {/* ── Heading ── */}
        <h1
          className="text-[3.5rem] sm:text-[6.5rem] leading-none text-[var(--color-brand)] uppercase text-center mb-4 w-full"
          style={{ fontFamily: "var(--font-anton), Anton, Impact, sans-serif", letterSpacing: "0.02em" }}
        >
          LEADERBOARD
        </h1>
        <p className="text-gray-500 text-sm font-medium mb-10 uppercase tracking-widest">
          Ranked by best room activity score
        </p>

        {leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-2xl font-black uppercase tracking-widest text-gray-400 mb-3">No Results Yet</p>
            <p className="text-gray-500 font-medium">Complete an activity room to appear on the leaderboard.</p>
            <Link
              href="/join"
              className="mt-6 inline-block bg-[var(--color-brand)] text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-md hover:bg-[var(--color-brand-dark)] transition-colors"
            >
              Join Activity Room →
            </Link>
          </div>
        ) : (
          <>
            {/* ── Podium ── */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-6 sm:gap-8 mb-0 w-full relative z-10">
                {podiumOrder.map((user, podiumIdx) => {
                  const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
                  return (
                    <div key={user.participantCode} className="flex flex-col items-center">
                      {/* Crown for 1st */}
                      {podiumIdx === 1 && (
                        <div className="w-8 h-8 bg-[var(--color-brand)] border-2 border-[var(--color-ink)] rounded-full flex items-center justify-center text-[#fff] text-base absolute z-10 -mt-5 shadow-sm">
                          ★
                        </div>
                      )}
                      {/* Avatar */}
                      <div className={`${PODIUM_SIZES[podiumIdx]} rounded-full border-4 ${MEDAL_COLORS[actualRank - 1]} mb-1 flex items-center justify-center shadow-[4px_4px_0px_0px_var(--color-ink)] mt-2`}>
                        <span className={`font-black text-[var(--color-ink)] ${podiumIdx === 1 ? "text-2xl" : "text-lg"}`}>
                          {user.initials}
                        </span>
                      </div>
                      <div className={`font-bold uppercase tracking-wide mb-1 text-[var(--color-ink)] ${podiumIdx === 1 ? "text-xl" : "text-lg"}`}>
                        {user.name.split(" ")[0].toUpperCase()}
                      </div>
                      <div className={`text-xs font-bold px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)] border-2 border-[var(--color-ink)] ${
                        podiumIdx === 1
                          ? "text-[var(--color-paper)] bg-[var(--color-ink)] tracking-wider text-sm"
                          : "text-[var(--color-brand)] bg-[var(--color-brand-tint)]"
                      }`}>
                        {user.bestScore.toFixed(1)} pts
                      </div>
                      <div
                        className={`w-28 sm:w-36 ${PODIUM_HEIGHTS[podiumIdx]} flex items-center justify-center rounded-t-lg ${
                          podiumIdx === 1
                            ? "bg-[var(--color-brand)] border-4 border-[var(--color-ink)] text-[#fff]"
                            : "bg-[var(--color-ink)] text-[var(--color-paper)]"
                        } text-5xl font-display`}
                        style={podiumIdx === 1 ? { WebkitTextStroke: "2px var(--color-ink)" } : {}}
                      >
                        {actualRank}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Base bar */}
            <div className="w-full max-w-lg sm:max-w-2xl h-[8px] bg-[var(--color-ink)] mb-12 relative z-0" />

            {/* ── Full Table ── */}
            <div className="w-full bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[28px] overflow-hidden shadow-sm">

              {/* Table header */}
              <div className="grid grid-cols-12 px-5 py-3 border-b border-[var(--color-line)] bg-[var(--color-fog)]">
                <span className="col-span-1 text-[10px] font-black uppercase tracking-widest text-gray-500">Rank</span>
                <span className="col-span-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Participant</span>
                <span className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Typing</span>
                <span className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Quiz</span>
                <span className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Best</span>
              </div>

              {leaderboard.map((user, i) => (
                <div
                  key={user.participantCode}
                  className={`grid grid-cols-12 items-center px-5 py-4 border-b border-[var(--color-line)] last:border-b-0 transition-colors ${
                    i < 3 ? "bg-[var(--color-brand-tint)]" : "hover:bg-[var(--color-fog)]"
                  }`}
                >
                  <span className="col-span-1 font-black text-base text-[var(--color-ink)]">
                    {i < 3 ? MEDALS[i] : `#${i + 1}`}
                  </span>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 border-2 ${
                      i < 3
                        ? "bg-[var(--color-brand)] border-[var(--color-brand)] text-[#fff]"
                        : "bg-[var(--color-mist)] border-[var(--color-line)] text-[var(--color-ink)]"
                    }`}>
                      {user.initials}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[var(--color-ink)] block">{user.name}</span>
                      <span className="text-[11px] text-gray-400 font-mono">{user.participantCode}</span>
                    </div>
                  </div>
                  <span className="col-span-2 text-center font-semibold text-sm text-[var(--color-ink)]">
                    {user.bestTypingScore.toFixed(1)}
                  </span>
                  <span className="col-span-2 text-center font-semibold text-sm text-[var(--color-ink)]">
                    {user.bestQuizScore.toFixed(1)}
                  </span>
                  <span className="col-span-2 text-right font-black text-sm text-[var(--color-brand)]">
                    {user.bestScore.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-6 text-center">
              {leaderboard.length} participants · Scores update in real-time
            </p>
          </>
        )}
      </div>
    </div>
  );
}
