import React, { useEffect, useState } from 'react'
import { ChevronRight, Mail, Briefcase } from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

/** Trainers page — grid of trainer cards with bio and badges */
export default function Trainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/trainers')
      .then((res) => setTrainers(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => setError('Failed to load trainers. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-900 border-b border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-orange-400 transition-colors">Home</a>
            <ChevronRight size={14} />
            <span className="text-orange-400">Trainers</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Meet Our <span className="gradient-text">Trainers</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            Certified experts passionate about guiding you to peak performance.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No trainers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {trainers.map((t) => (
              <div key={t._id} className="card card-hover text-center">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-orange-500/30">
                  {t.name?.[0]?.toUpperCase()}
                </div>

                <h3 className="text-white font-bold text-lg mb-2">{t.name}</h3>

                <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {t.specialization}
                </span>

                <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-4">
                  <Briefcase size={12} />
                  <span>{t.experience} years experience</span>
                </div>

                {t.bio && (
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {t.bio}
                  </p>
                )}

                <a
                  href="/contact"
                  className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                >
                  <Mail size={14} />
                  Contact Trainer
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
