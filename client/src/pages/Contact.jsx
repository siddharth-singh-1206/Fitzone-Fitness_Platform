import React, { useState } from 'react'
import { ChevronRight, MapPin, Mail, Phone, Clock, Send, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

const INITIAL_FORM = { name: '', email: '', phone: '', message: '' }

/** Contact page — enquiry form with contact info sidebar */
export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    try {
      await api.post('/enquiries', form)
      toast.success("Message sent! We'll get back to you soon.")
      setForm(INITIAL_FORM)
      setErrors({})
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field) =>
    `w-full bg-[#07070b] border ${
      errors[field] ? 'border-red-500' : 'border-white/10'
    } text-white rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors placeholder-gray-500 text-sm`

  return (
    <div className="bg-[#050508] min-h-screen text-white pt-24">
      {/* Page Header */}
      <div className="border-b border-white/10 py-16 px-4 relative overflow-hidden bg-[#09090e]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={13} />
            <span className="text-gray-300">Contact</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
            <Sparkles size={12} className="text-white" /> 24/7 Member Desk
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight sm:whitespace-nowrap">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-gray-400 max-w-3xl text-sm sm:text-base leading-relaxed sm:whitespace-nowrap">
            Have questions about memberships, facilities, or personal coaching? Reach out to our concierge desk.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card bg-[#0d0d13]/85 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
              <h2 className="text-2xl font-black text-white mb-6">Send Us a Direct Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 text-xs font-semibold mb-2">
                      Full Name <span className="text-white">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Arjun Verma"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-300 text-xs font-semibold mb-2">
                      Email Address <span className="text-white">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="arjun.verma@gmail.com"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-2">
                    Phone Number <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={inputClass('phone')}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-2">
                    Message <span className="text-white">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className={inputClass('message')}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-white hover:bg-gray-100 text-gray-950 font-bold py-3.5 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Sending…' : (
                    <>
                      <Send size={15} /> <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card bg-[#0d0d13]/85 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <MapPin size={14} />
                  </div>
                  <span className="text-gray-300 text-sm leading-relaxed">
                    Level 4, Signature Hub, 100 Feet Road,<br />Indiranagar, Bengaluru, KA 560038
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                    <Mail size={14} />
                  </div>
                  <span className="text-gray-300 text-sm">concierge@fitzone.in</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                    <Phone size={14} />
                  </div>
                  <span className="text-gray-300 text-sm">+91 98860 12345 / 080 4920 1800</span>
                </li>
              </ul>
            </div>

            <div className="card bg-[#0d0d13]/85 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Clock size={16} className="text-white" />
                Opening Hours
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {[
                  { day: 'Monday – Friday', hours: '5:00 AM – 11:00 PM' },
                  { day: 'Saturday', hours: '6:00 AM – 9:00 PM' },
                  { day: 'Sunday', hours: '7:00 AM – 8:00 PM' },
                ].map(({ day, hours }) => (
                  <li key={day} className="flex justify-between py-1 border-b border-white/5 last:border-none">
                    <span className="text-gray-400">{day}</span>
                    <span className="text-white font-semibold">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
