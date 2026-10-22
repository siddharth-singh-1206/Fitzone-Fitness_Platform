import React, { useState } from 'react'
import { ChevronRight, MapPin, Mail, Phone, Clock, Send } from 'lucide-react'
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
    // Clear error on change
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
    `w-full bg-gray-800 border ${
      errors[field] ? 'border-red-500' : 'border-gray-700'
    } text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500 text-sm`

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-900 border-b border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-orange-400 transition-colors">Home</a>
            <ChevronRight size={14} />
            <span className="text-orange-400">Contact</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            Have questions about memberships, facilities, or our trainers? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
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
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Message <span className="text-orange-500">*</span>
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
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending…' : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-white font-bold mb-4">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">
                    123 Fitness Avenue, Gym District,<br />Mumbai 400001, India
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-orange-500 shrink-0" />
                  <span className="text-gray-400 text-sm">hello@fitzone.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-orange-500 shrink-0" />
                  <span className="text-gray-400 text-sm">+91 98765 43210</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Clock size={18} className="text-orange-500" />
                Opening Hours
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  { day: 'Monday – Friday', hours: '5:00 AM – 11:00 PM' },
                  { day: 'Saturday', hours: '6:00 AM – 9:00 PM' },
                  { day: 'Sunday', hours: '7:00 AM – 8:00 PM' },
                ].map(({ day, hours }) => (
                  <li key={day} className="flex justify-between">
                    <span className="text-gray-400">{day}</span>
                    <span className="text-white font-medium">{hours}</span>
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
