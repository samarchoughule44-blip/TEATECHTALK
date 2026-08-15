"use client";

import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/components/providers/auth-modal-provider";

const SPONSORS = ["Nimbus Cloud", "Vertex Labs", "Northstar", "Codeforge", "Lumen"];

export function Sponsors() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        Backed by
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {SPONSORS.map((name) => (
          <span
            key={name}
            className="text-lg font-semibold tracking-tight text-[var(--color-ink)]/30 transition-colors hover:text-[var(--color-ink)]"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  const { openModal } = useAuthModal();

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--color-ink)] px-8 py-16 text-center sm:px-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-brand)] opacity-20 blur-3xl" />
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Ready to see your name on the podium?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-white/60">
          Create your profile, join an activity, and start earning points in
          under two minutes.
        </p>
        <div className="mt-8">
          <Button onClick={() => openModal("signup")} variant="brand" size="lg" className="cursor-pointer">
            Join Tea Tech Talks
          </Button>
        </div>
      </div>
    </section>
  );
}
