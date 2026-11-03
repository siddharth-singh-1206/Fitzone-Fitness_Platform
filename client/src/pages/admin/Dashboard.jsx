import React, { useEffect, useState } from 'react'
import {
  Users,
  Dumbbell,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  Download,
  IndianRupee,
  PieChart,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import { exportToCsv } from '../../utils/csvExport'

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    activeMemberships: 0,
    newEnquiries: 0,
    trainers: 0,
    totalRevenue: 0,
    mrr: 0,
  })

  const [allMemberships, setAllMemberships] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, membershipsRes, enquiriesRes, trainersRes] = await Promise.all([
          api.get('/users'),
          api.get('/memberships'),
          api.get('/enquiries'),
          api.get('/trainers'),
        ])

        const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.data || [])
        const memberships = Array.isArray(membershipsRes.data) ? membershipsRes.data : (membershipsRes.data?.data || [])
        const enquiries = Array.isArray(enquiriesRes.data) ? enquiriesRes.data : (enquiriesRes.data?.data || [])
        const trainers = Array.isArray(trainersRes.data) ? trainersRes.data : (trainersRes.data?.data || [])

        setAllMemberships(memberships)
        setAllUsers(users)

        // Calculate Revenue
        const totalRev = memberships.reduce((acc, m) => acc + (m.plan?.price || 0), 0)
        const activeRev = memberships
          .filter((m) => m.status === 'active')
          .reduce((acc, m) => acc + (m.plan?.price || 0), 0)

        setStats({
          users: users.length,
          activeMemberships: memberships.filter((m) => m.status === 'active').length,
          newEnquiries: enquiries.filter((e) => e.status === 'new').length,
          trainers: trainers.length,
          totalRevenue: totalRev,
          mrr: activeRev,
        })

        // Last 5 enquiries
        setRecentEnquiries(
          [...enquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
        )
      } catch (err) {
        console.warn('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Plan Distribution Breakdown
  const planCounts = allMemberships.reduce((acc, m) => {
    const pName = m.plan?.name || 'Other'
    acc[pName] = (acc[pName] || 0) + 1
    return acc
  }, {})

  const totalMembershipsCount = allMemberships.length || 1
  const basicCount = planCounts['Basic'] || 0
  const proCount = planCounts['Pro'] || 0
  const eliteCount = planCounts['Elite'] || 0

  const basicPct = Math.round((basicCount / totalMembershipsCount) * 100)
  const proPct = Math.round((proCount / totalMembershipsCount) * 100)
  const elitePct = Math.round((eliteCount / totalMembershipsCount) * 100)

  // CSV Export Handlers
  const handleExportMemberships = () => {
    exportToCsv(
      'fitzone_memberships',
      allMemberships,
      [
        { label: 'Member Name', accessor: (m) => m.user?.name || 'N/A' },
        { label: 'Member Email', accessor: (m) => m.user?.email || 'N/A' },
        { label: 'Plan Name', accessor: (m) => m.plan?.name || 'N/A' },
        { label: 'Plan Price (INR)', accessor: (m) => m.plan?.price || 0 },
        { label: 'Start Date', accessor: (m) => fmt(m.startDate) },
        { label: 'End Date', accessor: (m) => fmt(m.endDate) },
        { label: 'Subscription Status', accessor: (m) => m.status },
      ]
    )
    toast.success('Memberships report exported to CSV! 📊')
  }

  const handleExportUsers = () => {
    exportToCsv(
      'fitzone_registered_users',
      allUsers,
      [
        { label: 'Name', accessor: 'name' },
        { label: 'Email', accessor: 'email' },
        { label: 'Role', accessor: 'role' },
        { label: 'Joined Date', accessor: (u) => fmt(u.createdAt) },
        { label: 'Active Plan', accessor: (u) => u.activeMembership?.plan?.name || 'None' },
      ]
    )
    toast.success('Users list exported to CSV! 👥')
  }

  const handleToggleEnquiryStatus = async (enquiryId, currentStatus) => {
    const nextStatus = currentStatus === 'new' ? 'resolved' : 'new'
    try {
      await api.put(`/enquiries/${enquiryId}`, { status: nextStatus })
      setRecentEnquiries((prev) =>
        prev.map((e) => (e._id === enquiryId ? { ...e, status: nextStatus } : e))
      )
      toast.success(`Enquiry marked as ${nextStatus}`)
    } catch {
      toast.error('Failed to update enquiry status')
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Top Header & Export Quick Actions ───────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-white" /> Analytics &amp; Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Executive Command Center</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Live platform performance, business metrics, and accounting</p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportMemberships}
            className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm"
          >
            <Download size={13} className="text-white" /> Export Revenue (CSV)
          </button>
          <button
            onClick={handleExportUsers}
            className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm"
          >
            <Download size={13} className="text-gray-300" /> Export Members (CSV)
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* ── KPI Financial & Operation Cards ─────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Revenue */}
            <div className="card bg-[#0b0c10] border border-white/10 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold text-gray-400">Total Gross Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-emerald-400 flex items-center justify-center">
                  <IndianRupee size={20} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-white">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                  <ArrowUpRight size={13} className="text-emerald-400" /> From all plans subscribed
                </p>
              </div>
            </div>

            {/* Monthly Recurring Revenue */}
            <div className="card bg-[#0b0c10] border border-white/10 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold text-gray-400">Monthly Recurring (MRR)</span>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-white">₹{stats.mrr.toLocaleString()}</p>
                <p className="text-gray-400 text-xs mt-1">From active subscriptions</p>
              </div>
            </div>

            {/* Active Members */}
            <div className="card bg-[#0b0c10] border border-white/10 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold text-gray-400">Active Subscribers</span>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">
                  <ClipboardList size={20} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{stats.activeMemberships}</p>
                <p className="text-gray-400 text-xs mt-1">Out of {stats.users} total accounts</p>
              </div>
            </div>

            {/* New Inquiries */}
            <div className="card bg-[#0b0c10] border border-white/10 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold text-gray-400">Pending Enquiries</span>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{stats.newEnquiries}</p>
                <p className="text-gray-400 text-xs mt-1">Requires follow-up</p>
              </div>
            </div>
          </div>

          {/* ── Middle Row: Plan Breakdown & Monthly Trend ──── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Membership Tier Distribution (5 Cols) */}
            <div className="lg:col-span-5 card bg-[#0b0c10] border border-white/10 p-6 rounded-2xl space-y-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <PieChart size={18} className="text-white" /> Plan Popularity Split
                </h3>
                <span className="text-xs text-gray-400">{allMemberships.length} Total Sold</span>
              </div>

              {/* Progress Distribution Bar */}
              <div className="space-y-2">
                <div className="w-full h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden flex">
                  <div className="bg-gray-500 transition-all" style={{ width: `${basicPct}%` }} title="Basic" />
                  <div className="bg-white transition-all shadow-sm" style={{ width: `${proPct}%` }} title="Pro" />
                  <div className="bg-gray-300 transition-all" style={{ width: `${elitePct}%` }} title="Elite" />
                </div>

                <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-500" /> Basic ({basicPct}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white" /> Pro ({proPct}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-300" /> Elite ({elitePct}%)
                  </span>
                </div>
              </div>

              {/* Tier Cards Breakdown */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="bg-[#07070a] p-3 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-[10px]">Basic Tier</p>
                  <p className="text-white font-bold text-lg">{basicCount}</p>
                </div>
                <div className="bg-[#07070a] p-3 rounded-xl border border-white/20 ring-1 ring-white/10">
                  <p className="text-white font-bold text-[10px]">Pro (Popular)</p>
                  <p className="text-white font-bold text-lg">{proCount}</p>
                </div>
                <div className="bg-[#07070a] p-3 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-[10px]">Elite VIP</p>
                  <p className="text-white font-bold text-lg">{eliteCount}</p>
                </div>
              </div>
            </div>

            {/* Monthly Growth & Activity Simulator (7 Cols) */}
            <div className="lg:col-span-7 card bg-[#0b0c10] border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-400" /> Gym Check-in &amp; Revenue Trend
                </h3>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  +18.4% This Month
                </span>
              </div>

              {/* Simulated 6-Month CSS Bar Graph */}
              <div className="pt-2">
                <div className="flex items-end justify-between gap-4 h-36 px-2">
                  {[
                    { month: 'May', height: '40%', val: '₹14K' },
                    { month: 'Jun', height: '55%', val: '₹18K' },
                    { month: 'Jul', height: '65%', val: '₹22K' },
                    { month: 'Aug', height: '50%', val: '₹17K' },
                    { month: 'Sep', height: '80%', val: '₹28K' },
                    { month: 'Oct', height: '95%', val: '₹34K' },
                  ].map((bar) => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] text-gray-400 font-mono">{bar.val}</span>
                      <div
                        className="w-full bg-gradient-to-t from-zinc-700 via-zinc-400 to-white rounded-t-lg transition-all hover:brightness-125"
                        style={{ height: bar.height }}
                      />
                      <span className="text-[11px] text-gray-400 font-semibold">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Section: Recent Enquiries ───────────── */}
          <div className="card bg-[#0b0c10] border border-white/10 p-0 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-white" />
                <h2 className="text-white font-bold text-base">Latest Customer Enquiries &amp; Leads</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">Auto-synced</span>
            </div>

            {recentEnquiries.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No enquiries recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/[0.02] border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-5 text-left">Prospect</th>
                      <th className="py-3 px-5 text-left">Email</th>
                      <th className="py-3 px-5 text-left hidden md:table-cell">Message Inquiry</th>
                      <th className="py-3 px-5 text-left">Status</th>
                      <th className="py-3 px-5 text-left hidden lg:table-cell">Received</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentEnquiries.map((e) => (
                      <tr key={e._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-5 text-white font-medium">{e.name}</td>
                        <td className="py-3.5 px-5 text-gray-400 text-xs">{e.email}</td>
                        <td className="py-3.5 px-5 text-gray-400 text-xs hidden md:table-cell max-w-xs truncate">
                          {e.message}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              e.status === 'new'
                                ? 'bg-white/10 text-white border border-white/20'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {e.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-gray-500 text-xs hidden lg:table-cell">{fmt(e.createdAt)}</td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => handleToggleEnquiryStatus(e._id, e.status)}
                            className="text-xs text-white hover:text-gray-300 font-semibold underline"
                          >
                            {e.status === 'new' ? 'Mark Resolved' : 'Mark New'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
