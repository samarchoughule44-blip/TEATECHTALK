import Link from "next/link";

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';

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

export default async function HomePage() {
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
  const first = top3[0] || null;
  const second = top3[1] || null;
  const third = top3[2] || null;

  return (
    <>
      {/* ── Page content: sits above the background ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 flex flex-col items-center">

        {/* Big red heading */}
        <h1
          className="text-[6rem] sm:text-[10rem] leading-none text-[var(--color-brand)] uppercase mb-16 text-center"
          style={{ fontFamily: "var(--font-anton), Anton, Impact, sans-serif", letterSpacing: "0.01em" }}
        >
          LEADER
        </h1>

        {/* Podium */}
        <div className="flex items-end justify-center gap-6 sm:gap-8 mb-0 w-full relative z-10">

          {/* 2nd Place */}
          {second ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-[var(--color-ink)] mb-1 overflow-hidden bg-neutral-800 flex items-center justify-center shadow-[var(--shadow-card)]">
                <span className="font-black text-white text-lg">{second.initials}</span>
              </div>
              <div className="font-bold text-lg uppercase tracking-wide mb-1 text-[var(--color-ink)]">
                {second.name.split(" ")[0].toUpperCase()}
              </div>
              <div className="text-xs font-bold text-[var(--color-brand)] bg-[var(--color-brand-tint)] border-2 border-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">
                {second.bestScore.toFixed(1)} pt
              </div>
              <div className="w-28 sm:w-36 h-40 bg-[var(--color-ink)] text-[var(--color-paper)] text-5xl font-display flex items-center justify-center rounded-lg">
                2
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-30">
              <div className="w-16 h-16 rounded-full border-4 border-dashed border-[var(--color-ink)] mb-1 flex items-center justify-center">
                <span className="text-gray-400 font-bold text-sm">—</span>
              </div>
              <div className="font-bold text-lg uppercase tracking-wide mb-1 text-[var(--color-ink)]">—</div>
              <div className="text-xs font-bold text-gray-400 bg-neutral-100 border-2 border-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">—</div>
              <div className="w-28 sm:w-36 h-40 bg-neutral-200 text-gray-400 text-5xl font-display flex items-center justify-center rounded-lg">
                2
              </div>
            </div>
          )}

          {/* 1st Place */}
          {first ? (
            <div className="flex flex-col items-center relative z-20">
              <div className="w-8 h-8 bg-[var(--color-brand)] border-2 border-[var(--color-ink)] rounded-full flex items-center justify-center text-[var(--color-paper)] text-base absolute -top-4 z-10 shadow-sm">
                ★
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-[var(--color-brand)] mb-1 overflow-hidden bg-[var(--color-paper)] flex items-center justify-center shadow-[var(--shadow-podium)] relative">
                <span className="font-black text-[var(--color-ink)] text-2xl">{first.initials}</span>
              </div>
              <div className="font-bold text-xl uppercase tracking-wide text-[var(--color-brand)] mt-2 mb-1">
                {first.name.split(" ")[0].toUpperCase()}
              </div>
              <div
                className="text-sm font-bold text-[var(--color-paper)] bg-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)] tracking-wider"
                style={{ textShadow: "-1px 0px 0px #0ff, 1px 0px 0px #f00" }}
              >
                {first.bestScore.toFixed(1)} pt
              </div>
              <div
                className="w-32 sm:w-44 h-64 bg-[var(--color-brand)] border-4 border-[var(--color-ink)] border-b-0 text-[var(--color-paper)] text-6xl font-display flex items-center justify-center rounded-lg"
                style={{ WebkitTextStroke: "2px var(--color-ink)" }}
              >
                1
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center relative z-20 opacity-30">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-[var(--color-brand)] mb-1 flex items-center justify-center">
                <span className="text-gray-400 font-bold text-lg">—</span>
              </div>
              <div className="font-bold text-xl uppercase tracking-wide text-gray-400 mt-2 mb-1">—</div>
              <div className="text-sm font-bold text-gray-400 bg-neutral-100 px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)] tracking-wider">—</div>
              <div className="w-32 sm:w-44 h-64 bg-neutral-200 border-4 border-[var(--color-ink)] border-b-0 text-gray-400 text-6xl font-display flex items-center justify-center rounded-lg">
                1
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {third ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-[var(--color-ink)] mb-1 overflow-hidden bg-neutral-800 flex items-center justify-center shadow-[var(--shadow-card)]">
                <span className="font-black text-white text-lg">{third.initials}</span>
              </div>
              <div className="font-bold text-lg uppercase tracking-wide mb-1 text-[var(--color-ink)]">
                {third.name.split(" ")[0].toUpperCase()}
              </div>
              <div className="text-xs font-bold text-[var(--color-brand)] bg-[var(--color-brand-tint)] border-2 border-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">
                {third.bestScore.toFixed(1)} pt
              </div>
              <div className="w-28 sm:w-36 h-32 bg-[var(--color-ink)] text-[var(--color-paper)] text-5xl font-display flex items-center justify-center rounded-lg">
                3
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-30">
              <div className="w-16 h-16 rounded-full border-4 border-dashed border-[var(--color-ink)] mb-1 flex items-center justify-center">
                <span className="text-gray-400 font-bold text-sm">—</span>
              </div>
              <div className="font-bold text-lg uppercase tracking-wide mb-1 text-[var(--color-ink)]">—</div>
              <div className="text-xs font-bold text-gray-400 bg-neutral-100 border-2 border-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">—</div>
              <div className="w-28 sm:w-36 h-32 bg-neutral-200 text-gray-400 text-5xl font-display flex items-center justify-center rounded-lg">
                3
              </div>
            </div>
          )}
        </div>

        {/* Base bar */}
        <div className="w-full max-w-3xl h-[6px] bg-[var(--color-ink)] mb-12 -mt-[6px] relative z-10"></div>

        {/* CTA Button */}
        <div className="mb-20">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 border-2 border-[var(--color-ink)] px-8 py-3 text-sm font-bold uppercase tracking-widest bg-[var(--color-paper)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors shadow-[var(--shadow-card)] hover:shadow-[2px_2px_0px_0px_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            VIEW DETAILED LEADERBOARD →
          </Link>
        </div>

        {/* About + Prizes cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full">

          {/* About TTT */}
          <div className="border-4 border-[var(--color-ink)] p-8 bg-[var(--color-paper)] shadow-[var(--shadow-podium)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[var(--color-brand-tint)] -mr-12 -mt-12 pointer-events-none z-0" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-5">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand)]" />
                Mission
              </div>
              <h2 className="font-display text-4xl uppercase tracking-wide mb-4">ABOUT TTT</h2>
              <p className="text-sm leading-relaxed text-neutral-300">
                <strong className="text-[var(--color-ink)]">Tea Tech Talks</strong> is a tech event where students teach students about programming and tech stuff. Engineered for high-stakes competition and academic prestige, we prioritize raw knowledge sharing and technical grit.
              </p>
            </div>
          </div>

          {/* Prizes */}
          <div className="border-4 border-[var(--color-ink)] p-8 bg-[var(--color-paper)] shadow-[var(--shadow-podium)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-4xl text-[var(--color-brand)] uppercase tracking-wide">PRIZES</h2>
              <span className="text-3xl">🏆</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-2 border-[var(--color-ink)] p-3">
                <div className="w-8 h-8 bg-[var(--color-ink)] text-[var(--color-paper)] font-display text-lg flex items-center justify-center shrink-0 border-2 border-[var(--color-ink)]">
                  1
                </div>
                <div>
                  <div className="font-bold text-xs uppercase tracking-wide">MECHANICAL KEYBOARD</div>
                  <div className="text-xs text-gray-500 font-medium">Value: $150</div>
                </div>
              </div>
              <div className="flex items-center gap-4 border-2 border-[var(--color-ink)] p-3">
                <div className="w-8 h-8 bg-[var(--color-paper)] text-[var(--color-ink)] font-display text-lg flex items-center justify-center shrink-0 border-2 border-[var(--color-ink)]">
                  2
                </div>
                <div>
                  <div className="font-bold text-xs uppercase tracking-wide">TECH BACKPACK</div>
                  <div className="text-xs text-gray-500 font-medium">Value: $80</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
