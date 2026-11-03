import React, { useEffect, useState } from 'react'
import { Trash2, UserMinus, Search, Shield, User, CheckCircle2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import { exportToCsv } from '../../utils/csvExport'

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** AdminUsers — user list with active membership display and admin unsubscribe power */
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [unsubscribingId, setUnsubscribingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchUsers = () => {
    setLoading(true)
    api.get('/users')
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleUnsubscribeUser = async (user) => {
    const planName = user.activeMembership?.plan?.name || 'Active Plan'
    if (!window.confirm(`Are you sure you want to UNSUBSCRIBE ${user.name} from their ${planName}? Their membership will be cancelled immediately.`)) {
      return
    }

    setUnsubscribingId(user._id)
    try {
      const res = await api.put(`/memberships/user/${user._id}/unsubscribe`)
      toast.success(res.data?.message || `Successfully unsubscribed ${user.name}!`)
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, activeMembership: null } : u))
      )
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unsubscribe user')
    } finally {
      setUnsubscribingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/users/${id}`)
      toast.success('User deleted')
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase()
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.activeMembership?.plan?.name || '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Registered Users & Members</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage accounts, view active plans, and revoke subscriptions</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() =>
              exportToCsv('fitzone_users', filteredUsers, [
                { label: 'Name', accessor: 'name' },
                { label: 'Email', accessor: 'email' },
                { label: 'Role', accessor: 'role' },
                { label: 'Active Subscription', accessor: (u) => u.activeMembership?.plan?.name || 'None' },
                { label: 'Joined On', accessor: (u) => fmt(u.createdAt) },
              ])
            }
            className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 text-xs font-semibold px-3 py-2 rounded-xl transition-colors shadow-sm shrink-0"
          >
            <Download size={13} className="text-blue-400" /> Export Users (CSV)
          </button>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name, email, or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b0c10] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-white/30 focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
          </div>
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
                <th className="py-4 px-5 text-left">Email</th>
                <th className="py-4 px-5 text-left">Role</th>
                <th className="py-4 px-5 text-left">Active Subscription</th>
                <th className="py-4 px-5 text-left hidden md:table-cell">Joined On</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500 text-xs">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 text-white font-semibold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {u.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-gray-400 text-xs">{u.email}</td>

                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-white/15 text-white border border-white/25 shadow-sm'
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}
                      >
                        {u.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                        {u.role}
                      </span>
                    </td>

                    {/* Active Plan Column */}
                    <td className="py-3.5 px-4">
                      {u.activeMembership?.plan ? (
                        <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-lg font-semibold">
                          <CheckCircle2 size={13} />
                          <span>{u.activeMembership.plan.name} Plan</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs italic">No Active Plan</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 text-xs hidden md:table-cell">{fmt(u.createdAt)}</td>

                    {/* Admin Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Unsubscribe user action */}
                        {u.activeMembership ? (
                          <button
                            onClick={() => handleUnsubscribeUser(u)}
                            disabled={unsubscribingId === u._id}
                            className="inline-flex items-center gap-1 bg-red-500/15 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            title="Unsubscribe user from active membership"
                          >
                            <UserMinus size={13} />
                            {unsubscribingId === u._id ? 'Cancelling…' : 'Unsubscribe'}
                          </button>
                        ) : null}

                        {/* Delete user */}
                        <button
                          onClick={() => handleDelete(u._id)}
                          disabled={deletingId === u._id}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete user"
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
