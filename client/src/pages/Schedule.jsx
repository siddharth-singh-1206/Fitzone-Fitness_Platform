import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Search,
  ChevronRight,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { DAYS_OF_WEEK, CLASS_CATEGORIES, SCHEDULE_CLASSES } from '../data/scheduleData'
import ClassBookingModal from '../components/ClassBookingModal'

export default function Schedule() {
  const { user } = useAuth()

  // Get current day of week to auto-select
  const currentDayIndex = new Date().getDay()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayName = dayNames[currentDayIndex]

  const [selectedDay, setSelectedDay] = useState(todayName)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClassForBooking, setSelectedClassForBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter classes by day, category, and search query
  const filteredClasses = SCHEDULE_CLASSES.filter((c) => {
    const matchesDay = c.day === selectedDay
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    return matchesDay && matchesCategory && matchesSearch
  })

  const handleOpenBooking = (classItem) => {
    setSelectedClassForBooking(classItem)
    setIsModalOpen(true)
  }

  return (
    <div className="bg-[#050508] min-h-screen text-white pt-24">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="border-b border-white/10 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#09090e]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={13} />
            <span className="text-gray-300">Class Timetable</span>
          </nav>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                <Sparkles size={12} className="text-white" /> Weekly Group Sessions
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                Class <span className="gradient-text">Timetable</span>
              </h1>
              <p className="text-gray-400 max-w-xl text-sm sm:text-base mt-2 leading-relaxed">
                Train together, level up together. All sessions led by certified coaches with personalized form guidance.
              </p>
            </div>

            <div className="bg-[#0d0d13]/90 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shrink-0 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Today is {todayName}</p>
                <p className="text-gray-400 text-xs">Included in Pro & Elite Plans</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Day of Week Selector ──────────────────────────── */}
      <div className="bg-[#08080c]/80 border-b border-white/10 sticky top-16 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {DAYS_OF_WEEK.map((day) => {
              const isToday = day === todayName
              const isSelected = day === selectedDay

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{day}</span>
                    {isToday && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : 'bg-white'}`} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main Schedule Content ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Category & Search Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1">
            {CLASS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white/15 text-white border border-white/25 shadow-sm'
                    : 'text-gray-400 hover:text-white bg-white/5 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search class or coach..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d13] border border-white/10 rounded-full pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition-colors"
            />
            <Search size={14} className="absolute left-3.5 top-3 text-gray-500" />
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="card text-center py-20 border border-white/10 rounded-3xl bg-[#0d0d13]/85">
            <Calendar size={42} className="text-gray-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">No Classes Scheduled</h3>
            <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto">
              No classes match your selected day or category filters. Try switching the day or selecting "All".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((item) => {
              const spotsLeft = item.totalSpots - item.bookedSpots
              const fillPercentage = Math.round((item.bookedSpots / item.totalSpots) * 100)

              return (
                <div
                  key={item.id}
                  className="card card-hover bg-[#0d0d13]/85 border border-white/10 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-2xl shadow-2xl"
                >
                  {/* Subtle top rim light */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                  <div>
                    {/* Time & Intensity */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="flex items-center gap-1.5 text-white text-xs font-bold font-mono">
                        <Clock size={13} className="text-gray-400" /> {item.time}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 text-gray-200`}>
                        {item.intensity}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-xs line-clamp-2 mb-5 leading-relaxed">{item.description}</p>

                    {/* Metadata details */}
                    <div className="space-y-2 py-3 border-y border-white/10 text-xs text-gray-300 mb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <User size={13} className="text-gray-400" /> Instructor:
                        </span>
                        <span className="font-semibold text-white">{item.instructor}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <MapPin size={13} className="text-gray-400" /> Room / Area:
                        </span>
                        <span className="font-semibold text-gray-200">{item.location}</span>
                      </div>
                    </div>

                    {/* Capacity Indicator */}
                    <div className="mb-5">
                      <div className="flex justify-between items-center text-[11px] mb-1.5">
                        <span className="text-gray-400">Class Capacity</span>
                        <span className={spotsLeft <= 3 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                          {spotsLeft} spots left ({item.bookedSpots}/{item.totalSpots})
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-300 bg-white"
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <button
                    onClick={() => handleOpenBooking(item)}
                    disabled={spotsLeft === 0}
                    className="w-full bg-white hover:bg-gray-100 text-gray-950 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={14} />
                    <span>{spotsLeft === 0 ? 'Class Full' : 'Reserve Spot'}</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Class Booking Modal */}
      <ClassBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classItem={selectedClassForBooking}
        user={user}
      />
    </div>
  )
}
