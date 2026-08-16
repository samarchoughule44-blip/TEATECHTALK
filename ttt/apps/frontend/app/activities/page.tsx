"use client";

import Link from "next/link";

export default function ActivitiesPage() {
  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      {/* Header section with watermark */}
      <div className="relative overflow-hidden py-12 flex flex-col items-center">
        {/* Giant watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <span
            className="font-display uppercase tracking-widest text-[var(--color-brand)] opacity-20 text-[8vw] sm:text-[6rem] leading-none font-black"
          >
            ACTIVITIES
          </span>
        </div>

        {/* Heading */}
        <div className="relative z-10 text-center mt-8">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-widest border-b-4 border-black pb-2 inline-block">
            CURRENT EVENTS
          </h1>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
            Compete, learn, and earn points to climb the leaderboard.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16 grid md:grid-cols-2 gap-6">

        {/* Speed Typing Test */}
        <div className="border-4 border-[var(--color-ink)] p-8 bg-[var(--color-paper)] shadow-[var(--shadow-podium)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[var(--color-brand-tint)] -mr-12 -mt-12 pointer-events-none z-0" />
          <div className="relative z-10 flex flex-col flex-1">
            <div className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-5 self-start">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand)]" />
              LIVE
            </div>

            {/* Image area */}
            <div className="relative h-48 border-2 border-[var(--color-ink)] overflow-hidden bg-neutral-900 mb-6">
              <div
                className="absolute inset-0 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-300"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800')",
                }}
              />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide mb-4 text-[var(--color-brand)]">
              SPEED TYPING TEST
            </h2>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[var(--color-brand)] text-sm">🎯</span>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--color-ink)]">OBJECTIVE</span>
              </div>
              <p className="text-sm text-neutral-300 ml-6 font-medium">
                Achieve the highest Words Per Minute (WPM) with over 95% accuracy.
              </p>
            </div>

            <div className="mb-6 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--color-brand)] text-sm">🏆</span>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--color-ink)]">POINTS STRUCTURE</span>
              </div>
              <ul className="text-sm text-neutral-300 ml-6 border-l-2 border-[var(--color-ink)] pl-3 space-y-1 font-medium">
                <li>+10 PTS : Participation</li>
                <li>+50 PTS : Top 10% Accuracy</li>
                <li>+100 PTS : Overall Winner</li>
              </ul>
            </div>

            <Link
              href="/typing-test"
              className="mt-4 inline-flex items-center justify-center gap-2 border-2 border-[var(--color-ink)] px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors shadow-[var(--shadow-card)] hover:shadow-[2px_2px_0px_0px_var(--color-ink)]"
            >
              START TYPING TEST →
            </Link>
          </div>
        </div>

        {/* Tech Trivia */}
        <div className="border-4 border-[var(--color-ink)] p-8 bg-[var(--color-paper)] shadow-[var(--shadow-podium)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[var(--color-brand-tint)] -mr-12 -mt-12 pointer-events-none z-0" />
          <div className="relative z-10 flex flex-col flex-1">
            <div className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-5 self-start">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand)]" />
              STARTS SOON
            </div>

            {/* Phone mockup */}
            <div className="relative h-48 border-2 border-[var(--color-ink)] overflow-hidden bg-neutral-900 mb-6 flex items-center justify-center">
              <div className="w-24 h-40 border-2 border-[var(--color-ink)] rounded-xl bg-[var(--color-paper)] flex flex-col overflow-hidden shadow-lg relative">
                <div className="bg-[var(--color-ink)] text-[var(--color-paper)] text-[7px] font-bold p-1.5 leading-tight">
                  <div>TTT Activities</div>
                  <div className="opacity-70">Identify the correct shape!</div>
                </div>
                <div className="grid grid-cols-2 gap-1 p-1.5 flex-1 bg-[var(--color-paper)]">
                  <div className="border border-[var(--color-ink)] rounded flex items-center justify-center text-xs text-[var(--color-ink)]">▲</div>
                  <div className="border border-[var(--color-ink)] rounded flex items-center justify-center text-xs text-[var(--color-ink)]">◆</div>
                  <div className="border border-[var(--color-ink)] rounded flex items-center justify-center text-xs text-[var(--color-ink)]">●</div>
                  <div className="border border-[var(--color-ink)] rounded flex items-center justify-center text-xs text-[var(--color-ink)]">■</div>
                </div>
              </div>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide mb-4 text-[var(--color-brand)]">
              TECH TRIVIA (KAHOOT)
            </h2>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[var(--color-brand)] text-sm">🎯</span>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--color-ink)]">OBJECTIVE</span>
              </div>
              <p className="text-sm text-neutral-300 ml-6 font-medium">
                Answer rapid-fire questions on web dev, history, and general tech.
              </p>
            </div>

            <div className="mb-6 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--color-brand)] text-sm">🏆</span>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--color-ink)]">POINTS STRUCTURE</span>
              </div>
              <ul className="text-sm text-neutral-300 ml-6 border-l-2 border-[var(--color-ink)] pl-3 space-y-1 font-medium">
                <li>+15 PTS : Participation</li>
                <li>+30 PTS : Top 5 Finish</li>
                <li>+75 PTS : First Place</li>
              </ul>
            </div>

            <Link
              href="/room"
              className="mt-4 inline-flex items-center justify-center gap-2 border-2 border-[var(--color-ink)] px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors shadow-[var(--shadow-card)] hover:shadow-[2px_2px_0px_0px_var(--color-ink)]"
            >
              JOIN TRIVIA ROOM →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
