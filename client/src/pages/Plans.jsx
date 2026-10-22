import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Zap, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

/** Plans page — comparison cards with membership sign-up */
export default function Plans() {
  const [plans, setPlans] = useState([])
  const [myMembership, setMyMembership] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subscribing, setSubscribing] = useState(null) // plan _id currently being subscribed to
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes] = await Promise.all([api.get('/plans')])
        setPlans(Array.isArray(plansRes.data) ? plansRes.data : (plansRes.data?.data || []))

        // If logged in (non-admin), also fetch existing membership
        if (isAuthenticated && !isAdmin) {
          try {
            const memRes = await api.get('/memberships/my')
            setMyMembership(memRes.data)
          } catch {
            // No membership — that's fine
          }
        }
      } catch {
        setError('Failed to load plans. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAuthenticated, isAdmin])

  const handleSelect = async (plan) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (isAdmin) return

    // Check if already has active membership
    if (myMembership?.status === 'active') {
      toast('You already have an active membership!', { icon: 'ℹ️' })
      return
    }

    setSubscribing(plan._id)
    try {
      await api.post('/memberships', { planId: plan._id })
      toast.success(`Successfully subscribed to ${plan.name}!`)
      navigate('/my-membership')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe. Please try again.')
    } finally {
      setSubscribing(null)
    }
  }

  const isActiveSubscriber = myMembership?.status === 'active'

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-900 border-b border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-orange-400 transition-colors">Home</a>
            <ChevronRight size={14} />
            <span className="text-orange-400">Plans</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Membership <span className="gradient-text">Plans</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            Choose the plan that fits your goals. Upgrade or cancel anytime.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No plans available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`card card-hover relative flex flex-col ${
                  plan.isPopular
                    ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-xl shadow-orange-500/10'
                    : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    <Zap size={12} /> Most Popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.durationInDays || plan.duration} days access</p>
                </div>

                <div className="mb-6">
                  <span className="text-5xl font-black text-orange-500">₹{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/ {plan.durationInDays || plan.duration} days</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {(plan.features || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {isAdmin ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-lg border border-gray-700 text-gray-600 font-semibold cursor-not-allowed text-sm"
                  >
                    Admin View Only
                  </button>
                ) : isActiveSubscriber ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-lg border border-gray-700 text-gray-500 font-semibold cursor-not-allowed text-sm"
                  >
                    Already Subscribed
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelect(plan)}
                    disabled={subscribing === plan._id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-sm ${
                      plan.isPopular
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {subscribing === plan._id ? 'Processing…' : 'Select Plan'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
