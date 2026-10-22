import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Building2,
  CreditCard,
  ClipboardList,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
  { to: '/admin/trainers', label: 'Trainers', icon: <Dumbbell size={18} /> },
  { to: '/admin/facilities', label: 'Facilities', icon: <Building2 size={18} /> },
  { to: '/admin/plans', label: 'Plans', icon: <CreditCard size={18} /> },
  { to: '/admin/memberships', label: 'Memberships', icon: <ClipboardList size={18} /> },
  { to: '/admin/enquiries', label: 'Enquiries', icon: <MessageSquare size={18} /> },
]

/**
 * AdminLayout — sidebar navigation + outlet for admin pages.
 * Has its own mobile header with hamburger since global Navbar is hidden.
 */
export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2 text-lg font-extrabold">
          <Dumbbell className="text-orange-500" size={22} />
          <span className="text-white">FIT</span>
          <span className="text-orange-500">ZONE</span>
        </div>
        <p className="text-gray-600 text-xs mt-1">Admin Panel</p>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{user?.name}</p>
            <p className="text-gray-500 text-xs">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-gray-900 border-b border-gray-800 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-1 font-extrabold">
            <Dumbbell className="text-orange-500" size={18} />
            <span className="text-white text-sm">FITZONE</span>
            <span className="text-orange-500 text-sm"> Admin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
