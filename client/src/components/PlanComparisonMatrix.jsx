import React from 'react'
import { Check, Minus, Zap, Shield, HelpCircle, Sparkles } from 'lucide-react'

const MATRIX_CATEGORIES = [
  {
    category: 'Facility Access & Hours',
    features: [
      {
        name: 'Gym Floor & Cardio Zone Access',
        tooltip: 'Full access to weightlifting, machines, and cardio decks.',
        basic: true,
        pro: true,
        elite: true,
      },
      {
        name: '24/7 Access (Keycard Entry)',
        tooltip: 'Train anytime day or night at our flagship branches.',
        basic: 'Standard (6am-10pm)',
        pro: true,
        elite: true,
      },
      {
        name: 'Locker & Shower Amenities',
        tooltip: 'Digital lockers, warm showers, and vanity stations.',
        basic: true,
        pro: true,
        elite: true,
      },
      {
        name: 'VIP Member Lounge & Free Wi-Fi',
        tooltip: 'High-speed internet, recovery smoothie bar area.',
        basic: false,
        pro: true,
        elite: true,
      },
    ],
  },
  {
    category: 'Classes & Training',
    features: [
      {
        name: 'Daily Group Classes (HIIT, Yoga, Zumba)',
        tooltip: 'Unlimited group fitness classes with certified instructors.',
        basic: '2 classes/wk',
        pro: true,
        elite: true,
      },
      {
        name: '1-on-1 Personal Training Sessions',
        tooltip: 'Dedicated 60-minute session with senior coach.',
        basic: '1 Complimentary',
        pro: '4 Sessions Included',
        elite: '12 Sessions Included',
      },
      {
        name: 'InBody™ 570 Body Composition Scans',
        tooltip: 'Medical-grade visceral fat, muscle mass & BMR tracking.',
        basic: '1 Scan',
        pro: 'Monthly Scan',
        elite: 'Bi-Weekly Scan',
      },
      {
        name: 'Custom Macro & Nutrition Meal Plan',
        tooltip: 'Tailored meal plan with monthly nutritionist reviews.',
        basic: false,
        pro: true,
        elite: true,
      },
    ],
  },
  {
    category: 'Wellness, Recovery & Extras',
    features: [
      {
        name: 'Finnish Dry Sauna Access',
        tooltip: 'High-temperature thermal sauna for deep detox & circulation.',
        basic: false,
        pro: true,
        elite: true,
      },
      {
        name: 'Sub-Zero Cold Plunge (10°C)',
        tooltip: 'Rapid inflammation reduction and sympathetic nervous reset.',
        basic: false,
        pro: '2x / month',
        elite: 'Unlimited',
      },
      {
        name: 'Guest Passes Per Month',
        tooltip: 'Bring a training partner or friend with you.',
        basic: false,
        pro: '2 Passes',
        elite: '5 Passes',
      },
      {
        name: 'Official GST Tax Invoice (Print/Download)',
        tooltip: 'Instant downloadable corporate tax deduction invoice.',
        basic: true,
        pro: true,
        elite: true,
      },
    ],
  },
]

