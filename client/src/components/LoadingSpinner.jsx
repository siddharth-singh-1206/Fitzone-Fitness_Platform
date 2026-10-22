import React from 'react'

/**
 * LoadingSpinner — centered spinning circle.
 * @param {string} size - Tailwind size class, default 'h-12 w-12'
 */
export default function LoadingSpinner({ size = 'h-12 w-12' }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div
        className={`${size} animate-spin rounded-full border-4 border-gray-700 border-t-orange-500`}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
