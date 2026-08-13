export const metadata = { title: "About | Tea Tech Talks" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
        About TTT
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
        Who we are
      </h1>
      <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-muted)]">
        Tea Tech Talks is a student-run technical committee focused on
        hands-on skill-building through competitive typing, quizzes and
        speaker sessions — full mission, committee, timeline and gallery
        sections can be built out next.
      </p>
    </div>
  );
}
