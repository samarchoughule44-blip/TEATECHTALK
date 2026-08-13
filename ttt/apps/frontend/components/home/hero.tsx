"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-line)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--color-brand-tint)] blur-3xl opacity-60" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 text-center md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-1.5 text-[13px] font-medium text-[var(--color-muted)] shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
          Registrations open for Season 4
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-5xl font-semibold tracking-tight text-[var(--color-ink)] md:text-7xl"
        >
          Where campus talent
          <br />
          becomes <span className="text-[var(--color-brand)]">competitive</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-[var(--color-muted)]"
        >
          Tea Tech Talks is our college&apos;s technical committee platform —
          typing challenges, tech quizzes, live leaderboards, and a
          community that ships.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href="/login" variant="brand" size="lg" className="group">
            Join Tea Tech Talks
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button href="/activities" variant="outline" size="lg">
            Explore activities
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
