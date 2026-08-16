'use client'

import { useActionState } from 'react'

interface Props {
  onClose: () => void
  onCreated: (room: any) => void
  createAction: (prevState: unknown, formData: FormData) => Promise<{ success?: boolean; roomCode?: string; error?: string }>
}

export function RoomCreationModal({ onClose, onCreated, createAction }: Props) {
  const [state, formAction, isPending] = useActionState(createAction, null)

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-8 shadow-[6px_6px_0px_0px_var(--color-brand)] overflow-hidden">
        {/* Decorative corner accent circle */}
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-[var(--color-brand-tint)] -mr-12 -mt-12 pointer-events-none z-0" />

        <div className="relative z-10">
          {/* Top header row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-3">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse" />
                ADMIN CONTROL
              </div>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-[var(--color-brand)] leading-none">
                CREATE NEW ROOM
              </h2>
            </div>
            <button
              onClick={onClose}
              className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors p-2 shadow-[2px_2px_0px_0px_var(--color-ink)] shrink-0"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {state?.success ? (
            <div className="py-4 text-center">
              <div className="w-16 h-16 bg-[var(--color-brand-tint)] border-4 border-[var(--color-ink)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">
                <span className="text-3xl text-[var(--color-brand)] font-black">✓</span>
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wide mb-2 text-[var(--color-ink)]">
                ROOM CREATED!
              </h3>
              <p className="text-sm font-medium text-gray-400 mb-6">
                Share this unique Room ID with participants:
              </p>
              <div className="border-4 border-[var(--color-ink)] bg-[var(--color-ink)] p-4 mb-6 shadow-[4px_4px_0px_0px_var(--color-brand)]">
                <p className="font-mono font-black text-4xl text-[var(--color-paper)] tracking-widest">
                  {state.roomCode}
                </p>
              </div>
              <button
                onClick={() => {
                  onCreated({ roomCode: state.roomCode } as any)
                }}
                className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-brand)] text-white font-bold uppercase tracking-widest py-3 px-6 shadow-[3px_3px_0px_0px_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm"
              >
                GO TO DASHBOARD →
              </button>
            </div>
          ) : (
            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div className="border-2 border-red-600 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider px-4 py-3 shadow-[2px_2px_0px_0px_red]">
                  {state.error}
                </div>
              )}

              {/* Room ID info box */}
              <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-4 shadow-[3px_3px_0px_0px_var(--color-ink)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[var(--color-brand)] text-sm">🔑</span>
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--color-ink)]">
                    ROOM IDENTIFIER
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium ml-6">
                  A unique Room ID (e.g. <strong className="text-[var(--color-ink)] font-mono">TECH2026</strong>) will be generated automatically.
                </p>
              </div>

              {/* Typing duration */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-ink)] mb-2">
                  ⚡ Typing Test Duration
                </label>
                <select
                  name="typingDuration"
                  defaultValue="60"
                  className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] font-bold text-sm px-4 py-3 focus:outline-none shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all cursor-pointer"
                >
                  <option value="30" className="bg-[#141414] text-white">30 seconds</option>
                  <option value="60" className="bg-[#141414] text-white">60 seconds (recommended)</option>
                  <option value="90" className="bg-[#141414] text-white">90 seconds</option>
                  <option value="120" className="bg-[#141414] text-white">2 minutes</option>
                </select>
              </div>

              {/* Quiz duration */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-ink)] mb-2">
                  🧠 Quiz Duration
                </label>
                <select
                  name="quizDuration"
                  defaultValue="900"
                  className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] font-bold text-sm px-4 py-3 focus:outline-none shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all cursor-pointer"
                >
                  <option value="300" className="bg-[#141414] text-white">5 minutes</option>
                  <option value="600" className="bg-[#141414] text-white">10 minutes</option>
                  <option value="900" className="bg-[#141414] text-white">15 minutes (recommended)</option>
                  <option value="1200" className="bg-[#141414] text-white">20 minutes</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] font-bold uppercase tracking-widest py-3 text-xs shadow-[3px_3px_0px_0px_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 border-2 border-[var(--color-ink)] bg-[var(--color-brand)] hover:bg-[#b00322] disabled:opacity-50 text-white font-bold uppercase tracking-widest py-3 text-xs shadow-[3px_3px_0px_0px_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  {isPending ? 'CREATING...' : 'CREATE ROOM →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
