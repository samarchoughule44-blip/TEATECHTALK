import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)] transition-shadow duration-300",
        className
      )}
      {...props}
    />
  );
}
