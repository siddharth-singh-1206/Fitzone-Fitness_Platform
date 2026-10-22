import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

/** Status badge with color coding */
function StatusBadge({ status }) {
  const config = {
    active: { label: 'Active', cls: 'bg-green-500/20 text-green-400', icon: <CheckCircle size={13} /> },
    expired: { label: 'Expired', cls: 'bg-red-500/20 text-red-400', icon: <XCircle size={13} /> },
    cancelled: { label: 'Cancelled', cls: 'bg-gray-500/20 text-gray-400', icon: <AlertCircle size={13} /> },
  }
  const c = config[status] || config.expired
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
      {c.icon} {c.label}
    </span>
  )
}

/** Formats a date string to readable format */
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'

/** Computes days remaining until end date */
const daysRemaining = (endDate) => {
  if (!endDate) return null
  const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

/** MyMembership page — shows user's current membership details */
export default function MyMembership() {
  const [membership, setMembership] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api
      .get('/memberships/my')
      .then((res) => setMembership(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true)
        else setError('Failed to load membership. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [])

  const remaining = membership ? daysRemaining(membership.endDate) : null

  return (
    <div className="bg-gray-950 min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">
          My <span className="gradient-text">Membership</span>
        </h1>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="card text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : notFound || !membership ? (
          /* Empty state */
          <div className="card text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <CalendarDays size={36} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">No Active Membership</h2>
            <p className="text-gray-400 mb-8 max-w-xs mx-auto">
              You haven't subscribed to any plan yet. Choose a plan to start your fitness journey!
            </p>
            <Link to="/plans" className="btn-primary">
              Browse Plans <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Membership card */
          <div className="relative">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-30" />
            <div className="relative card rounded-2xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Current Plan</p>
                  <h2 className="text-2xl font-black text-white">
                    {membership.plan?.name || 'Unknown Plan'}
                  </h2>
                </div>
                <StatusBadge status={membership.status} />
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-black text-orange-500">
                  ₹{membership.plan?.price}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  / {membership.plan?.duration} days
                </span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                    <CalendarDays size={12} /> Start Date
                  </p>
                  <p className="text-white font-semibold text-sm">{fmt(membership.startDate)}</p>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                    <CalendarDays size={12} /> End Date
                  </p>
                  <p className="text-white font-semibold text-sm">{fmt(membership.endDate)}</p>
                </div>
              </div>

              {/* Days remaining */}
              {membership.status === 'active' && remaining !== null && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center gap-3">
                  <Clock size={20} className="text-orange-500 shrink-0" />
                  <div>
                    <p className="text-orange-400 font-semibold">
                      {remaining > 0 ? `${remaining} days remaining` : 'Expires today'}
                    </p>
                    <p className="text-gray-400 text-xs">Keep going — you're on track!</p>
                  </div>
                </div>
              )}

              {/* Features */}
              {(membership.plan?.features || []).length > 0 && (
                <div className="mt-6">
                  <p className="text-gray-400 text-sm font-medium mb-3">Included Features</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {membership.plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle size={14} className="text-orange-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
