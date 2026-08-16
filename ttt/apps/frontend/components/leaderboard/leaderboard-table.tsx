"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { leaderboardData } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


type Timeframe = "weekly" | "monthly" | "overall";

const TABS: { key: Timeframe; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "overall", label: "Overall" },
];

export function LeaderboardTable() {
  const [query, setQuery] = useState("");
  const [timeframe, setTimeframe] = useState<Timeframe>("overall");
  const [visibleCount, setVisibleCount] = useState(10);

  const rows = useMemo(() => {
    // In production, each timeframe would hit a different API endpoint.
    // Here we simulate variation by lightly reordering for weekly/monthly.
    const base = [...leaderboardData];
    if (timeframe === "weekly") base.reverse();
    return base.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, timeframe]);

  const displayedRows = useMemo(() => {
    return rows.slice(0, visibleCount);
  }, [rows, visibleCount]);

  const hasMore = visibleCount < rows.length;

  return (
    <div className="mx-auto mt-16 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search participants..."
            className="h-10 w-full rounded-lg border border-[var(--color-line)] bg-white pl-10 pr-4 text-[13.5px] outline-none transition-colors focus:border-[var(--color-ink)]"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-[var(--color-line)] bg-white p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setTimeframe(tab.key);
                setVisibleCount(10);
              }}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
                timeframe === tab.key
                  ? "bg-[var(--color-ink)] text-white"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white ">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-fog)] text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              <th className="px-5 py-3.5">Rank</th>
              <th className="px-5 py-3.5">Participant</th>
              <th className="hidden px-5 py-3.5 sm:table-cell">Department</th>
              <th className="hidden px-5 py-3.5 md:table-cell">Badges</th>
              <th className="px-5 py-3.5 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((entry, i) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: (i % 10) * 0.03 }}
                className="border-b border-[var(--color-line)] text-[13.5px] last:border-0 hover:bg-[var(--color-fog)] transition-colors"
              >
                <td className="px-5 py-3.5 font-semibold text-[var(--color-muted)]">
                  {entry.rank}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-mist)] text-[11px] font-semibold">
                      {entry.avatarInitials}
                    </div>
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-[11.5px] text-[var(--color-muted)] sm:hidden">
                        {entry.department}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-5 py-3.5 text-[var(--color-muted)] sm:table-cell">
                  {entry.department}
                </td>
                <td className="hidden px-5 py-3.5 md:table-cell">
                  <Badge variant="outline">{entry.badges} badges</Badge>
                </td>
                <td className="px-5 py-3.5 text-right font-semibold text-[var(--color-brand)]">
                  {entry.points.toLocaleString()}
                </td>
              </motion.tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[13.5px] text-[var(--color-muted)]">
                  No participants match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 10 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {hasMore && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="flex items-center gap-2 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-2.5 text-sm font-bold text-[var(--color-paper)] shadow-[3px_3px_0px_0px_var(--color-brand)] transition-all hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_var(--color-brand)] cursor-pointer"
            >
              <span>See More ({rows.length - visibleCount} remaining)</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          )}

          {visibleCount > 10 && (
            <button
              onClick={() => setVisibleCount(10)}
              className="flex items-center gap-2 rounded-xl border-2 border-[var(--color-ink)] bg-white px-6 py-2.5 text-sm font-bold text-[var(--color-ink)] shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_var(--color-ink)] cursor-pointer"
            >
              <span>Shrink</span>
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
