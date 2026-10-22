import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Dumbbell, LayoutDashboard, LogOut, User } from 'lucide-react'

/**
 * Navbar — sticky dark navbar with mobile hamburger menu.
 * Shows different links based on auth state and role.
 */
export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-orange-500 font-semibold transition-colors'
      : 'text-gray-300 hover:text-orange-400 font-medium transition-colors'

  const handleLogout = () => {
    setMobileOpen(false)
    logout()
  }

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/trainers', label: 'Trainers' },
    { to: '/plans', label: 'Plans' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-wide">
            <Dumbbell className="text-orange-500" size={26} />
            <span className="text-white">FIT</span>
            <span className="text-orange-500">ZONE</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {publicLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <NavLink to="/my-membership" className={navLinkClass}>
                    My Membership
                  </NavLink>
                )}
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <span className="flex items-center gap-1">
                      <LayoutDashboard size={16} />
                      Admin
                    </span>
                  </NavLink>
                )}
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <User size={14} />
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 flex flex-col gap-4">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navLinkClass}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <hr className="border-gray-700" />
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <NavLink
                  to="/my-membership"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  My Membership
                </NavLink>
              )}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Dashboard
                </NavLink>
              )}
              <span className="text-gray-400 text-sm">Signed in as {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
