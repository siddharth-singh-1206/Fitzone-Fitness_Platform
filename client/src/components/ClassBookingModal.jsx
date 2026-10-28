import React, { useState } from 'react'
import { X, Calendar, Clock, MapPin, User, CheckCircle2, Dumbbell, Sparkles, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ClassBookingModal({ isOpen, onClose, classItem, user }) {
  const [attendeeName, setAttendeeName] = useState(user?.name || '')
  const [attendeePhone, setAttendeePhone] = useState(user?.phone || '')
  const [specialNotes, setSpecialNotes] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen || !classItem) return null

  const spotsLeft = classItem.totalSpots - classItem.bookedSpots

  const handleConfirm = (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in to reserve class spots', { icon: '🔒' })
      return
    }
    if (!attendeeName.trim() || !attendeePhone.trim()) {
      toast.error('Please provide your name and contact phone')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      const refId = `RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      setBookingConfirmed({
        refId,
        className: classItem.title,
        instructor: classItem.instructor,
        day: classItem.day,
        time: classItem.time,
        location: classItem.location,
        name: attendeeName,
        phone: attendeePhone,
      })
      setSubmitting(false)
      toast.success(`Spot reserved for ${classItem.title}! See you there! 🎉`)
    }, 600)
  }

  const handleClose = () => {
    setBookingConfirmed(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0d0d13]/95 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {!bookingConfirmed ? (
          /* ── RESERVATION FORM ────────────────────────── */
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 text-gray-200`}>
                {classItem.intensity}
              </span>
              <span className="text-xs text-white font-semibold bg-white/10 border border-white/15 px-3 py-0.5 rounded-full">
                {spotsLeft} Spots Available
              </span>
            </div>

            <h2 className="text-2xl font-black text-white mt-1 mb-1">{classItem.title}</h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-5 leading-relaxed">{classItem.description}</p>

            {/* Class Meta Box */}
            <div className="bg-[#07070b] p-4 rounded-2xl border border-white/10 space-y-2.5 text-xs mb-5">
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Calendar size={13} className="text-gray-400" /> Day & Time:
                </span>
                <span className="font-bold text-white">
                  {classItem.day} • {classItem.time}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <User size={13} className="text-gray-400" /> Instructor:
                </span>
                <span className="font-bold text-white">{classItem.instructor}</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <MapPin size={13} className="text-gray-400" /> Studio / Zone:
                </span>
                <span className="font-bold text-white">{classItem.location}</span>
              </div>
            </div>

            {/* Attendee Form */}
            <form onSubmit={handleConfirm} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:border-white/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Phone Number (for SMS Reminder)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:border-white/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Optional Injury / Goal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. First time attending, tight hamstrings"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
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
                  <span>{submitting ? 'Reserving Your Spot…' : 'Confirm Spot Reservation'}</span>
                </button>
              </div>

              <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 size={13} className="text-emerald-400" /> Free reservation for all members and guest pass holders.
              </p>
            </form>
          </div>
        ) : (
          /* ── CONFIRMATION SUCCESS VIEW ────────────────── */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                Reservation Confirmed
              </span>
              <h2 className="text-2xl font-black text-white">You're on the Class Roster!</h2>
              <p className="text-gray-400 text-xs mt-1">
                A spot has been held for you in <strong className="text-white">{bookingConfirmed.className}</strong>.
              </p>
            </div>

            {/* Booking Details Ticket */}
            <div className="bg-[#07070b] p-4 rounded-2xl border border-white/10 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Ref:</span>
                <span className="font-mono text-white font-bold">{bookingConfirmed.refId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time:</span>
                <span className="text-white font-medium">{bookingConfirmed.day} • {bookingConfirmed.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Coach / Instructor:</span>
                <span className="text-white font-medium">{bookingConfirmed.instructor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="text-white font-medium">{bookingConfirmed.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reserved For:</span>
                <span className="text-white font-medium">{bookingConfirmed.name} ({bookingConfirmed.phone})</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 text-center">
              Please arrive 10 minutes prior to class with gym attire and a water bottle.
            </p>

            <button
              onClick={handleClose}
              className="w-full bg-white hover:bg-gray-100 text-gray-950 py-3 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)] transition"
            >
              Done & Return to Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
