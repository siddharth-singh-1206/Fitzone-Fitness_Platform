import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
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
  Sparkles,
  Globe,
  ArrowUpRight,
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
 * Fully aligned with obsidian luxury theme.
 */
export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
      isActive
        ? 'bg-white text-gray-950 shadow-[0_0_20px_rgba(255,255,255,0.25)]'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#08080c] border-r border-white/10">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 text-base font-black tracking-wider">
          <Dumbbell className="text-white" size={20} />
          <span className="text-white uppercase font-extrabold tracking-widest">FIT ZONE</span>
        </div>
        <p className="text-gray-500 text-[11px] mt-1 font-mono uppercase tracking-wider">Admin Console</p>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-white/10 bg-[#0c0d12]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white text-xs font-bold">{user?.name}</p>
            <p className="text-gray-400 text-[11px]">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
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

      {/* View Live Website & Logout */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <Link
          to="/"
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all shadow-sm group"
        >
          <span className="flex items-center gap-2">
            <Globe size={15} className="text-gray-400 group-hover:text-white" />
            <span>View Live Website</span>
          </span>
          <ArrowUpRight size={14} className="text-gray-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-full text-xs font-medium text-gray-400 hover:bg-red-500/15 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          <span>Exit Admin</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#050508] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-64 flex flex-col z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#050508]">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-[#09090e] border-b border-white/10 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white p-1"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 font-black">
            <Dumbbell className="text-white" size={18} />
            <span className="text-white text-xs tracking-wider uppercase">FitZone Admin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#050508]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
