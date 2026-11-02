import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'
import { useSound } from '../context/SoundContext'

const FAQ_ITEMS = [
  {
    q: 'Can I pause or freeze my membership when traveling?',
    a: 'Yes. All quarterly and yearly memberships include up to 45 days of complimentary freeze allowance per year. You can request a freeze with a single tap in your Member Dashboard or notify the front desk before your travel dates.',
    tag: 'Flexibility',
  },
  {
    q: 'Are lockers, steam rooms, and towel service included?',
    a: 'Absolutely. Every membership tier includes full access to biometric keyless lockers, private rain showers, Finnish cedarwood dry sauna, steam rooms, and freshly laundered luxury towels at no extra charge.',
    tag: 'Amenities',
  },
  {
    q: 'What is included in the free day pass?',
    a: 'Your complimentary day pass provides 100% unrestricted access to our 15,000 sq. ft. Olympic floor, free weights, functional sprint turf, and recovery zones, plus an optional 15-minute mobility assessment with a head coach.',
    tag: 'Day Pass',
  },
  {
    q: 'Can I book 1-on-1 personal training sessions separately?',
    a: 'Yes. You can browse coach profiles and book individual private training sessions on our Trainers page, or bundle 5, 10, or 20-session packs with any active membership at discounted athlete rates.',
    tag: 'Coaching',
  },
  {
    q: 'Are there any hidden joining fees or annual maintenance charges?',
    a: 'Zero. We operate on complete pricing transparency. There are no mandatory locker deposits, no surprise maintenance deductions, and no hidden cancellation penalties.',
    tag: 'Pricing',
  },
  {
    q: 'What are your gym operating hours?',
    a: 'FitZone is open Monday through Saturday from 5:30 AM to 11:00 PM, and Sundays from 7:00 AM to 9:00 PM. Members on our Elite Yearly tier enjoy 24/7 keycard access to the Olympic strength floor.',
    tag: 'Access',
  },
]

export default function FaqSection({ className = '' }) {
  const [openIndex, setOpenIndex] = useState(0) // Default first open
  const { playPop } = useSound()

  const handleToggle = (idx) => {
    playPop()
    setOpenIndex((prev) => (prev === idx ? -1 : idx))
  }

  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          <HelpCircle size={13} className="text-white" /> Got Questions?
        </span>
        <h2 className="section-title sm:whitespace-nowrap">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed sm:whitespace-nowrap">
          Everything you need to know about our tiers, amenities, coaching, and floor policies.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-3.5">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              className={`border rounded-2xl transition-all duration-300 backdrop-blur-xl overflow-hidden ${
                isOpen
                  ? 'border-white/30 bg-[#0f0f15]/95 shadow-[0_10px_30px_rgba(0,0,0,0.6)] ring-1 ring-white/10'
                  : 'border-white/10 bg-[#0a0a0f]/80 hover:border-white/20 hover:bg-[#0c0c12]'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggle(idx)}
                className="w-full py-5 px-6 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400 uppercase tracking-wider shrink-0 hidden sm:inline-block">
                    {item.tag}
                  </span>
                  <span className="text-white font-bold text-sm sm:text-base tracking-tight">
                    {item.q}
                  </span>
                </div>
                <div
                  className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-white text-gray-950 border-white' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-gray-300 text-sm leading-relaxed border-t border-white/5">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Still have questions CTA */}
      <div className="mt-12 text-center p-6 bg-[#0b0c10]/70 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white shrink-0">
            <MessageCircle size={18} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Have a unique question?</h4>
            <p className="text-gray-400 text-xs">Our concierge desk is available 24/7 to assist you.</p>
          </div>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all shrink-0 hover:-translate-y-0.5"
        >
          <span>Contact Front Desk</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}
