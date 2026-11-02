import React, { useEffect, useState } from 'react'
import { ChevronRight, CheckCircle, Sparkles } from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { FALLBACK_FACILITIES } from '../data/fallbackData'

const FACILITY_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
]

/** Facilities page — full list of gym facilities */
export default function Facilities() {
  const [facilities, setFacilities] = useState(FALLBACK_FACILITIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    api
      .get('/facilities')
      .then((res) => {
        if (!isMounted) return
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || [])
        if (list.length > 0) {
          setFacilities(list)
        }
      })
      .catch((err) => {
        console.warn('Could not fetch facilities, using fallback:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="bg-[#050508] min-h-screen text-white pt-24">
      {/* Page Header */}
      <div className="border-b border-white/10 py-16 px-4 relative overflow-hidden bg-[#09090e]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={13} />
            <span className="text-gray-300">Facilities</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
            <Sparkles size={12} className="text-white" /> Architecture & Equipment
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight sm:whitespace-nowrap">
            Our <span className="gradient-text">Facilities</span>
          </h1>
          <p className="text-gray-400 max-w-4xl text-sm sm:text-base leading-relaxed sm:whitespace-nowrap">
            State-of-the-art equipment and architecturally sculpted recovery zones built to push your performance to the next level.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <LoadingSpinner />
        ) : facilities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No facilities found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f, i) => (
              <div key={f._id || i} className="card card-hover overflow-hidden p-0 border border-white/10 bg-[#0d0d13]/85 rounded-2xl group shadow-2xl backdrop-blur-xl">
                <div className="relative overflow-hidden h-56">
                  <img
                    src={
                      f.image && !f.image.includes('placeholder.com')
                        ? f.image
                        : FACILITY_IMAGES[i % FACILITY_IMAGES.length]
                    }
                    alt={f.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d13] via-transparent to-transparent" />
                  {f.isActive !== false && (
                    <span className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/15">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Zone
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl mb-2">{f.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
