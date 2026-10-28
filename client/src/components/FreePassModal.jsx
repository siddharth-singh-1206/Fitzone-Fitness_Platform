import React, { useState } from 'react'
import { X, Dumbbell, Sparkles, CheckCircle2, Calendar, Clock, QrCode, Printer, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function FreePassModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    timeSlot: 'Morning (06:00 AM – 11:00 AM)',
    activity: 'Gym Floor & Free Weights',
  })

  const [generatedPass, setGeneratedPass] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please fill in all contact details')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const passId = `FZ-VIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      setGeneratedPass({
        ...formData,
        passId,
        issuedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      })
      setLoading(false)
      toast.success('VIP Day Pass generated successfully! 🎉')
    }, 600)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReset = () => {
    setGeneratedPass(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0d0d13]/95 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white my-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors print:hidden"
        >
          <X size={20} />
        </button>

        {!generatedPass ? (
          /* ── FORM VIEW ───────────────────────────────── */
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-white border border-white/15 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider">
                <Sparkles size={12} className="text-white" /> Exclusive 100% Free
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-2">
              Claim Your Free <span className="gradient-text">1-Day VIP Pass</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
              Experience the FitZone difference. Get unrestricted access to our premium strength equipment, cardio zone, recovery suite, and locker rooms.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Arjun Verma"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#07070a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="arjun.verma@gmail.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#07070a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#07070a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Preferred Visit Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#07070a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Preferred Time Window</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full bg-[#07070a] border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors"
                  >
                    <option value="Morning (06:00 AM – 11:00 AM)">Morning (06:00 AM – 11:00 AM)</option>
                    <option value="Afternoon (12:00 PM – 04:00 PM)">Afternoon (12:00 PM – 04:00 PM)</option>
                    <option value="Evening (05:00 PM – 10:00 PM)">Evening (05:00 PM – 10:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Primary Area of Interest</label>
                <select
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  className="w-full bg-[#07070a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors"
                >
                  <option value="Gym Floor & Free Weights">Gym Floor & Free Weights</option>
                  <option value="Cardio & Weight Loss Zone">Cardio & Weight Loss Zone</option>
                  <option value="Yoga & Flexibility Studio">Yoga & Flexibility Studio</option>
                  <option value="CrossFit & Functional Fitness">CrossFit & Functional Fitness</option>
                  <option value="Indoor Swimming Pool">Indoor Heated Pool</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-gray-100 text-gray-950 text-base py-3.5 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all cursor-pointer"
                >
                  <Sparkles size={17} />
                  <span>{loading ? 'Generating Your VIP Pass…' : 'Generate My VIP Pass Instantly'}</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5 mt-2">
                <ShieldCheck size={14} className="text-gray-400" />
                No credit card required. Free guest admission. Valid with photo ID.
              </p>
            </form>
          </div>
        ) : (
          /* ── GENERATED VIP PASS CARD VIEW ─────────────── */
          <div className="space-y-6">
            <div className="text-center print:hidden">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <CheckCircle2 size={13} /> Pass Issued & Ready
              </span>
              <h2 className="text-2xl font-black text-white">Your FitZone VIP Pass</h2>
              <p className="text-gray-400 text-xs">Present this card on your phone or print it when you visit.</p>
            </div>

            {/* Printable Pass Card */}
            <div className="relative rounded-2xl p-0.5 bg-gradient-to-br from-white/30 via-white/10 to-transparent border border-white/10 shadow-2xl print:border-2 print:border-black print:bg-white">
              <div className="bg-[#09090e] rounded-2xl p-6 sm:p-7 relative overflow-hidden print:bg-white print:text-black">
                {/* Background decorative watermark */}
                <Dumbbell className="absolute -right-10 -bottom-10 text-white/[0.03] print:hidden w-56 h-56 rotate-12 pointer-events-none" />

                {/* Pass Card Header */}
                <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-5 print:border-gray-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white text-gray-950 flex items-center justify-center shadow-lg font-black">
                      <Dumbbell size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg tracking-wider text-white print:text-black">FITZONE</h3>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">VIP 1-Day Guest Pass</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Pass ID</span>
                    <p className="font-mono text-xs font-bold text-white print:text-black">{generatedPass.passId}</p>
                  </div>
                </div>

                {/* Pass Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-5 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-0.5">Guest Name</span>
                    <p className="font-bold text-white print:text-black text-sm">{generatedPass.name}</p>
                    <p className="text-gray-400 print:text-gray-600 text-[11px]">{generatedPass.phone}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-0.5">Visit Date</span>
                    <p className="font-bold text-white print:text-black text-sm flex items-center gap-1">
                      <Calendar size={13} className="text-gray-400" />
                      {new Date(generatedPass.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-0.5">Session Window</span>
                    <p className="text-gray-300 print:text-black font-medium flex items-center gap-1">
                      <Clock size={13} className="text-gray-400" />
                      {generatedPass.timeSlot}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-0.5">Workout Focus</span>
                    <span className="inline-block bg-white/10 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/10 print:border print:border-black print:text-black">
                      {generatedPass.activity}
                    </span>
                  </div>
                </div>

                {/* Simulated Barcode & QR Code Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 print:border-gray-300">
                  {/* Simulated Barcode Lines */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1 h-8 opacity-80 overflow-hidden">
                      {[...Array(32)].map((_, i) => (
                        <div
                          key={i}
                          className={`bg-white print:bg-black h-full rounded-sm ${
                            i % 5 === 0 ? 'w-1.5' : i % 2 === 0 ? 'w-0.5' : 'w-1'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-mono text-[9px] text-gray-500 tracking-widest mt-1">
                      VALID ONLY ON {generatedPass.date} • ONE TIME USE
                    </p>
                  </div>

                  {/* QR Graphic */}
                  <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <QrCode size={46} className="text-gray-950" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 bg-white hover:bg-gray-100 text-gray-950 py-3 rounded-full flex items-center justify-center gap-2 text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition"
              >
                <Printer size={16} /> Print / Save Pass
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary py-3 px-6 text-sm font-semibold rounded-full"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
