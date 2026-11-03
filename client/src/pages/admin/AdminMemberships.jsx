import React, { useEffect, useState } from 'react'
import { Trash2, UserMinus, Search, Filter, AlertTriangle, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import { exportToCsv } from '../../utils/csvExport'

const STATUS_OPTIONS = ['active', 'expired', 'cancelled']

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** AdminMemberships — list with status update, direct unsubscribe action and delete */
export default function AdminMemberships() {
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [unsubscribingId, setUnsubscribingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all') // 'all' | 'active' | 'expired' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('')

  const fetchMemberships = () => {
    setLoading(true)
    api.get('/memberships')
      .then((res) => setMemberships(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => toast.error('Failed to load memberships'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchMemberships() }, [])

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      const res = await api.put(`/memberships/${id}`, { status: newStatus })
      const updated = res.data?.data || res.data
      setMemberships((prev) => prev.map((m) => (m._id === id ? { ...m, status: updated.status } : m)))
      toast.success(`Status updated to ${newStatus}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleUnsubscribe = async (membership) => {
    const userName = membership.user?.name || 'this user'
    const planName = membership.plan?.name || 'membership'

    if (!window.confirm(`Are you sure you want to UNSUBSCRIBE ${userName} from the ${planName} plan? Their access will be revoked immediately.`)) {
      return
    }

    setUnsubscribingId(membership._id)
    try {
      const res = await api.put(`/memberships/${membership._id}/unsubscribe`)
      const updated = res.data?.data || res.data
      setMemberships((prev) =>
        prev.map((m) => (m._id === membership._id ? { ...m, status: 'cancelled' } : m))
      )
      toast.success(`Successfully unsubscribed ${userName}!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unsubscribe user')
    } finally {
      setUnsubscribingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this membership record completely? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/memberships/${id}`)
      setMemberships((prev) => prev.filter((m) => m._id !== id))
      toast.success('Membership record deleted')
    } catch {
      toast.error('Failed to delete membership')
    } finally {
      setDeletingId(null)
    }
  }

  const statusBadgeClass = {
    active: 'bg-green-500/20 text-green-400',
    expired: 'bg-red-500/20 text-red-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
  }

  // Filtered and searched list
  const filtered = memberships.filter((m) => {
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      (m.user?.name || '').toLowerCase().includes(query) ||
      (m.user?.email || '').toLowerCase().includes(query) ||
      (m.plan?.name || '').toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  const activeCount = memberships.filter((m) => m.status === 'active').length

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Memberships Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            View member subscriptions, update status, and manage plan cancellations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              exportToCsv('fitzone_memberships', filtered, [
                { label: 'Member Name', accessor: (m) => m.user?.name || 'N/A' },
                { label: 'Email', accessor: (m) => m.user?.email || 'N/A' },
                { label: 'Plan', accessor: (m) => m.plan?.name || 'N/A' },
                { label: 'Price (INR)', accessor: (m) => m.plan?.price || 0 },
                { label: 'Start Date', accessor: (m) => fmt(m.startDate) },
                { label: 'End Date', accessor: (m) => fmt(m.endDate) },
                { label: 'Status', accessor: (m) => m.status },
              ])
            }
            className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm"
          >
            <Download size={13} className="text-white" /> Export CSV
          </button>

          <div className="flex items-center gap-2 bg-[#0b0c10] border border-white/10 rounded-full px-4 py-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-300 font-semibold">{activeCount} Active</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by member name, email or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b0c10] border border-white/10 rounded-full pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-white/30 focus:outline-none"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-gray-500" />
        </div>

        <div className="flex items-center gap-1.5 bg-[#0b0c10] p-1 rounded-full border border-white/10 text-xs">
          {['all', 'active', 'expired', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-1.5 rounded-full capitalize font-medium transition-all ${
                filterStatus === st
                  ? 'bg-white text-gray-950 font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-x-auto p-0 border border-white/10 bg-[#0b0c10] rounded-3xl shadow-xl backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-4 px-5 text-left">Member</th>
                <th className="py-4 px-5 text-left hidden md:table-cell">Email</th>
                <th className="py-4 px-5 text-left">Subscribed Plan</th>
                <th className="py-4 px-5 text-left hidden lg:table-cell">Start Date</th>
                <th className="py-4 px-5 text-left hidden lg:table-cell">End Date</th>
                <th className="py-4 px-5 text-left">Status</th>
                <th className="py-4 px-5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 text-xs">
                    No memberships found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 text-white font-semibold">
                      {m.user?.name || '—'}
                    </td>
                    <td className="py-4 px-5 text-gray-400 text-xs hidden md:table-cell">
                      {m.user?.email || '—'}
                    </td>
                    <td className="py-4 px-5 text-gray-300 font-medium">
                      <span className="text-white font-bold">{m.plan?.name || '—'}</span>
                      {m.plan?.price && <span className="text-gray-500 text-xs ml-1 font-mono">(₹{m.plan.price})</span>}
                    </td>
                    <td className="py-4 px-5 text-gray-500 text-xs hidden lg:table-cell font-mono">{fmt(m.startDate)}</td>
                    <td className="py-4 px-5 text-gray-500 text-xs hidden lg:table-cell font-mono">{fmt(m.endDate)}</td>
                    <td className="py-4 px-5">
                      {/* Status select */}
                      <select
                        value={m.status}
                        onChange={(e) => handleStatusChange(m._id, e.target.value)}
                        disabled={updatingId === m._id}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border border-white/10 cursor-pointer focus:outline-none focus:border-white/30 ${
                          statusBadgeClass[m.status] || statusBadgeClass.expired
                        } bg-[#0e0e14]`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-[#0e0e14] text-white capitalize">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Unsubscribe Power Button */}
                        {m.status === 'active' ? (
                          <button
                            onClick={() => handleUnsubscribe(m)}
                            disabled={unsubscribingId === m._id}
                            className="inline-flex items-center gap-1.5 bg-red-500/15 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            title="Unsubscribe user from this plan"
                          >
                            <UserMinus size={13} />
                            {unsubscribingId === m._id ? 'Cancelling…' : 'Unsubscribe'}
                          </button>
                        ) : (
                          <span className="text-gray-600 text-xs px-2 py-1 italic">
                            Cancelled / Inactive
                          </span>
                        )}

                        {/* Delete Record Button */}
                        <button
                          onClick={() => handleDelete(m._id)}
                          disabled={deletingId === m._id}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete record completely"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
