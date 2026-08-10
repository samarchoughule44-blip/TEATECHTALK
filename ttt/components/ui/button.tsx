import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] border-2 border-black uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--color-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-ink)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-[var(--color-ink)] hover:bg-[var(--color-fog)]",
        brand:
          "bg-[var(--color-brand)] text-[#fff] hover:bg-[var(--color-brand-dark)] border-black",
        outline:
          "border-2 border-black bg-white text-[var(--color-ink)] hover:bg-[var(--color-mist)]",
        ghost: "border-transparent shadow-none hover:translate-x-0 hover:translate-y-0 text-[var(--color-ink)] hover:bg-[var(--color-mist)] hover:shadow-none active:translate-x-0 active:translate-y-0",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { href?: string };

export function Button({ className, variant, size, href, children, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
