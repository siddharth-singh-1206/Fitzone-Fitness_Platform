import React, { useState } from 'react'
import {
  X,
  Calendar,
  Clock,
  Target,
  User,
  CheckCircle2,
  Sparkles,
  Phone,
  ShieldCheck,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'

const TIME_SLOTS = [
  '07:00 AM – 08:00 AM',
  '09:00 AM – 10:00 AM',
  '11:00 AM – 12:00 PM',
  '02:00 PM – 03:00 PM',
  '04:30 PM – 05:30 PM',
  '06:00 PM – 07:00 PM',
  '07:30 PM – 08:30 PM',
]

const SESSION_GOALS = [
  'Muscle Hypertrophy & Strength',
  'Fat Loss & Conditioning Assessment',
  'Squat / Bench / Deadlift Form Check',
  'Flexibility & Mobility Optimization',
  'Customized Workout & Diet Strategy',
]

export default function TrainerBookingModal({ isOpen, onClose, trainer, user }) {
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [selectedDate, setSelectedDate] = useState(tomorrowStr)
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1])
  const [sessionGoal, setSessionGoal] = useState(SESSION_GOALS[0])
  const [memberName, setMemberName] = useState(user?.name || '')
  const [memberPhone, setMemberPhone] = useState(user?.phone || '')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  if (!isOpen || !trainer) return null

  const handleConfirm = (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in to confirm a 1-on-1 coaching session', { icon: '🔒' })
      return
    }
    if (!memberName.trim() || !memberPhone.trim()) {
      toast.error('Please enter your name and phone number')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      const bookingRef = `PT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      setConfirmedBooking({
        bookingRef,
        trainerName: trainer.name,
        specialization: trainer.specialization,
        date: selectedDate,
        time: selectedTime,
        goal: sessionGoal,
        name: memberName,
        phone: memberPhone,
      })
      setSubmitting(false)
      toast.success(`Session booked with Coach ${trainer.name}! 🏋️`)
    }, 600)
  }

  const handleClose = () => {
    setConfirmedBooking(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0d0d13]/95 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {!confirmedBooking ? (
          /* ── BOOKING FORM VIEW ───────────────────────── */
          <div>
            {/* Trainer Banner Header */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5">
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-xl font-black shadow-xl shrink-0">
                {trainer.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                  1-on-1 Personal Coaching Session
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">{trainer.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-0.5 rounded-full font-medium">
                    {trainer.specialization}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {trainer.experience} yrs experience
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirm} className="space-y-4">
              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" /> Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                    <Clock size={13} className="text-gray-400" /> Available Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-[#07070b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:border-white/30 focus:outline-none"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Training Focus */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                  <Target size={13} className="text-gray-400" /> Primary Session Objective
                </label>
                <select
                  value={sessionGoal}
                  onChange={(e) => setSessionGoal(e.target.value)}
                  className="w-full bg-[#07070b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:border-white/30 focus:outline-none"
                >
                  {SESSION_GOALS.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Specific Injuries / Notes for Coach (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Previous lower back stiffness, want to learn sumo deadlift"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:border-white/30 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-white hover:bg-gray-100 text-gray-950 text-sm py-3.5 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>{submitting ? 'Confirming with Coach…' : `Confirm 1-on-1 Session with ${trainer.name}`}</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5 mt-1">
                <ShieldCheck size={14} className="text-gray-400" />
                Guaranteed slot reservation. Includes free initial biomechanics screening.
              </p>
            </form>
          </div>
        ) : (
          /* ── CONFIRMATION TICKET VIEW ────────────────── */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Award size={13} /> Session Booked
              </span>
              <h2 className="text-2xl font-black text-white">Booking Confirmed!</h2>
              <p className="text-gray-400 text-xs mt-1">
                Coach <strong className="text-white">{confirmedBooking.trainerName}</strong> is reserved for your personal session.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-[#07070b] p-5 rounded-2xl border border-white/10 text-xs space-y-2.5 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Reference:</span>
                <span className="font-mono text-white font-bold">{confirmedBooking.bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Coach / Specialist:</span>
                <span className="text-white font-medium">{confirmedBooking.trainerName} ({confirmedBooking.specialization})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Session Date:</span>
                <span className="text-white font-medium">
                  {new Date(confirmedBooking.date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time Window:</span>
                <span className="text-white font-medium">{confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Focus / Goal:</span>
                <span className="text-gray-200 font-semibold">{confirmedBooking.goal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Member:</span>
                <span className="text-white font-medium">{confirmedBooking.name} ({confirmedBooking.phone})</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 text-center">
              Please arrive 5 minutes early in training shoes at the FitZone Personal Training Suite.
            </p>

            <button
              onClick={handleClose}
              className="w-full bg-white hover:bg-gray-100 text-gray-950 py-3 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)] transition"
            >
              Done & Return to Trainers
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
