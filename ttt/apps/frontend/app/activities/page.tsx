"use client";

import Link from "next/link";

export default function ActivitiesPage() {
  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      {/* Header section with watermark */}
      <div className="relative overflow-hidden py-12 flex flex-col items-center">
        {/* Giant watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <span
            className="font-display uppercase tracking-widest text-[var(--color-brand)] opacity-20 text-[8vw] sm:text-[6rem] leading-none font-black"
          >
            ACTIVITIES
          </span>
        </div>

        {/* Heading */}
        <div className="relative z-10 text-center mt-8">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-widest border-b-4 border-black pb-2 inline-block">
            CURRENT EVENTS
          </h1>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
            Compete, learn, and earn points to climb the leaderboard.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16 grid md:grid-cols-2 gap-6">

        {/* Speed Typing Test */}
        <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[4px_4px_0px_0px_var(--color-ink)] flex flex-col">
          {/* Image area */}
          <div className="relative h-52 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center grayscale"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800')",
              }}
            />
            <span className="absolute top-3 right-3 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
              LIVE
            </span>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            <h2 className="text-red-500 font-black uppercase tracking-wide mb-4">SPEED TYPING TEST</h2>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[var(--color-brand)] text-sm">🎯</span>
                <span className="text-xs font-black uppercase tracking-widest text-black">OBJECTIVE</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 ml-6 font-medium">
                Achieve the highest Words Per Minute (WPM) with over 95% accuracy.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--color-brand)] text-sm">🏆</span>
                <span className="text-xs font-black uppercase tracking-widest text-black">POINTS STRUCTURE</span>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 ml-6 border-l-2 border-gray-300 dark:border-gray-700 pl-3 space-y-1 font-medium">
                <li>+10 PTS : Participation</li>
                <li>+50 PTS : Top 10% Accuracy</li>
                <li>+100 PTS : Overall Winner</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tech Trivia */}
        <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[4px_4px_0px_0px_var(--color-ink)] flex flex-col">
          {/* Image area */}
          <div className="relative h-52 bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
            {/* Phone mockup */}
            <div className="w-28 h-48 border-4 border-black rounded-2xl bg-white flex flex-col overflow-hidden shadow-lg relative">
              <div className="bg-[#222] text-white text-[7px] font-bold p-2 leading-tight">
                <div>TTT Activities</div>
                <div className="text-gray-400">Identify the correct shape!</div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-2 flex-1 bg-white">
                <div className="border-2 border-black rounded flex items-center justify-center text-xl">▲</div>
                <div className="border-2 border-black rounded flex items-center justify-center text-xl">◆</div>
                <div className="border-2 border-black rounded flex items-center justify-center text-xl">●</div>
                <div className="border-2 border-black rounded flex items-center justify-center text-xl">■</div>
              </div>
            </div>
            <span className="absolute top-3 right-3 bg-[var(--color-brand)] text-[#fff] text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
              STARTS SOON
            </span>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            <h2 className="text-red-500
             font-black uppercase tracking-wide mb-4">TECH TRIVIA (KAHOOT)</h2>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[var(--color-brand)] text-sm">🎯</span>
                <span className="text-xs font-black uppercase tracking-widest text-black">OBJECTIVE</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 ml-6 font-medium">
                Answer rapid-fire questions on web dev, history, and general tech.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--color-brand)] text-sm">🏆</span>
                <span className="text-xs font-black uppercase tracking-widest text-black">POINTS STRUCTURE</span>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 ml-6 border-l-2 border-gray-300 dark:border-gray-700 pl-3 space-y-1 font-medium">
                <li>+15 PTS : Participation</li>
                <li>+30 PTS : Top 5 Finish</li>
                <li>+75 PTS : First Place</li>
              </ul>
            </div>


          </div>
        </div>

      </div>
    </div>
  );
}
