"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function PodiumSpot({
  entry,
  place,
}: {
  entry: LeaderboardEntry;
  place: 1 | 2 | 3;
}) {
  const isFirst = place === 1;
  const height = isFirst ? "h-44" : place === 2 ? "h-32" : "h-24";
  const order = isFirst ? "order-2" : place === 2 ? "order-1" : "order-3";

  return (
    <div className={cn("flex flex-col items-center", order)}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: place * 0.1 }}
        className="flex flex-col items-center"
      >
        {isFirst && (
          <Crown className="mb-1 h-6 w-6 fill-[var(--color-brand)] text-[var(--color-brand)]" />
        )}
        <div
          className={cn(
            "flex items-center justify-center rounded-full font-semibold text-white",
            isFirst ? "h-20 w-20 text-2xl ring-4 ring-[var(--color-brand-tint)]" : "h-14 w-14 text-base",
            isFirst ? "bg-[var(--color-brand)]" : "bg-[var(--color-ink)]"
          )}
        >
          {entry.avatarInitials}
        </div>
        <p className="mt-3 text-[13.5px] font-semibold">{entry.name}</p>
        <p className="text-[12px] text-[var(--color-muted)]">
          {entry.points.toLocaleString()} pts
        </p>
      </motion.div>

      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.2 + place * 0.1, ease: "easeOut" }}
        style={{ transformOrigin: "bottom" }}
        className={cn(
          "mt-5 flex w-24 items-start justify-center rounded-t-xl pt-3 sm:w-32",
          height,
          isFirst
            ? "bg-[var(--color-brand)] shadow-[var(--shadow-podium)]"
            : "bg-[var(--color-ink)]"
        )}
      >
        <span className="text-3xl font-bold text-white">{place}</span>
      </motion.div>
    </div>
  );
}

export function Podium({ top3 }: { top3: LeaderboardEntry[] }) {
  const [first, second, third] = top3;
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6">
      {second && <PodiumSpot entry={second} place={2} />}
      {first && <PodiumSpot entry={first} place={1} />}
      {third && <PodiumSpot entry={third} place={3} />}
    </div>
  );
}
