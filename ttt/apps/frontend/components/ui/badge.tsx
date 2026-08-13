import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "brand" | "outline" | "live";
  className?: string;
}) {
  const styles = {
    default: "bg-[var(--color-mist)] text-[var(--color-ink)]",
    brand: "bg-[var(--color-brand)] text-[#fff]",
    outline: "border border-[var(--color-line)] text-[var(--color-muted)]",
    live: "bg-[var(--color-brand-tint)] text-[var(--color-brand)]",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        styles,
        className
      )}
    >
      {variant === "live" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand)] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
        </span>
      )}
      {children}
    </span>
  );
}
