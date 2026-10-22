import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Award, Dumbbell, Clock, ChevronRight, CheckCircle } from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

const GYM_IMG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'

/** Home page — hero, stats, facilities, trainers, plans, CTA */
export default function Home() {
  const [facilities, setFacilities] = useState([])
  const [trainers, setTrainers] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [fRes, tRes, pRes] = await Promise.all([
          api.get('/facilities'),
          api.get('/trainers'),
          api.get('/plans'),
        ])
        const fList = Array.isArray(fRes.data) ? fRes.data : (fRes.data?.data || [])
        const tList = Array.isArray(tRes.data) ? tRes.data : (tRes.data?.data || [])
        const pList = Array.isArray(pRes.data) ? pRes.data : (pRes.data?.data || [])
        setFacilities(fList.slice(0, 4))
        setTrainers(tList.slice(0, 4))
        setPlans(pList)
      } catch (err) {
        setError('Failed to load content. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="bg-gray-950">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative hero-gradient min-h-screen flex items-center overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-orange-600/5 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-400 text-sm font-medium">#1 Fitness Center in the City</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            FORGE YOUR
            <br />
            <span className="gradient-text">BEST SELF</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Premium fitness facilities, world-class trainers, and a community that pushes you
            beyond your limits. Your transformation starts today.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/plans" className="btn-primary text-base">
              Explore Plans <ArrowRight size={18} />
            </Link>
            <Link to="/trainers" className="btn-secondary text-base">
              Meet Our Trainers <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────── */}
      <section className="bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Users size={28} />, value: '500+', label: 'Active Members' },
              { icon: <Award size={28} />, value: '20+', label: 'Expert Trainers' },
              { icon: <Dumbbell size={28} />, value: '15+', label: 'Equipment Sets' },
              { icon: <Clock size={28} />, value: '10+', label: 'Years of Excellence' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div className="text-orange-500">{s.icon}</div>
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Facilities ───────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">World-Class <span className="gradient-text">Facilities</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            State-of-the-art equipment and spaces designed to fuel your performance.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((f, i) => (
              <div key={f._id} className="card card-hover overflow-hidden p-0">
                <img
                  src={GYM_IMG}
                  alt={f.name}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{f.name}</h3>
                    {f.isActive && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/facilities" className="btn-secondary">
            View All Facilities <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Featured Trainers ─────────────────────────────── */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Expert <span className="gradient-text">Trainers</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our certified coaches bring decades of combined experience to guide your journey.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trainers.map((t) => (
                <div key={t._id} className="card card-hover text-center">
                  {/* Avatar circle */}
                  <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {t.name?.[0]?.toUpperCase()}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{t.name}</h3>
                  <span className="inline-block text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full mb-2">
                    {t.specialization}
                  </span>
                  <p className="text-gray-500 text-xs">{t.experience} yrs experience</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/trainers" className="btn-secondary">
              All Trainers <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Plans Preview ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">Choose Your <span className="gradient-text">Plan</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Flexible membership plans designed to fit your goals and budget.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`card card-hover relative ${
                  plan.isPopular ? 'border-orange-500 ring-2 ring-orange-500/50' : ''
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <h3 className="text-white text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-black text-orange-500">₹{plan.price}</span>
                  <span className="text-gray-400 text-sm mb-1">/{plan.duration}d</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {(plan.features || []).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle size={14} className="text-orange-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/plans"
                  className={`block text-center py-2 px-4 rounded-lg font-semibold transition-colors ${
                    plan.isPopular
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Section ───────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-transparent to-orange-600/10" />
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ready to <span className="gradient-text">Start?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join hundreds of members who've already transformed their lives at FitZone.
          </p>
          <Link to="/plans" className="btn-primary text-lg px-8 py-4">
            View Membership Plans <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
