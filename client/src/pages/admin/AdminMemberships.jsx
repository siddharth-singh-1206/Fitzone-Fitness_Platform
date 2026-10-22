import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const STATUS_OPTIONS = ['active', 'expired', 'cancelled']

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** AdminMemberships — list with status update and delete */
export default function AdminMemberships() {
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

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
      setMemberships((prev) => prev.map((m) => (m._id === id ? { ...m, status: res.data.status } : m)))
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this membership record?')) return
    setDeletingId(id)
    try {
      await api.delete(`/memberships/${id}`)
      setMemberships((prev) => prev.filter((m) => m._id !== id))
      toast.success('Membership deleted')
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Memberships</h1>
        <p className="text-gray-400 text-sm mt-1">View and manage all member subscriptions</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="pb-3 text-left">User</th>
                <th className="pb-3 text-left hidden md:table-cell">Email</th>
                <th className="pb-3 text-left">Plan</th>
                <th className="pb-3 text-left hidden lg:table-cell">Start</th>
                <th className="pb-3 text-left hidden lg:table-cell">End</th>
                <th className="pb-3 text-left">Status</th>
                <th className="pb-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {memberships.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-500">No memberships found</td></tr>
              )}
              {memberships.map((m) => (
                <tr key={m._id}>
                  <td className="py-3 text-white font-medium">
                    {m.user?.name || '—'}
                  </td>
                  <td className="py-3 text-gray-400 hidden md:table-cell">{m.user?.email || '—'}</td>
                  <td className="py-3 text-gray-300">{m.plan?.name || '—'}</td>
                  <td className="py-3 text-gray-500 hidden lg:table-cell">{fmt(m.startDate)}</td>
                  <td className="py-3 text-gray-500 hidden lg:table-cell">{fmt(m.endDate)}</td>
                  <td className="py-3">
                    {/* Status dropdown */}
                    <select
                      value={m.status}
                      onChange={(e) => handleStatusChange(m._id, e.target.value)}
                      disabled={updatingId === m._id}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 ${statusBadgeClass[m.status] || statusBadgeClass.expired} bg-transparent`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-gray-800 text-white">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(m._id)}
                      disabled={deletingId === m._id}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
