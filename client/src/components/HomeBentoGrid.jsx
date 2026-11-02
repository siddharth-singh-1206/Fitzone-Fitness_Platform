import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Activity,
  Clock,
  Calendar,
  Navigation,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useFreePass } from '../context/PassModalContext'

export default function HomeBentoGrid() {
  const { openPassModal } = useFreePass()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleBookClass = () => {
    if (!isAuthenticated) {
      toast('Please log in to reserve your spot in live fitness classes', { icon: '🔒' })
      navigate('/login', { state: { from: '/' } })
      return
    }
    openPassModal()
  }

  const handleClaimPass = () => {
    if (!isAuthenticated) {
      toast('Please log in to claim your complimentary day pass', { icon: '🔒' })
      navigate('/login', { state: { from: '/' } })
      return
    }
    openPassModal()
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden select-none">
      {/* Subtle curved background geometric arcs matching the reference */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none select-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none select-none" />
      <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none" />

      {/* ── Header ─────────────────────────────────────── */}
      <div className="text-center max-w-4xl mx-auto mb-14 relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-white/5 text-gray-300 border border-white/10 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 backdrop-blur-md">
          <Sparkles size={12} className="text-white" />
          <span>The FitZone Ecosystem</span>
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-display sm:whitespace-nowrap">
          Total <span className="gradient-text">Dominance</span>
        </h2>

        <p className="text-gray-400 text-sm sm:text-base mt-3 leading-relaxed font-normal max-w-3xl mx-auto sm:whitespace-nowrap">
          Designed for high performers — elite biometric tracking, world-class recovery, and peak training culture.
        </p>
      </div>

      {/* ── Two-Column Bento Grid ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch relative z-10">
        
        {/* ── LEFT COLUMN: 15,000 Sq. Ft. Main Showcase Card ── */}
        <div className="bg-[#0b0c10] border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-2xl group">
          {/* Gym Interior Photo with Live Badges */}
          <div>
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] w-full mb-6 bg-black border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                alt="Olympic & Functional Zone"
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* Floating Badge Left */}
              <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-lg">
                <MapPin size={12} className="text-gray-300" />
                <span>Live Floor Occupancy</span>
              </div>

              {/* Floating Badge Right */}
              <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-white text-xs font-mono font-medium shadow-lg">
                <Activity size={12} className="text-gray-300" />
                <span>~ 72 / 175 Access</span>
              </div>
            </div>

            {/* Green Accent Line */}
            <div className="w-8 h-1 bg-emerald-400 rounded-full mb-4" />

            {/* Title & Description */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight font-display">
              15,000 Sq. Ft. Olympic &amp; Functional Zone
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              Equipped with custom racks, competition plates, Hammer Strength power racks, and more — built for serious training.
            </p>
          </div>

          {/* Action Link */}
          <div>
            <Link
              to="/facilities"
              className="inline-flex items-center gap-1.5 text-white hover:text-gray-300 text-xs sm:text-sm font-semibold transition group/link"
            >
              <span>→ Explore Facility</span>
            </Link>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Two Stacked Action Cards ──────── */}
        <div className="flex flex-col gap-6 justify-between">
          
          {/* Card 1: Upcoming Live Class */}
          <div className="bg-[#0b0c10] border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl flex-1">
            {/* Top Row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                Upcoming Live Class
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1 rounded-full font-mono">
                <Clock size={12} className="text-gray-400" />
                <span>Starts in 3h 20m</span>
              </span>
            </div>

            {/* Main Info */}
            <div className="my-auto py-2">
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-2.5 tracking-tight font-display">
                HIIT &amp; Metabolic Conditioning
              </h4>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-gray-400" /> Coach Rohan Deshmukh
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Navigation size={13} className="text-gray-400" /> Studio A
                </span>
                <span>•</span>
                <span>45 Min Session</span>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-4">
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <Users size={14} />
                <span>6 Spots Left</span>
              </span>

              <button
                onClick={handleBookClass}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2: Experience FitZone For Free */}
          <div className="relative overflow-hidden bg-[#0b0c10] border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-white/20 transition-all duration-300 shadow-xl flex-1">
            {/* Subtle radial geometric arcs in corner */}
            <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full border border-white/5 pointer-events-none translate-x-1/3 translate-y-1/3" />
            <div className="absolute right-0 bottom-0 w-44 h-44 rounded-full bg-white/[0.02] blur-xl pointer-events-none" />

            <div className="max-w-md relative z-10">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                Featured
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight font-display">
                Experience FitZone For Free
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Get an instant 1-Day All-Access Pass. Unlock your potential, no commitment.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <button
                onClick={handleClaimPass}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 cursor-pointer"
              >
                <span>Claim Pass</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
