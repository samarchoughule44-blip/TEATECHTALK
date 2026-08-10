export const metadata = {
  title: "Leaderboard | Tea Tech Talks",
};

const top3 = [
  {
    rank: 2,
    name: "J. Doe",
    pts: "8,450 pts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JDoe&backgroundColor=b6e3f4",
  },
  {
    rank: 1,
    name: "A. Smith",
    pts: "10,200 pts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ASmith&backgroundColor=ffd5dc",
  },
  {
    rank: 3,
    name: "M. Lee",
    pts: "7,900 pts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MLee&backgroundColor=c0aede",
  },
];

const rows = [
  { rank: 4, name: "Sam River", initials: "SR", score: "6,500", badge: null, highlight: false },
  { rank: 5, name: "Taylor Kim", initials: "TK", score: "6,250", badge: null, highlight: false },
  { rank: 6, name: "Casey Jones", initials: "CJ", score: "5,800", badge: "TRENDING", highlight: false },
  { rank: 7, name: "Alex Li", initials: "AL", score: "5,100", badge: null, highlight: false },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="mx-auto max-w-2xl px-4 py-12 flex flex-col items-center">

        {/* ── Giant heading ── */}
        <h1
          className="text-[3.5rem] sm:text-[6.5rem] leading-none text-[var(--color-brand)] uppercase text-center mb-10 w-full"
          style={{ fontFamily: "var(--font-anton), Anton, Impact, sans-serif", letterSpacing: "0.02em" }}
        >
          LEADERBOARD
        </h1>

        {/* ── Search bar ── */}
        <div className="w-full max-w-md relative mb-10 border-5 ">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)] pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search participants..."
            className="w-full h-11 pl-11 pr-4 bg-[var(--color-paper)] text-[var(--color-ink)] text-sm placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[var(--color-brand)] border border-[var(--color-line)]"
          />
        </div>

        {/* ── Podium ── */}
        {/* Podium */}
        <div className="flex items-end justify-center gap-6 sm:gap-8 mb-0 w-full relative z-10">

          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-black mb-1 overflow-hidden bg-gray-300 flex items-center justify-center shadow-[4px_4px_0px_0px_var(--color-ink)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=e5e7eb" alt="Sarah" className="w-full h-full object-cover" />
            </div>
            <div className="font-bold text-lg uppercase tracking-wide mb-1 text-[var(--color-ink)]">SARAH</div>
            <div className="text-xs font-bold text-[var(--color-brand)] dark:text-[#fff] bg-[var(--color-brand-tint)] border-2 border-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">950 pt</div>
            <div className="w-28 sm:w-36 h-40 bg-[var(--color-ink)] text-[var(--color-paper)] text-5xl font-display flex items-center justify-center rounded-t-lg">
              2
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center relative z-20">
            <div className="w-8 h-8 bg-[var(--color-brand)] border-2 border-[var(--color-ink)] rounded-full flex items-center justify-center text-[#fff] text-base absolute -top-4 z-10 shadow-sm">
              ★
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-[var(--color-brand)] mb-1 overflow-hidden bg-[var(--color-paper)] flex items-center justify-center shadow-[6px_6px_0px_0px_var(--color-ink)] relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffffff" alt="Alex" className="w-full h-full object-cover" />
            </div>
            <div className="font-bold text-xl uppercase tracking-wide text-[var(--color-brand)] mt-2 mb-1">ALEX</div>
            <div
              className="text-sm font-bold text-[var(--color-paper)] bg-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)] tracking-wider"
            >
              1200 pt
            </div>
            <div
              className="w-32 sm:w-44 h-64 bg-[var(--color-brand)] border-4 border-[var(--color-ink)] text-[#fff] text-6xl font-display flex items-center justify-center rounded-t-lg"
              style={{ WebkitTextStroke: "2px var(--color-ink)" }}
            >
              1
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-black mb-1 overflow-hidden bg-gray-300 flex items-center justify-center shadow-[4px_4px_0px_0px_var(--color-ink)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie&backgroundColor=e5e7eb" alt="Jamie" className="w-full h-full object-cover" />
            </div>
            <div className="font-bold text-lg uppercase tracking-wide mb-1 text-[var(--color-ink)]">JAMIE</div>
            <div className="text-xs font-bold text-[var(--color-brand)] dark:text-[#fff] bg-[var(--color-brand-tint)] border-2 border-[var(--color-ink)] px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">820 pt</div>
            <div className="w-28 sm:w-36 h-32 bg-[var(--color-ink)] text-[var(--color-paper)] text-5xl font-display flex items-center justify-center rounded-t-lg">
              3
            </div>
          </div>
        </div>

        {/* Base bar */}
        <div className="w-full max-w-lg sm:max-w-2xl h-[8px] bg-[var(--color-ink)] mb-12 relative z-0"></div>

        {/* ── Leaderboard table ── */}
        <div className="w-full bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[28px] overflow-hidden shadow-sm">

          {/* Table header */}
          <div className="flex justify-between items-center px-5 py-3 border-b border-[var(--color-line)] bg-[var(--color-fog)]">
            <div className="flex gap-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Rank</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Participant</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Score</span>
          </div>

          {/* Rows */}
          {rows.map((user) => (
            <div
              key={user.rank}
              className={`flex justify-between items-center px-5 py-4 border-b border-[var(--color-line)] last:border-b-0 transition-colors ${user.highlight ? "bg-[var(--color-brand-tint)]" : "hover:bg-[var(--color-fog)]"
                }`}
            >
              <div className="flex items-center gap-5">
                <span className="font-black text-base text-[var(--color-ink)] w-5 shrink-0">{user.rank}</span>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 border-2 ${user.highlight
                      ? "bg-[var(--color-brand)] border-[var(--color-brand)] text-[#fff]"
                      : "bg-[var(--color-mist)] border-[var(--color-line)] text-[var(--color-ink)]"
                      }`}
                  >
                    {user.initials}
                  </div>
                  <span className="font-bold text-sm text-[var(--color-ink)]">{user.name}</span>
                  {user.badge && (
                    <span className="bg-[var(--color-ink)] text-[var(--color-paper)] text-[9px] font-black px-2 py-0.5 uppercase tracking-widest border border-[var(--color-ink)]">
                      {user.badge}
                    </span>
                  )}
                </div>
              </div>
              <span className="font-black text-sm text-[var(--color-brand)]">{user.score}</span>
            </div>
          ))}

          {/* Load more */}
          <button className="w-full py-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-fog)] transition-colors border-t border-[var(--color-line)]">
            Load More...
          </button>
        </div>

      </div>
    </div>
  );
}
