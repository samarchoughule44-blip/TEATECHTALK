'use client'

import { useTransition, useState, useActionState } from 'react'

interface Props {
  onClose: () => void
  onCreated: (room: any) => void
  createAction: (prevState: unknown, formData: FormData) => Promise<{ success?: boolean; roomCode?: string; error?: string }>
}

export function RoomCreationModal({ onClose, onCreated, createAction }: Props) {
  const [state, formAction, isPending] = useActionState(createAction, null)

  // When room is created successfully, notify parent
  if (state?.success && state.roomCode) {
    // Show success state before closing
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Create New Room</h2>
            <p className="text-xs text-gray-500 mt-0.5">Configure and generate a new activity room</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {state?.success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-black text-white mb-2">Room Created!</h3>
            <p className="text-gray-400 text-sm mb-4">Share this Room ID with participants:</p>
            <div className="bg-[#D90429]/10 border border-[#D90429]/30 rounded-xl p-4 mb-6">
              <p className="font-mono font-black text-3xl text-[#D90429] tracking-widest">{state.roomCode}</p>
            </div>
            <button
              onClick={() => {
                onCreated({ roomCode: state.roomCode } as any)
              }}
              className="w-full bg-[#D90429] hover:bg-[#b00322] text-white font-bold py-3 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form action={formAction} className="p-6 space-y-5">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                {state.error}
              </div>
            )}

            {/* Auto-generated room code info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 font-medium">Room ID</p>
              <p className="text-sm text-gray-300">A unique Room ID (e.g. <span className="font-mono font-bold text-white">TECH2026</span>) will be generated automatically.</p>
            </div>

            {/* Typing duration */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Typing Test Duration (seconds)
              </label>
              <select
                name="typingDuration"
                defaultValue="60"
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D90429]/50 transition-colors"
              >
                <option value="30" className="bg-[#141414]">30 seconds</option>
                <option value="60" className="bg-[#141414]">60 seconds (recommended)</option>
                <option value="90" className="bg-[#141414]">90 seconds</option>
                <option value="120" className="bg-[#141414]">2 minutes</option>
              </select>
            </div>

            {/* Quiz duration */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Quiz Duration (minutes)
              </label>
              <select
                name="quizDuration"
                defaultValue="900"
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D90429]/50 transition-colors"
              >
                <option value="300" className="bg-[#141414]">5 minutes</option>
                <option value="600" className="bg-[#141414]">10 minutes</option>
                <option value="900" className="bg-[#141414]">15 minutes (recommended)</option>
                <option value="1200" className="bg-[#141414]">20 minutes</option>
              </select>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold py-3 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[#D90429] hover:bg-[#b00322] disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors text-sm"
              >
                {isPending ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
