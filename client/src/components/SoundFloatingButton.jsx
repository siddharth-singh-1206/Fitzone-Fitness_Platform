import React, { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '../context/SoundContext'

export default function SoundFloatingButton() {
  const { soundEnabled, toggleSound } = useSound()
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex items-center select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <div
        className={`absolute right-full mr-2.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide whitespace-nowrap bg-[#0e0e14]/95 text-gray-200 border border-white/15 backdrop-blur-xl shadow-xl transition-all duration-200 pointer-events-none ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1.5'
        }`}
      >
        Tactile Audio: <span className="font-bold text-white">{soundEnabled ? 'ON' : 'MUTED'}</span>
      </div>

      {/* Floating button */}
      <button
        id="sound-toggle-btn"
        onClick={toggleSound}
        aria-label="Toggle Sound FX"
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-xl shadow-2xl border ${
          soundEnabled
            ? 'bg-[#121218]/90 border-white/25 text-white hover:border-white/45 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.12)]'
            : 'bg-[#0a0a0f]/80 border-white/10 text-gray-400 hover:text-white hover:border-white/25 hover:scale-105'
        }`}
      >
        {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
      </button>
    </div>
  )
}
