"use client";

import Link from "next/link";
export default function HomePage() {
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
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--color-ink)] mb-1 overflow-hidden bg-neutral-800 flex items-center justify-center shadow-[var(--shadow-card)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=e5e7eb" alt="Sarah" className="w-full h-full object-cover" />
            </div>
            <div className="font-bold text-lg uppercase tracking-wide mb-1 text-[var(--color-ink)]">SARAH</div>
            <div className="text-xs font-bold text-[var(--color-brand)] bg-[var(--color-brand-tint)] border-2 border-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">950 pt</div>
            <div className="w-28 sm:w-36 h-40 bg-[var(--color-ink)] text-[var(--color-paper)] text-5xl font-display flex items-center justify-center rounded-lg ">
              2
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center relative z-20">
            <div className="w-8 h-8 bg-[var(--color-brand)] border-2 border-[var(--color-ink)] rounded-full flex items-center justify-center text-[var(--color-paper)] text-base absolute -top-4 z-10 shadow-sm">
              ★
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-[var(--color-brand)] mb-1 overflow-hidden bg-[var(--color-paper)] flex items-center justify-center shadow-[var(--shadow-podium)] relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffffff" alt="Alex" className="w-full h-full object-cover" />
            </div>
            <div className="font-bold text-xl uppercase tracking-wide text-[var(--color-brand)] mt-2 mb-1">ALEX</div>
            <div
              className="text-sm font-bold text-[var(--color-paper)] bg-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)] tracking-wider"
              style={{ textShadow: "-1px 0px 0px #0ff, 1px 0px 0px #f00" }}
            >
              1200 pt
            </div>
            <div
              className="w-32 sm:w-44 h-64 bg-[var(--color-brand)] border-4 border-[var(--color-ink)] border-b-0 text-[var(--color-paper)] text-6xl font-display flex items-center justify-center  rounded-lg"
              style={{ WebkitTextStroke: "2px var(--color-ink)" }}
            >
              1
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--color-ink)] mb-1 overflow-hidden bg-neutral-800 flex items-center justify-center shadow-[var(--shadow-card)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie&backgroundColor=e5e7eb" alt="Jamie" className="w-full h-full object-cover" />
            </div>
            <div className="font-bold text-lg uppercase tracking-wide mb-1 text-[var(--color-ink)]">JAMIE</div>
            <div className="text-xs font-bold text-[var(--color-brand)] bg-[var(--color-brand-tint)] border-2 border-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">820 pt</div>
            <div className="w-28 sm:w-36 h-32 bg-[var(--color-ink)] text-[var(--color-paper)] text-5xl font-display flex items-center justify-center rounded-lg">
              3
            </div>
          </div>
        </div>

        {/* Base bar */}
        <div className="w-full max-w-3xl h-[6px] bg-[var(--color-ink)] mb-12 -mt-[6px] relative z-0"></div>

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
