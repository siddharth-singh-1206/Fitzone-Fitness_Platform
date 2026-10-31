import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Zap, ChevronRight, Lock, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { FALLBACK_PLANS } from '../data/fallbackData'
import PaymentCheckoutModal from '../components/PaymentCheckoutModal'
import PlanComparisonMatrix from '../components/PlanComparisonMatrix'
import FaqSection from '../components/FaqSection'

/** Plans page — comparison cards with membership sign-up and checkout flow */
export default function Plans() {
  const [plans, setPlans] = useState(FALLBACK_PLANS)
  const [myMembership, setMyMembership] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const { user, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [plansRes] = await Promise.all([api.get('/plans')])
        if (!isMounted) return
        const list = Array.isArray(plansRes.data) ? plansRes.data : (plansRes.data?.data || [])
        if (list.length > 0) {
          setPlans(list)
        }

        // If logged in (non-admin), also fetch existing membership
        if (isAuthenticated && !isAdmin) {
          try {
            const memRes = await api.get('/memberships/my')
            if (isMounted) {
              setMyMembership(memRes.data)
            }
          } catch {
            // No membership — that's fine
          }
        }
      } catch (err) {
        console.warn('Could not fetch live plans, using fallback:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, isAdmin])

  const handleSelect = (plan) => {
    if (!isAuthenticated) {
      toast('Please log in to choose a membership plan', { icon: '🔒' })
      navigate('/login')
      return
    }
    if (isAdmin) return

    // Check if already has active membership
    if (myMembership?.status === 'active') {
      toast('You already have an active membership!', { icon: 'ℹ️' })
      return
    }

    setSelectedPlanForCheckout(plan)
    setIsCheckoutOpen(true)
  }

  const isActiveSubscriber = myMembership?.status === 'active'

  return (
    <div className="bg-[#050508] min-h-screen text-white pt-24">
      {/* Page Header */}
      <div className="border-b border-white/10 py-16 px-4 relative overflow-hidden bg-[#09090e]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={13} />
            <span className="text-gray-300">Plans</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
            <Sparkles size={12} className="text-white" /> Zero Hidden Fees
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight sm:whitespace-nowrap">
            Membership <span className="gradient-text">Plans</span>
          </h1>
          <p className="text-gray-400 max-w-4xl text-sm sm:text-base leading-relaxed sm:whitespace-nowrap">
            Choose the tier designed for your lifestyle and athletic goals with instant encrypted checkout.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <LoadingSpinner />
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No plans available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <div
                key={plan._id || i}
                className={`card card-hover relative flex flex-col justify-between rounded-3xl p-8 border backdrop-blur-2xl shadow-2xl ${
                  plan.isPopular
                    ? 'border-white/35 bg-[#121219]/90 ring-1 ring-white/20 shadow-[0_0_40px_rgba(255,255,255,0.08)]'
                    : 'border-white/10 bg-[#0d0d13]/85'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white text-gray-950 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    <Sparkles size={12} /> Most Popular
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-2xl font-black text-white mb-1">{plan.name}</h3>
                    <p className="text-gray-400 text-xs font-medium">{plan.durationInDays || plan.duration || 30} days full access</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-5xl font-black text-white tracking-tight">₹{plan.price}</span>
                    <span className="text-gray-400 text-xs ml-1">/ {plan.durationInDays || plan.duration || 30} days</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {(plan.features || []).map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-gray-300 text-sm">
                        <CheckCircle size={16} className="text-white shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-auto pt-4">
                  {isAdmin ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-full border border-white/10 text-gray-500 font-semibold cursor-not-allowed text-xs"
                    >
                      Admin View Only
                    </button>
                  ) : isActiveSubscriber ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-full border border-white/10 text-gray-500 font-semibold cursor-not-allowed text-xs"
                    >
                      Already Subscribed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelect(plan)}
                      className={`w-full py-3.5 px-4 rounded-full font-bold transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${
                        plan.isPopular
                          ? 'bg-white hover:bg-gray-100 text-gray-950 shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:-translate-y-0.5'
                          : 'bg-white/5 hover:bg-white/10 border border-white/15 text-white hover:-translate-y-0.5'
                      }`}
                    >
                      <Lock size={14} />
                      <span>{isAuthenticated ? 'Subscribe & Pay' : 'Subscribe (Login Required)'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Plan Feature Matrix Table */}
        {!loading && plans.length > 0 && (
          <PlanComparisonMatrix
            plans={plans}
            onSelectPlan={handleSelect}
            isActiveSubscriber={isActiveSubscriber}
            isAdmin={isAdmin}
          />
        )}

        {/* FAQ Section */}
        <FaqSection className="pt-20 border-t border-white/5" />
      </div>

      {/* Payment Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={selectedPlanForCheckout}
        user={user}
        onSuccess={() => {
          setMyMembership({ status: 'active', plan: selectedPlanForCheckout, startDate: new Date() })
        }}
      />
    </div>
  )
}
