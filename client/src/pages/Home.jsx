import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Users, Award, Dumbbell, Clock, ChevronRight, CheckCircle, Sparkles, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useFreePass } from '../context/PassModalContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { FALLBACK_FACILITIES, FALLBACK_TRAINERS, FALLBACK_PLANS } from '../data/fallbackData'
import HomeBentoGrid from '../components/HomeBentoGrid'
import TransformationSlider from '../components/TransformationSlider'
import MemberReviews from '../components/MemberReviews'
import FaqSection from '../components/FaqSection'

const FACILITY_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
]

/** Home page — hero, stats, facilities, trainers, plans, CTA */
export default function Home() {
  const { openPassModal } = useFreePass()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [facilities, setFacilities] = useState(FALLBACK_FACILITIES.slice(0, 4))
  const [trainers, setTrainers] = useState(FALLBACK_TRAINERS.slice(0, 4))
  const [plans, setPlans] = useState(FALLBACK_PLANS)
  const [loading, setLoading] = useState(true)

  const handleOpenPass = () => {
    if (!isAuthenticated) {
      toast('Please log in to claim your free VIP day pass', { icon: '🔒' })
      navigate('/login')
      return
    }
    openPassModal()
  }

  const handlePlanAction = () => {
    if (!isAuthenticated) {
      toast('Please log in to choose and activate your membership plan', { icon: '🔒' })
      navigate('/login', { state: { from: '/plans' } })
      return
    }
    navigate('/plans')
  }

  useEffect(() => {
    let isMounted = true

    const fetchAll = async () => {
      try {
        const results = await Promise.allSettled([
          api.get('/facilities'),
          api.get('/trainers'),
          api.get('/plans'),
        ])

        if (!isMounted) return

        const [fRes, tRes, pRes] = results

        // Facilities
        if (fRes.status === 'fulfilled') {
          const list = Array.isArray(fRes.value.data) ? fRes.value.data : (fRes.value.data?.data || [])
          if (list.length > 0) {
            setFacilities(list.slice(0, 4))
          }
        }

        // Trainers
        if (tRes.status === 'fulfilled') {
          const list = Array.isArray(tRes.value.data) ? tRes.value.data : (tRes.value.data?.data || [])
          if (list.length > 0) {
            setTrainers(list.slice(0, 4))
          }
        }

        // Plans
        if (pRes.status === 'fulfilled') {
          const list = Array.isArray(pRes.value.data) ? pRes.value.data : (pRes.value.data?.data || [])
          if (list.length > 0) {
            setPlans(list)
          }
        }
      } catch (err) {
        console.warn('Failed to fetch some home sections, using fallback content:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchAll()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="bg-[#050508]">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050508] pt-28 pb-20">
        {/* Futuristic Gym Athlete Hero Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat pointer-events-none select-none opacity-90"
          style={{
            backgroundImage: `url('/hero-bg.png')`,
            backgroundPosition: 'right center',
          }}
        />

        {/* Soft left vignette to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/85 via-[#050508]/40 to-transparent pointer-events-none" />

        {/* Subtle bottom fade to blend with rest of the page */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#050508] via-[#050508]/70 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#17171d]/90 border border-white/10 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span className="text-gray-300 text-xs sm:text-sm font-medium tracking-wide">
                #1 Fitness Center in the City
              </span>
            </div>

            {/* Headline: Exactly 2 lines - "FORGE YOUR" on line 1, "BEST SELF" on line 2 */}
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-black tracking-tight leading-[1.02] mb-5 select-none font-display">
              <span className="block text-white whitespace-nowrap">FORGE YOUR</span>
              <span className="block text-[#8d929b] whitespace-nowrap">BEST SELF</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300/90 text-sm sm:text-base max-w-xl mb-8 leading-relaxed font-normal">
              Premium fitness facilities, world-class trainers, and an elite community built for peak performance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              {/* Primary - White Glowing Pill */}
              <Link
                to="/plans"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_45px_rgba(255,255,255,0.6)] hover:-translate-y-0.5"
              >
                <span>Explore Plans</span>
                <ArrowRight size={15} />
              </Link>

              {/* Free Day Pass - Glass Pill */}
              <button
                onClick={handleOpenPass}
                className="inline-flex items-center gap-2 bg-[#16161b]/80 hover:bg-[#202027] border border-white/15 hover:border-white/30 text-white font-medium px-5 py-3 rounded-full text-xs sm:text-sm transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 cursor-pointer shadow-sm"
              >
                <Sparkles size={15} className="text-gray-300" />
                <span>Free Day Pass</span>
              </button>

              {/* Meet Trainers - Glass Pill */}
              <Link
                to="/trainers"
                className="inline-flex items-center gap-1.5 bg-[#16161b]/80 hover:bg-[#202027] border border-white/15 hover:border-white/30 text-white font-medium px-5 py-3 rounded-full text-xs sm:text-sm transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 shadow-sm"
              >
                <span>Meet Trainers</span>
                <ChevronRight size={15} className="text-gray-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modern Bento Grid Ecosystem ───────────────────── */}
      <HomeBentoGrid />

      {/* ── Featured Facilities ───────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">World-Class <span className="gradient-text">Facilities</span></h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base sm:whitespace-nowrap">
            State-of-the-art equipment and architecturally crafted spaces designed to fuel peak human performance.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((f, i) => (
              <div key={f._id || i} className="card card-hover overflow-hidden p-0 border border-white/10 bg-[#0d0d13]/85 rounded-2xl group shadow-xl backdrop-blur-xl">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={
                      f.image && !f.image.includes('placeholder.com')
                        ? f.image
                        : FACILITY_IMAGES[i % FACILITY_IMAGES.length]
                    }
                    alt={f.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d13] via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold">{f.name}</h3>
                    {f.isActive !== false && (
                      <span className="text-[11px] bg-white/10 text-gray-200 border border-white/15 px-2.5 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/facilities" className="btn-secondary">
            <span>View All Facilities</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Featured Trainers ─────────────────────────────── */}
      <section className="py-24 bg-[#08080c] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Expert <span className="gradient-text">Coaches</span></h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base sm:whitespace-nowrap">
              Certified biomechanics experts and Olympic lifters dedicated to perfecting your training.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trainers.map((t, i) => {
                const portrait = t.imageUrl || [
                  'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&h=750&fit=crop',
                  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=750&fit=crop',
                  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=750&fit=crop',
                  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=750&fit=crop',
                ][i % 4]

                return (
                  <div key={t._id || i} className="card card-hover text-center border border-white/10 bg-[#0d0d13]/85 rounded-2xl p-6 backdrop-blur-xl group">
                    {/* Avatar circle / image */}
                    <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/15 overflow-hidden flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-xl group-hover:border-white/30 transition-all">
                      <img
                        src={portrait}
                        alt={t.name}
                        className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-white font-bold mb-1">{t.name}</h3>
                    <span className="inline-block text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full mb-3">
                      {t.specialization}
                    </span>
                    <p className="text-gray-400 text-xs font-medium">{t.experience} yrs elite experience</p>
                  </div>
                )
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/trainers" className="btn-secondary">
              <span>Meet All Trainers</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Social Proof & Member Reviews ─────────────────── */}
      <MemberReviews />

      {/* ── Interactive Before & After Transformation Slider ─ */}
      <TransformationSlider />

      {/* ── Plans Preview ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Choose Your <span className="gradient-text">Plan</span></h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base sm:whitespace-nowrap">
            Transparent, zero-contract membership plans designed for maximum performance.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={plan._id || i}
                className={`card card-hover relative flex flex-col justify-between rounded-2xl p-7 border backdrop-blur-xl ${
                  plan.isPopular
                    ? 'border-white/35 bg-[#121219]/90 ring-1 ring-white/20 shadow-[0_0_40px_rgba(255,255,255,0.08)]'
                    : 'border-white/10 bg-[#0d0d13]/85'
                }`}
              >
                <div>
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-gray-950 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-white text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-5">
                    <span className="text-4xl font-black text-white">₹{plan.price}</span>
                    <span className="text-gray-400 text-sm mb-1">/{plan.durationInDays || plan.duration || 30}d</span>
                  </div>
                  <ul className="space-y-2.5 mb-8">
                    {(plan.features || []).map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-gray-300 text-sm">
                        <CheckCircle size={15} className="text-white shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={handlePlanAction}
                  className={`w-full py-3 px-5 rounded-full font-bold transition-all text-sm mt-auto cursor-pointer flex items-center justify-center gap-1.5 ${
                    plan.isPopular
                      ? 'bg-white hover:bg-gray-100 text-gray-950 shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:-translate-y-0.5'
                      : 'bg-white/5 hover:bg-white/10 border border-white/15 text-white hover:-translate-y-0.5'
                  }`}
                >
                  {!isAuthenticated && <Lock size={13} className="text-gray-400" />}
                  <span>{isAuthenticated ? 'Get Started' : 'Subscribe (Login Required)'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Frequently Asked Questions ────────────────────── */}
      <FaqSection className="border-t border-white/5" />
    </div>
  )
}