export default function PlanComparisonMatrix({ plans, onSelectPlan, isActiveSubscriber, isAdmin }) {
  const renderCell = (val) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white border border-white/20">
          <Check size={13} className="stroke-[3]" />
        </span>
      )
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 text-gray-600">
          <Minus size={14} />
        </span>
      )
    }
    return (
      <span className="text-xs font-semibold text-gray-200 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
        {val}
      </span>
    )
  }

  // Find matches if available
  const basicPlan = plans.find((p) => p.name?.toLowerCase().includes('basic')) || plans[0]
  const proPlan = plans.find((p) => p.name?.toLowerCase().includes('pro')) || plans[1] || plans[0]
  const elitePlan = plans.find((p) => p.name?.toLowerCase().includes('elite')) || plans[2] || plans[plans.length - 1]

  return (
    <section className="mt-28 pt-16 border-t border-white/10">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 bg-white/5 text-gray-300 border border-white/10 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          <Sparkles size={12} className="text-white" /> Transparent Comparison
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight sm:whitespace-nowrap">
          Compare All <span className="gradient-text">Plan Features</span>
        </h2>
        <p className="text-gray-400 text-sm mt-3 sm:whitespace-nowrap">
          No hidden fees or locked doors. Review our full amenity matrix across every tier.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0d0d13]/85 shadow-2xl backdrop-blur-2xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-white/10 bg-[#09090e]">
              <th className="py-6 px-6 text-gray-400 text-xs font-semibold uppercase tracking-wider w-2/5">
                Feature / Benefit
              </th>
              <th className="py-6 px-4 text-center w-1/5">
                <div className="text-white font-bold text-base">Basic</div>
                <div className="text-gray-200 font-mono text-sm font-bold">
                  {basicPlan?.price ? `₹${basicPlan.price}` : '₹1,499'}
                </div>
                <span className="text-[11px] text-gray-500">30 Days</span>
              </th>
              <th className="py-6 px-4 text-center w-1/5 bg-white/[0.03] border-x border-white/15 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-gray-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
                  Popular
                </span>
                <div className="text-white font-bold text-base">Pro</div>
                <div className="text-white font-mono text-sm font-bold">
                  {proPlan?.price ? `₹${proPlan.price}` : '₹3,999'}
                </div>
                <span className="text-[11px] text-gray-400">90 Days</span>
              </th>
              <th className="py-6 px-4 text-center w-1/5">
                <div className="text-white font-bold text-base">Elite Annual</div>
                <div className="text-gray-200 font-mono text-sm font-bold">
                  {elitePlan?.price ? `₹${elitePlan.price}` : '₹11,999'}
                </div>
                <span className="text-[11px] text-gray-500">365 Days</span>
              </th>
            </tr>
          </thead>

          {/* Table Body with Categorized Rows */}
          <tbody>
            {MATRIX_CATEGORIES.map((cat, cIdx) => (
              <React.Fragment key={cIdx}>
                {/* Category Header Row */}
                <tr className="bg-[#09090e]/90 border-y border-white/10">
                  <td
                    colSpan={4}
                    className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-gray-300"
                  >
                    {cat.category}
                  </td>
                </tr>

                {/* Individual Feature Rows */}
                {cat.features.map((f, fIdx) => (
                  <tr
                    key={fIdx}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-300">
                      <div className="font-semibold text-white">{f.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{f.tooltip}</div>
                    </td>
                    <td className="py-4 px-4 text-center">{renderCell(f.basic)}</td>
                    <td className="py-4 px-4 text-center bg-white/[0.03] border-x border-white/15">
                      {renderCell(f.pro)}
                    </td>
                    <td className="py-4 px-4 text-center">{renderCell(f.elite)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}

            {/* Bottom Action CTA Row */}
            <tr className="bg-[#09090e]/80">
              <td className="py-6 px-6 text-xs text-gray-500">
                <span className="flex items-center gap-1.5 font-medium text-gray-400">
                  <Shield size={14} className="text-white" />
                  Instant digital activation. 100% money-back guarantee within 48h.
                </span>
              </td>
              <td className="py-6 px-4 text-center">
                {!isAdmin && !isActiveSubscriber && basicPlan && (
                  <button
                    onClick={() => onSelectPlan(basicPlan)}
                    className="btn-secondary text-xs py-2 px-3 w-full justify-center"
                  >
                    Choose Basic
                  </button>
                )}
              </td>
              <td className="py-6 px-4 text-center bg-white/[0.03] border-x border-white/15">
                {!isAdmin && !isActiveSubscriber && proPlan && (
                  <button
                    onClick={() => onSelectPlan(proPlan)}
                    className="bg-white hover:bg-gray-100 text-gray-950 text-xs py-2 px-3 w-full rounded-full font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)] transition"
                  >
                    Choose Pro
                  </button>
                )}
              </td>
              <td className="py-6 px-4 text-center">
                {!isAdmin && !isActiveSubscriber && elitePlan && (
                  <button
                    onClick={() => onSelectPlan(elitePlan)}
                    className="btn-secondary text-xs py-2 px-3 w-full justify-center"
                  >
                    Choose Elite
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
