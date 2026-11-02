import React from 'react'
import { Star, ShieldCheck, Sparkles, TrendingUp, Award, Quote } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Aarav Mehta',
    role: 'Software Architect',
    membership: 'Elite Yearly Member (1.5 yrs)',
    rating: 5,
    resultTag: '-14 kg Fat Loss',
    resultColor: 'border-white/20 bg-white/5 text-gray-200',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    quote:
      'The atmosphere here is unlike any generic commercial gym. The coaches don’t just count reps; they analyze biomechanics and posture. I’ve lost 14kg and gained immense daily energy.',
  },
  {
    name: 'Priya Sharma',
    role: 'Product Designer',
    membership: 'Strength & Conditioning Tier (9 mos)',
    rating: 5,
    resultTag: '+40% Endurance Boost',
    resultColor: 'border-white/20 bg-white/5 text-gray-200',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
    quote:
      'Immaculate Eleiko barbells, no crowded machine chaos, and the cold plunge + cedar sauna recovery is pure luxury. FitZone is the single best part of my daily morning routine.',
  },
  {
    name: 'Vikram Malhotra',
    role: 'Powerlifter & Entrepreneur',
    membership: 'Pro Athlete Tier (2 yrs)',
    rating: 5,
    resultTag: '210 kg Deadlift Club',
    resultColor: 'border-white/20 bg-white/5 text-gray-200',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    quote:
      'If you take heavy compound lifting seriously, this is home. Zero bent bars, calibrated plates everywhere, and elite spotters. Coach Vikram helped me add 50kg to my total with zero joint pain.',
  },
]

export default function MemberReviews() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-white/[0.02] rounded-full blur-[130px] pointer-events-none" />

      {/* Top Google Rating & Trust Bar */}
      <div className="bg-[#0b0c10]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl mb-16 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* Rating */}
          <div className="flex flex-col items-center md:items-start pb-4 md:pb-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-3xl font-black text-white tracking-tight">4.9</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              1,420+ Verified Google Reviews
            </p>
          </div>

          {/* Metric 1 */}
          <div className="flex flex-col items-center md:items-start pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-white" />
              <span className="text-xl font-bold text-white">98.4%</span>
            </div>
            <p className="text-xs text-gray-400">Annual Member Retention Rate</p>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col items-center md:items-start pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2 mb-1">
              <Award size={16} className="text-white" />
              <span className="text-xl font-bold text-white">100% Certified</span>
            </div>
            <p className="text-xs text-gray-400">Olympic & Sports Medicine Coaches</p>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col items-center md:items-start pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-white" />
              <span className="text-xl font-bold text-white">Strict Hygiene</span>
            </div>
            <p className="text-xs text-gray-400">Air-Purified & Sanitized Hourly</p>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          <Sparkles size={13} className="text-white" /> Member Testimonials
        </span>
        <h2 className="section-title sm:whitespace-nowrap">
          Proven Results, <span className="gradient-text">Real Athletes</span>
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed sm:whitespace-nowrap">
          Hear directly from high performers, entrepreneurs, and athletes who elevated their bodies and minds inside FitZone.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r, idx) => (
          <div
            key={idx}
            className="card card-hover flex flex-col justify-between border border-white/10 bg-[#0d0d13]/85 rounded-3xl p-7 backdrop-blur-xl shadow-xl relative group transition-all duration-300 hover:border-white/25"
          >
            <div>
              {/* Header with Avatar & Badge */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-white/5 p-0.5 shadow-md">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="w-full h-full object-cover rounded-full grayscale contrast-125"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base flex items-center gap-1.5">
                      {r.name}
                      <ShieldCheck size={14} className="text-gray-400 shrink-0" title="Verified Member" />
                    </h3>
                    <p className="text-[11px] text-gray-400">{r.role}</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex text-amber-400 shrink-0">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
              </div>

              {/* Transformation tag */}
              <div className="mb-4">
                <span
                  className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border ${r.resultColor}`}
                >
                  {r.resultTag}
                </span>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote size={18} className="text-white/10 mb-2" />
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{r.quote}"
                </p>
              </div>
            </div>

            {/* Footer Member Info */}
            <div className="border-t border-white/10 pt-4 mt-6 flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium text-gray-400">{r.membership}</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400/90 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
