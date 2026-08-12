"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/app/logout/actions";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Activities", href: "/activities" },
];

export function Navbar({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-3">
      <div className="mx-auto max-w-5xl border-3 border-black rounded-xl flex h-12 items-center justify-between px-5 bg-white shadow-sm">
        {/* Brand */}
        <Link href="/" className="shrink-0">
          <span className="text-[15px] font-black uppercase tracking-wide text-black">Tea Tech Talks</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors",
                  active
                    ? "bg-[var(--color-brand)] text-[#fff]"
                    : "text-black hover:bg-[#D90429]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {isLoggedIn && (
            <Link
              href="/profile"
              className={cn(
                "rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors",
                pathname === "/profile"
                  ? "bg-[var(--color-brand)] text-[#fff]"
                  : "text-black hover:bg-[#D90429]"
              )}
            >
              Profile
            </Link>
          )}
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                href="/join"
                className="hidden sm:inline-flex bg-[var(--color-brand)] text-[#fff] font-black uppercase tracking-widest text-[11px] px-4 py-1.5 rounded-full hover:bg-[var(--color-brand-dark)] transition-colors"
              >
                JOIN EVENT
              </Link>
              <button
                onClick={() => logout()}
                className="bg-black text-white font-black uppercase tracking-widest text-[11px] px-4 py-1.5 rounded-full border-2 border-black hover:bg-black transition-colors cursor-pointer"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex border-2 border-black text-black font-black uppercase tracking-widest text-[11px] px-4 py-1.5 rounded-full hover:bg-[#D90429] transition-colors"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="bg-black text-white font-black uppercase tracking-widest text-[11px] px-4 py-1.5 rounded-full border-2 border-black hover:bg-[#D90429] transition-colors"
              >
                SIGNUP
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
