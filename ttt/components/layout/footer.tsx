import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact Support", href: "/contact" },
  { label: "Archive", href: "/archive" },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 flex flex-col items-center">
        {/* Giant brand text */}
        <h2
          className="font-display text-[4rem] sm:text-[6.5rem] leading-none text-[var(--color-brand)] tracking-widest uppercase text-center w-full mb-10"
          style={{ letterSpacing: "0.05em" }}
        >
          Tea Tech Talks
        </h2>

        {/* Links row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-6 border-t border-white/10 pt-8 w-full">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs font-bold text-[var(--color-brand)] text-center tracking-wider">
          © {new Date().getFullYear()} Tea Tech Talks. Engineered for High-Stakes Competition.
        </p>
      </div>
    </footer>
  );
}
