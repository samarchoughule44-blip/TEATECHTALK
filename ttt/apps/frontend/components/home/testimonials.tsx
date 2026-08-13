"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    quote:
      "The leaderboard genuinely made me practice typing every day. I went from 45 to 78 WPM in a semester.",
    name: "Ananya Deshmukh",
    role: "3rd Year, Computer Engineering",
  },
  {
    quote:
      "Tech quizzes here are harder than most placement tests I've taken. Great way to stay sharp between semesters.",
    name: "Rohan Patil",
    role: "4th Year, Information Technology",
  },
  {
    quote:
      "Won a certificate from the quiz challenge and actually used it in my resume. Committee runs this like a real product.",
    name: "Meher Iyer",
    role: "2nd Year, AI & Data Science",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          What the community says
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="h-full p-7">
              <p className="text-[14.5px] leading-relaxed text-[var(--color-ink)]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-[var(--color-line)] pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-mist)] text-xs font-semibold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold">{t.name}</p>
                  <p className="text-[12px] text-[var(--color-muted)]">{t.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
