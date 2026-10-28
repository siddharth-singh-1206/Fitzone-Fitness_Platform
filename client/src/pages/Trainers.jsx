import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Mail,
  Briefcase,
  CalendarCheck,
  Search,
  Sparkles,
  Award,
  Filter,
  Lock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { FALLBACK_TRAINERS } from '../data/fallbackData'
import TrainerBookingModal from '../components/TrainerBookingModal'

const SPECIALIZATION_FILTERS = [
  'All',
  'Weight Training',
  'Yoga',
  'Cardio',
  'CrossFit',
]

/** Trainers page — grid of trainer cards with search, filters and 1-on-1 session booking */
export default function Trainers() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [trainers, setTrainers] = useState(FALLBACK_TRAINERS)
  const [loading, setLoading] = useState(true)
  const [selectedSpec, setSelectedSpec] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrainerForBooking, setSelectedTrainerForBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    api
      .get('/trainers')
      .then((res) => {
        if (!isMounted) return
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || [])
        if (list.length > 0) {
          setTrainers(list)
        }
      })
      .catch((err) => {
        console.warn('Could not fetch trainers, using fallback:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleOpenBooking = (trainer) => {
    if (!isAuthenticated) {
      toast('Please log in to book a 1-on-1 session with our coaches', { icon: '🔒' })
      navigate('/login', { state: { from: '/trainers' } })
      return
    }
    if (isAdmin) {
      toast('Admins cannot book personal training sessions from the member portal', { icon: 'ℹ️' })
      return
    }
    setSelectedTrainerForBooking(trainer)
    setIsModalOpen(true)
  }

  // Filter and search
  const filteredTrainers = trainers.filter((t) => {
    const matchesSpec = selectedSpec === 'All' || t.specialization.toLowerCase().includes(selectedSpec.toLowerCase())
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      (t.name || '').toLowerCase().includes(q) ||
      (t.specialization || '').toLowerCase().includes(q) ||
      (t.bio || '').toLowerCase().includes(q)
    return matchesSpec && matchesSearch
  })

  return (
    <div className="bg-[#050508] min-h-screen text-white pt-24">
      {/* Page Header */}
      <div className="border-b border-white/10 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#09090e]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={13} />
            <span className="text-gray-300">Trainers</span>
          </nav>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                <Award size={13} className="text-white" /> Certified Elite Coaches
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight sm:whitespace-nowrap">
                Meet Our <span className="gradient-text">Coaches</span>
              </h1>
              <p className="text-gray-400 max-w-2xl text-sm sm:text-base mt-2 leading-relaxed sm:whitespace-nowrap">
                Certified coaches and athletic specialists dedicated to your transformation.
              </p>
            </div>

            <div className="bg-[#0d0d13]/90 border border-white/10 rounded-2xl p-4 flex items-center gap-3 shrink-0 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <CalendarCheck size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm">1-on-1 Coaching</p>
                <p className="text-gray-400 text-xs">Direct Slot Reservations Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          {/* Specialization Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1">
            {SPECIALIZATION_FILTERS.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpec(spec)}
                className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSpec === spec
                    ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.3)] font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by coach name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d13] border border-white/10 rounded-full pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-colors"
            />
            <Search size={14} className="absolute left-3.5 top-3 text-gray-500" />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredTrainers.length === 0 ? (
          <div className="card text-center py-20 border border-white/10 rounded-2xl bg-[#0d0d13]/85">
            <p className="text-gray-300 text-base font-semibold mb-1">No trainers found</p>
            <p className="text-gray-500 text-xs">Try selecting a different specialization filter or clearing your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTrainers.map((t, i) => {
              const portrait = t.imageUrl || [
                'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&h=750&fit=crop',
                'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=750&fit=crop',
                'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=750&fit=crop',
                'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=750&fit=crop',
              ][i % 4]

              return (
                <div
                  key={t._id || i}
                  className="card card-hover bg-[#0d0d13]/85 border border-white/10 text-center flex flex-col justify-between rounded-3xl p-6 backdrop-blur-xl shadow-2xl group"
                >
                  <div>
                    {/* Avatar / Portrait */}
                    <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/15 overflow-hidden flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-xl group-hover:border-white/30 transition-all">
                      <img
                        src={portrait}
                        alt={t.name}
                        className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <h3 className="text-white font-bold text-lg mb-1">{t.name}</h3>

                    <span className="inline-block bg-white/5 border border-white/10 text-gray-300 text-xs font-medium px-3 py-1 rounded-full mb-3">
                      {t.specialization}
                    </span>

                    <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs mb-4">
                      <Briefcase size={12} className="text-gray-400" />
                      <span>{t.experience} years experience</span>
                    </div>

                    {t.bio && (
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-6 text-left">
                        {t.bio}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleOpenBooking(t)}
                      className="w-full bg-white hover:bg-gray-100 text-gray-950 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all cursor-pointer"
                    >
                      {isAuthenticated ? <CalendarCheck size={14} /> : <Lock size={13} className="text-gray-700" />}
                      <span>{isAuthenticated ? 'Book 1-on-1 Session' : 'Book Session (Login Required)'}</span>
                    </button>

                    <Link
                      to="/contact"
                      className="w-full inline-flex items-center justify-center gap-1.5 text-gray-400 hover:text-white text-xs font-medium py-2 rounded-full hover:bg-white/5 transition-colors"
                    >
                      <Mail size={13} />
                      <span>Ask a Question</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 1-on-1 Trainer Booking Modal */}
      <TrainerBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trainer={selectedTrainerForBooking}
        user={user}
      />
    </div>
  )
}
