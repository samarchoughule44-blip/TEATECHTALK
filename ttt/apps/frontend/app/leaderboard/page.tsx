import Link from "next/link";
import { LeaderboardTableClient } from "@/components/leaderboard/leaderboard-table-client";

export const metadata = {
  title: "Leaderboard | Tea Tech Talks",
};

export const revalidate = 30;

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';

const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_COLORS = [
  "border-yellow-400 bg-yellow-400/10",
  "border-gray-300 bg-gray-300/10",
  "border-amber-600 bg-amber-600/10",
];
const PODIUM_HEIGHTS = ["h-36", "h-52", "h-24"];
const PODIUM_SIZES = ["w-16 h-16", "w-24 h-24", "w-16 h-16"];

type LeaderboardEntry = {
  name: string;
  participantCode: string;
  bestScore: number;
  totalScore: number;
  roomCount: number;
  bestTypingScore: number;
  bestQuizScore: number;
  rank: number;
  initials: string;
};

export default async function LeaderboardPage() {
  let leaderboard: LeaderboardEntry[] = [];
  try {
    const res = await fetch(`${BACKEND_URL}/api/leaderboard`, { next: { revalidate: 30 } });
    if (res.ok) {
      const data = await res.json();
      leaderboard = data.leaderboard ?? [];
    }
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
          className="z-10 text-[3.5rem] sm:text-[6.5rem] leading-none text-[var(--color-brand)] uppercase text-center mb-4 w-full"
          style={{ fontFamily: "var(--font-anton), Anton, Impact, sans-serif", letterSpacing: "0.02em" }}
        >
          LEADERBOARD
        </h1>
        <p className="z-10 text-gray-500 text-sm font-medium mb-10 uppercase tracking-widest">
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
                      <div className={`text-xs font-bold px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)] border-2 border-[var(--color-ink)] ${podiumIdx === 1
                        ? "text-[var(--color-paper)] bg-[var(--color-ink)] tracking-wider text-sm"
                        : "text-[var(--color-brand)] bg-[var(--color-brand-tint)]"
                        }`}>
                        {user.bestScore.toFixed(1)} pts
                      </div>
                      <div
                        className={`w-28 sm:w-36 ${PODIUM_HEIGHTS[podiumIdx]} flex items-center justify-center rounded-t-lg ${podiumIdx === 1
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
            <div className="w-full max-w-lg sm:max-w-2xl h-[8px] bg-[var(--color-ink)] mb-12 relative z-10" />

            {/* ── Full Table ── */}
            <LeaderboardTableClient leaderboard={leaderboard} />
          </>
        )}
      </div>
    </div>
  );
}
