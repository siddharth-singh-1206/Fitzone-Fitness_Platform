import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Dumbbell, Sparkles, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'

const TRANSFORMATIONS = [
  {
    id: 'aman',
    name: 'Aman Sharma',
    age: 28,
    profession: 'Software Engineer',
    program: 'Metabolic Recomp & Strength',
    quote:
      'Working 1:1 focus at FitZone helped me achieve a leaner physique and stronger lifts. The program was simple, effective and actually sustainable.',
    metrics: [
      { label: 'Body weight', change: '-20 kg' },
      { label: 'Body fat', change: '-17%' },
      { label: 'Deadlift PR', change: '+100 kg' },
    ],
    beforeImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sneha',
    name: 'Sneha Patel',
    age: 31,
    profession: 'Marketing Lead',
    program: 'PCOS Fitness & Mobility',
    quote:
      'I suffered from extreme lethargy and hormonal weight fluctuations. The dedicated training zone and support system made fitness a lifestyle, not a chore.',
    metrics: [
      { label: 'Body weight', change: '-15 kg' },
      { label: 'Body fat', change: '-13%' },
      { label: 'Daily energy', change: '+100%' },
    ],
    beforeImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'vikram',
    name: 'Vikram Malhotra',
    age: 29,
    profession: 'Product Architect',
    program: 'Hypertrophy & Heavy Compounds',
    quote:
      'Added 50kg to my compound total in 6 months under Coach Vikram. The calibrated Olympic plates and structured progressive overload make all the difference.',
    metrics: [
      { label: 'Lean mass', change: '+12 kg' },
      { label: 'Bench press', change: '+45 kg' },
      { label: 'Deadlift PR', change: '+75 kg' },
    ],
    beforeImg: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
  },
]

export default function TransformationSlider() {
  const [activeTab, setActiveTab] = useState(0)
  const [sliderPos, setSliderPos] = useState(50)

  const active = TRANSFORMATIONS[activeTab]

  return (
    <section className="py-12 sm:py-16 bg-[#050508] relative overflow-hidden select-none border-t border-white/5">
      {/* Background ambient light arcs */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Section Header (Compact & Centered) ─────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 bg-white/5 text-gray-300 border border-white/10 text-[11px] font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2.5 backdrop-blur-md">
            <Trophy size={12} className="text-white" /> Real People. Real Results.
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2 sm:whitespace-nowrap">
            Proof of <span className="gradient-text">Transformation</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto sm:whitespace-nowrap">
            Slide horizontally to see the before and after differences forged inside FitZone.
          </p>
        </div>

        {/* ── Member Selector Pills ─────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {TRANSFORMATIONS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(idx)
                setSliderPos(50)
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === idx
                  ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.35)] scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <span>{item.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === idx ? 'bg-black/15 text-gray-950' : 'bg-white/10 text-gray-300'
                }`}
              >
                {item.metrics[0].change}
              </span>
            </button>
          ))}
        </div>

        {/* ── Main Showcase Container (Compact 1:1 Reference) ─ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center bg-[#0b0c10]/90 border border-white/10 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-2xl">
          
          {/* Left Column: Interactive Before/After Split (6 cols, max height ~360px) */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl select-none group">
              
              {/* BEFORE IMAGE (Left side up to sliderPos%) */}
              <img
                src={active.beforeImg}
                alt={`${active.name} Before`}
                className="absolute inset-0 w-full h-full object-cover filter contrast-110"
                style={{
                  clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                }}
                draggable={false}
              />

              {/* AFTER IMAGE (Right side from sliderPos% to 100%) */}
              <img
                src={active.afterImg}
                alt={`${active.name} After`}
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-95"
                style={{
                  clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
                }}
                draggable={false}
              />

              {/* "BEFORE" Badge (Top-Left) */}
              <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-md text-gray-300 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-md border border-white/10 uppercase shadow-md">
                BEFORE
              </div>

              {/* "AFTER" Badge (Top-Right) */}
              <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-md text-gray-300 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-md border border-white/10 uppercase shadow-md">
                AFTER
              </div>

              {/* Slider Line & Circular Handle */}
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-[1.5px] h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center border border-gray-200">
                  <div className="flex items-center text-gray-900">
                    <ChevronLeft size={11} strokeWidth={3} className="-mr-0.5" />
                    <ChevronRight size={11} strokeWidth={3} className="-ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Invisible Range Input for Full-Area Dragging */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                aria-label="Before and after transformation slider"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0"
              />
            </div>
          </div>

          {/* Right Column: Athlete Details & Metrics (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Athlete Name & Profession */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
              {active.name}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-normal mb-3.5">
              {active.age} yrs • {active.profession}
            </p>

            {/* Program Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 bg-[#0c1412] border border-emerald-500/25 text-emerald-300 text-[11px] font-medium px-3.5 py-1 rounded-full shadow-sm">
                <Dumbbell size={12} className="text-emerald-400" />
                <span>{active.program}</span>
              </span>
            </div>

            {/* 3-Column Metrics Row */}
            <div className="grid grid-cols-3 divide-x divide-white/10 pb-5 mb-4 border-b border-white/5">
              {active.metrics.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    i === 0 ? 'pr-3' : i === 2 ? 'pl-3' : 'px-3'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-0.5 font-sans">
                    {m.change}
                  </span>
                  <span className="text-[11px] sm:text-xs text-gray-400 font-normal">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Testimonial Quote */}
            <div className="flex items-start gap-2.5 mb-5">
              <span className="text-emerald-400 text-xl sm:text-2xl font-serif font-black leading-none select-none shrink-0">
                ““
              </span>
              <p className="text-gray-300/90 text-xs sm:text-sm leading-relaxed italic font-normal">
                "{active.quote}"
              </p>
            </div>

            {/* Start Your Own Journey Button */}
            <div className="flex justify-end pt-1">
              <Link
                to="/plans"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.35)] hover:shadow-[0_0_35px_rgba(255,255,255,0.55)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Your Own Journey</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
