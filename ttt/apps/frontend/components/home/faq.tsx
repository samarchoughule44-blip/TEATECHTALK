"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Who can join Tea Tech Talks?",
    a: "Any enrolled student at our college can join for free using their college email or a Google account. No prior experience required.",
  },
  {
    q: "How do I earn points?",
    a: "Points are awarded automatically when you complete a typing test or a quiz. Higher accuracy, speed, and difficulty earn more points, and every point updates the leaderboard in real time.",
  },
  {
    q: "Can I retake a typing test or quiz?",
    a: "Typing tests can be retaken anytime — only your best score counts toward the leaderboard. Quizzes reset weekly with a fresh question set.",
  },
  {
    q: "Do I get a certificate?",
    a: "Yes. Reaching point milestones and top leaderboard positions unlocks downloadable certificates and badges on your profile.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-[var(--color-line)] bg-[var(--color-fog)]">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mt-12 divide-y divide-[var(--color-line)] rounded-2xl border border-[var(--color-line)] bg-white">
          {FAQS.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-[14.5px] font-medium">{item.q}</span>
                <Plus
                  className={cn(
                    "h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform duration-300",
                    open === i && "rotate-45 text-[var(--color-brand)]"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-[13.5px] leading-relaxed text-[var(--color-muted)]">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
