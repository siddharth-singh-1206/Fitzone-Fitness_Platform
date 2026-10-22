import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

/** 404 Not Found page */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-[10rem] font-black leading-none gradient-text select-none">404</div>
        <h1 className="text-3xl font-bold text-white mt-4 mb-3">Page Not Found</h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
