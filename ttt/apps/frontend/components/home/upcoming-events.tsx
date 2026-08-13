"use client";

import { motion } from "framer-motion";
import { activitiesData } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Clock, Users } from "lucide-react";

export function UpcomingEvents() {
  return (
    <section className="border-t border-[var(--color-line)] bg-[var(--color-fog)]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Live right now
            </h2>
            <p className="mt-3 text-[15px] text-[var(--color-muted)]">
              Jump into an active challenge and start earning points today.
            </p>
          </div>
          <Button href="/activities" variant="outline" size="sm">
            View all activities
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {activitiesData.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group flex h-full flex-col justify-between p-7 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="live">{activity.status}</Badge>
                    <ArrowUpRight className="h-4 w-4 text-[var(--color-muted)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-brand)]" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{activity.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-muted)]">
                    {activity.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--color-line)] pt-5 text-[13px] text-[var(--color-muted)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {activity.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {activity.participants}
                  </span>
                  <span className="font-semibold text-[var(--color-brand)]">
                    {activity.rewardPoints}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
