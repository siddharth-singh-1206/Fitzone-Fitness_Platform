import React, { useEffect, useState } from 'react'
import { Users, Dumbbell, ClipboardList, MessageSquare, TrendingUp } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** Admin Dashboard — stats cards + recent enquiries table */
export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, activeMemberships: 0, newEnquiries: 0, trainers: 0 })
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
        setStats({
          users: users.length,
          activeMemberships: memberships.filter((m) => m.status === 'active').length,
          newEnquiries: enquiries.filter((e) => e.status === 'new').length,
          trainers: trainers.length,
        })
        // Last 5 enquiries
        setRecentEnquiries(
          [...enquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
        )
      } catch {
        // silent fail — stats just show 0
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const CARDS = [
    { label: 'Total Users', value: stats.users, icon: <Users size={24} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Members', value: stats.activeMemberships, icon: <ClipboardList size={24} />, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'New Enquiries', value: stats.newEnquiries, icon: <MessageSquare size={24} />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Trainers', value: stats.trainers, icon: <Dumbbell size={24} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of FitZone platform</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {CARDS.map((c) => (
              <div key={c.label} className="card flex items-center gap-4">
                <div className={`${c.bg} ${c.color} p-3 rounded-xl`}>{c.icon}</div>
                <div>
                  <p className="text-gray-400 text-xs">{c.label}</p>
                  <p className="text-white text-2xl font-black">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Enquiries */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} className="text-orange-500" />
              <h2 className="text-white font-semibold">Recent Enquiries</h2>
            </div>
            {recentEnquiries.length === 0 ? (
              <p className="text-gray-500 text-sm">No enquiries yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="pb-3 text-left">Name</th>
                      <th className="pb-3 text-left">Email</th>
                      <th className="pb-3 text-left hidden md:table-cell">Message</th>
                      <th className="pb-3 text-left">Status</th>
                      <th className="pb-3 text-left hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {recentEnquiries.map((e) => (
                      <tr key={e._id}>
                        <td className="py-3 text-white font-medium">{e.name}</td>
                        <td className="py-3 text-gray-400">{e.email}</td>
                        <td className="py-3 text-gray-400 hidden md:table-cell max-w-xs truncate">
                          {e.message}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            e.status === 'new'
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500 hidden lg:table-cell">{fmt(e.createdAt)}</td>
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
