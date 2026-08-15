"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@/components/providers/auth-modal-provider";
import { logout } from "@/app/logout/actions";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Activities", href: "/activities" },
];

export function Navbar({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useAuthModal();

  return (
    <header className="sticky top-0 z-50 bg-transparent px-4 py-4 relative">
      <div className="mx-auto max-w-5xl border border-white rounded-full flex h-[3.25rem] items-center justify-between px-5 bg-black shadow-sm">
        {/* Brand */}
        <Link href="/" className="shrink-0">
          <span className="text-[15px] font-black uppercase tracking-wide text-white">Tea Tech Talks</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-5 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors",
                  active
                    ? "bg-[#D90429] text-white"
                    : "text-[#d1e8f5] hover:bg-white/10" // Using a slight light blue/cyan tint based on the image
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
                "rounded-full px-5 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors",
                pathname === "/profile"
                  ? "bg-[#D90429] text-white"
                  : "text-[#d1e8f5] hover:bg-white/10"
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
                className="hidden sm:inline-flex bg-[#D90429] text-white font-black uppercase tracking-widest text-[11px] px-5 py-1.5 rounded-full hover:bg-red-700 transition-colors"
              >
                JOIN EVENT
              </Link>
              <button
                onClick={() => logout()}
                className="hidden sm:inline-flex bg-white text-black font-black uppercase tracking-widest text-[11px] px-5 py-1.5 rounded-full border border-white hover:bg-gray-200 transition-colors cursor-pointer"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openModal("login")}
                className="hidden sm:inline-flex border border-white text-white font-black uppercase tracking-widest text-[11px] px-5 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => openModal("signup")}
                className="hidden sm:inline-flex bg-white text-black font-black uppercase tracking-widest text-[11px] px-5 py-1.5 rounded-full border border-white hover:bg-gray-200 transition-colors cursor-pointer"
              >
                SIGNUP
              </button>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white ml-2 p-1 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[calc(100%+0.5rem)] left-4 right-4 bg-black border border-white rounded-2xl p-4 shadow-xl flex flex-col gap-3 z-50">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors text-center",
                  active
                    ? "bg-[#D90429] text-white"
                    : "text-[#d1e8f5] hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {isLoggedIn && (
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors text-center",
                pathname === "/profile"
                  ? "bg-[#D90429] text-white"
                  : "text-[#d1e8f5] hover:bg-white/10"
              )}
            >
              Profile
            </Link>
          )}

          <div className="h-px bg-white/20 my-2" />

          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="bg-white text-black font-black uppercase tracking-widest text-[11px] px-5 py-3 rounded-xl hover:bg-gray-200 transition-colors text-center w-full"
            >
              LOGOUT
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  openModal("login");
                  setIsMobileMenuOpen(false);
                }}
                className="border border-white text-white font-black uppercase tracking-widest text-[11px] px-5 py-3 rounded-xl hover:bg-white/10 transition-colors text-center w-full"
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => {
                  openModal("signup");
                  setIsMobileMenuOpen(false);
                }}
                className="bg-white text-black font-black uppercase tracking-widest text-[11px] px-5 py-3 rounded-xl hover:bg-gray-200 transition-colors text-center w-full"
              >
                SIGNUP
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
