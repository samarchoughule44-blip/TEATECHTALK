"use client";

import { motion } from "framer-motion";
import { Clock, Users, Zap, Keyboard, BrainCircuit } from "lucide-react";
import type { Activity } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ICONS = { Typing: Keyboard, Quiz: BrainCircuit };

const DIFFICULTY_COLOR: Record<Activity["difficulty"], string> = {
  Beginner: "text-emerald-600 bg-emerald-50",
  Intermediate: "text-amber-600 bg-amber-50",
  Advanced: "text-[var(--color-brand)] bg-[var(--color-brand-tint)]",
};

export function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const Icon = ICONS[activity.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group flex h-full flex-col overflow-hidden hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300">
        <div className="relative flex h-40 items-center justify-center bg-[var(--color-ink)]">
          <Icon className="h-14 w-14 text-white/15 transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute left-4 top-4">
            <Badge variant="live">{activity.status}</Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{activity.title}</h3>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${DIFFICULTY_COLOR[activity.difficulty]}`}
            >
              {activity.difficulty}
            </span>
          </div>
          <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-[var(--color-muted)]">
            {activity.description}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--color-line)] pt-4 text-[12px] text-[var(--color-muted)]">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {activity.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {activity.participants}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-[var(--color-brand)]">
              <Zap className="h-3.5 w-3.5" /> {activity.rewardPoints}
            </span>
          </div>

          <Button href="/login" variant="primary" size="md" className="mt-6 w-full">
            Join activity
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
