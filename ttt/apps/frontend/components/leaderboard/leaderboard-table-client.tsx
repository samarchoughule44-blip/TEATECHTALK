"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const MEDALS = ["🥇", "🥈", "🥉"];

export type LeaderboardEntry = {
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

interface Props {
  leaderboard: LeaderboardEntry[];
}

export function LeaderboardTableClient({ leaderboard }: Props) {
  const [visibleCount, setVisibleCount] = useState(10);

  const displayedEntries = leaderboard.slice(0, visibleCount);
  const hasMore = visibleCount < leaderboard.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleShrink = () => {
    setVisibleCount(10);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ── Full Table ── */}
      <div className="z-10 w-full bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[28px] overflow-hidden shadow-sm">
        {/* Table header */}
        <div className="grid grid-cols-12 px-5 py-3 border-b border-[var(--color-line)] bg-[var(--color-fog)]">
          <span className="col-span-1 text-[10px] font-black uppercase tracking-widest text-gray-500">Rank</span>
          <span className="col-span-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Participant</span>
          <span className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Typing</span>
          <span className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Quiz</span>
          <span className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Best</span>
        </div>

        {displayedEntries.map((user, i) => (
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
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 border-2 ${
                  i < 3
                    ? "bg-[var(--color-brand)] border-[var(--color-brand)] text-[#fff]"
                    : "bg-[var(--color-mist)] border-[var(--color-line)] text-[var(--color-ink)]"
                }`}
              >
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

      {/* ── See More / Shrink Buttons ── */}
      {leaderboard.length > 10 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {hasMore && (
            <button
              onClick={handleSeeMore}
              className="z-10 flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] font-bold text-sm py-2.5 px-6 rounded-xl border-2 border-[var(--color-ink)] shadow-[3px_3px_0px_0px_var(--color-brand)] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_var(--color-brand)] active:translate-y-[0px] transition-all cursor-pointer"
            >
              <span>See More ({leaderboard.length - visibleCount} remaining)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {visibleCount > 10 && (
            <button
              onClick={handleShrink}
              className="z-10 flex items-center gap-2 bg-[var(--color-paper)] text-[var(--color-ink)] font-bold text-sm py-2.5 px-6 rounded-xl border-2 border-[var(--color-ink)] shadow-[3px_3px_0px_0px_var(--color-ink)] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_var(--color-ink)] active:translate-y-[0px] transition-all cursor-pointer"
            >
              <span>Shrink</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <p className="z-10 text-xs text-gray-500 mt-6 text-center">
        Showing {displayedEntries.length} of {leaderboard.length} participants · Scores update in real-time
      </p>
    </div>
  );
}
