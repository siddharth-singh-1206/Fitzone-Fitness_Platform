import React, { useState } from 'react'
import { Sparkles, MapPin, X, ChevronRight } from 'lucide-react'
import { useFreePass } from '../context/PassModalContext'

export default function LiveGymStatusBar() {
  const [isVisible, setIsVisible] = useState(true)
  const { openPassModal } = useFreePass()

  if (!isVisible) return null

  // Check if currently open (gym hours 05:00 to 23:00)
  const currentHour = new Date().getHours()
  const isOpenNow = currentHour >= 5 && currentHour < 23

  return (
    <div className="bg-[#0b0b10]/90 backdrop-blur-xl border-b border-white/10 text-gray-300 text-xs font-medium py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Live Status & Location */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-0.5 rounded-full text-[11px] font-semibold text-white">
            <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isOpenNow ? 'Open Now • 05:00 AM – 11:00 PM' : 'Opens Tomorrow at 05:00 AM'}</span>
          </div>

          <a
            href="https://maps.google.com/?q=FitZone+Gym"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1 hover:text-white text-gray-400 text-[11px] transition-colors"
          >
            <MapPin size={12} /> Cyber City, Phase 2
          </a>
        </div>

        {/* Center: Offer & Action */}
        <div className="flex items-center gap-2.5 text-center">
          <span className="hidden lg:inline text-gray-300">
            ⚡ <strong>Spring Challenge:</strong> Get 20% off plans with promo code <code className="bg-white/10 px-2 py-0.5 rounded font-mono font-bold text-white border border-white/10">FIT20</code>
          </span>
          <button
            onClick={openPassModal}
            className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-950 font-bold px-3 py-1 rounded-full text-[11px] transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)]"
          >
            <Sparkles size={11} className="text-gray-950" />
            Claim Free Day Pass <ChevronRight size={12} />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white p-1 rounded-md transition-colors hidden sm:block"
          title="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
