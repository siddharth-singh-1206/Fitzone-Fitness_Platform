import React, { useEffect, useState } from 'react'
import { ChevronRight, CheckCircle } from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

// Cycle through varied Unsplash images for facilities
const FACILITY_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
]

/** Facilities page — full list of gym facilities */
export default function Facilities() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/facilities')
      .then((res) => setFacilities(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => setError('Failed to load facilities. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-900 border-b border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-orange-400 transition-colors">Home</a>
            <ChevronRight size={14} />
            <span className="text-orange-400">Facilities</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Our <span className="gradient-text">Facilities</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            State-of-the-art equipment and premium spaces built to push your performance to the next level.
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
        ) : facilities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No facilities found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f, i) => (
              <div key={f._id} className="card card-hover overflow-hidden p-0">
                <div className="relative">
                  <img
                    src={FACILITY_IMAGES[i % FACILITY_IMAGES.length]}
                    alt={f.name}
                    className="w-full h-52 object-cover"
                  />
                  {f.isActive && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      <CheckCircle size={12} /> Active
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg mb-2">{f.name}</h3>
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
