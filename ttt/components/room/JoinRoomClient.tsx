'use client'

import { useActionState } from 'react'
import { joinRoomAction } from '@/app/join/actions'
import { DeviceGuard } from '@/components/device/DeviceGuard'
import Link from 'next/link'

function JoinForm() {
  const [state, formAction, isPending] = useActionState(joinRoomAction, null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D90429]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#D90429] rounded-xl flex items-center justify-center shadow-lg shadow-red-900/30">
              <span className="text-white font-black text-xs">TTT</span>
            </div>
            <span className="text-white font-black text-lg">Tea Tech Talks</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-6 pt-7 pb-5 border-b border-white/10">
            <h1 className="text-2xl font-black text-[#D90429]  mb-1">Join Activity Room</h1>
            <p className="text-sm text-gray-500">Enter your details and the Room ID to get started.</p>
          </div>

          <form action={formAction} className="p-6 space-y-4">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 flex items-start gap-3">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {state.error}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={80}
                placeholder="e.g. Samar Khan"
                autoComplete="name"
                className="w-full bg-white/5 border border-white/10 text-[#D90429]  rounded-xl px-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D90429]/50 focus:bg-white/[0.07] transition-all duration-200"
              />
            </div>

            {/* Participant ID */}
            <div>
              <label htmlFor="participantCode" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Participant ID / College ID
              </label>
              <input
                id="participantCode"
                name="participantCode"
                type="text"
                required
                minLength={2}
                maxLength={30}
                placeholder="e.g. CS2024001"
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 text-[#D90429]  rounded-xl px-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D90429]/50 focus:bg-white/[0.07] transition-all duration-200 font-mono uppercase"
              />
              <p className="text-xs text-gray-600 mt-1.5">Use your unique college roll number or assigned ID</p>
            </div>

            {/* Room ID */}
            <div>
              <label htmlFor="roomCode" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Room ID
              </label>
              <input
                id="roomCode"
                name="roomCode"
                type="text"
                required
                minLength={4}
                maxLength={12}
                placeholder="e.g. TECH2026"
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 text-[#D90429]  rounded-xl px-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D90429]/50 focus:bg-white/[0.07] transition-all duration-200 font-mono uppercase tracking-widest"
              />
              <p className="text-xs text-gray-600 mt-1.5">Ask the administrator for the Room ID</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="join-room-btn"
                disabled={isPending}
                className="w-full bg-[#D90429] hover:bg-[#b00322] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-red-900/20 tracking-wide"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Joining Room...
                  </span>
                ) : 'JOIN ROOM →'}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="px-6 pb-5">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
              <p className="text-xs text-amber-400/80">
                <span className="font-bold">Note:</span> This activity is for Desktop and Laptop devices only. Mobile and tablet devices are not supported.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function JoinRoomClient() {
  return (
    <DeviceGuard>
      <JoinForm />
    </DeviceGuard>
  )
}
