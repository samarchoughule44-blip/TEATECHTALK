export const metadata = { title: "Contact | Tea Tech Talks" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
        Get in touch
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
        Contact
      </h1>
      <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-muted)]">
        Have a question about sponsorship, joining the committee, or
        reporting an issue? Reach out at hello@teatechtalks.dev.
      </p>
    </div>
  );
}
