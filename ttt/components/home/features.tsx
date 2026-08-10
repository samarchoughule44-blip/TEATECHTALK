"use client";

import { motion } from "framer-motion";
import { Keyboard, Trophy, BrainCircuit, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Keyboard,
    title: "Live typing arena",
    description:
      "Race against the clock across 30, 60 and 120 second sprints. Real-time WPM, accuracy and mistake tracking.",
  },
  {
    icon: BrainCircuit,
    title: "Tech quiz battles",
    description:
      "Ten-question rounds across AI, web dev, DBMS, networking and core CS — scored and ranked instantly.",
  },
  {
    icon: Trophy,
    title: "Real-time leaderboard",
    description:
      "Every point you earn updates your rank live. Sort by weekly, monthly or all-time standing.",
  },
  {
    icon: BadgeCheck,
    title: "Certificates & badges",
    description:
      "Milestones unlock verifiable badges and certificates you can showcase on your profile or resume.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Built for how students actually compete
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-muted)]">
          One platform to practice, compete, and track your growth across every
          activity we run.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Card className="group h-full p-6 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-tint)] text-[var(--color-brand)] transition-colors group-hover:bg-[var(--color-brand)] group-hover:text-[#fff]">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold">{feature.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-muted)]">
                {feature.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
