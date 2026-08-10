'use client'

import { useEffect, useState } from 'react'
import { isRestrictedDevice, getDeviceType } from '@/lib/device/detect'

interface Props {
  children: React.ReactNode
}

export function DeviceGuard({ children }: Props) {
  const [checked, setChecked] = useState(false)
  const [restricted, setRestricted] = useState(false)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const dt = getDeviceType()
    const blocked = isRestrictedDevice()
    setDeviceType(dt)
    setRestricted(blocked)
    setChecked(true)
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-[#D90429] rounded-full animate-spin" />
      </div>
    )
  }

  if (restricted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-[#D90429]/10 rounded-3xl rotate-6" />
            <div className="absolute inset-0 bg-[#D90429]/10 rounded-3xl -rotate-3" />
            <div className="relative w-full h-full bg-[#141414] border border-white/10 rounded-3xl flex items-center justify-center">
              {deviceType === 'tablet' ? (
                <svg className="w-12 h-12 text-[#D90429]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-[#D90429]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            {/* X badge */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#D90429] rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-black text-white mb-3">Device Not Supported</h1>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            This activity is available <span className="text-white font-semibold">only on Desktop and Laptop devices</span>.
            Please open this activity on a computer or laptop to continue.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Supported Devices</p>
            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Desktop</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Laptop</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            Detected device: <span className="text-gray-400 capitalize font-medium">{deviceType}</span>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
