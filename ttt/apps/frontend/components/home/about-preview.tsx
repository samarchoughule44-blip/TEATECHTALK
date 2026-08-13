"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function AboutPreview() {
  return (
    <section className="border-t border-[var(--color-line)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
            About TTT
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            A tech committee, run like a startup
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-muted)]">
            Tea Tech Talks began as a small student circle sharing knowledge
            over chai. Today it&apos;s our college&apos;s tech committee —
            running competitions, quiz nights and speaker sessions that
            reward genuine skill, not just attendance.
          </p>
          <div className="mt-8">
            <Button href="/about" variant="outline" size="md">
              Learn about our mission
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { label: "Founded", value: "2022" },
            { label: "Core team", value: "18" },
            { label: "Sessions run", value: "60+" },
            { label: "Departments reached", value: "6" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-fog)] p-6"
            >
              <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
              <p className="mt-1 text-[12.5px] text-[var(--color-muted)]">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
