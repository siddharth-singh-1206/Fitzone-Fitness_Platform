import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** AdminUsers — read-only user list with delete */
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const fetchUsers = () => {
    setLoading(true)
    api.get('/users')
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Users</h1>
        <p className="text-gray-400 text-sm mt-1">Manage registered members</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="pb-3 text-left">Name</th>
                <th className="pb-3 text-left">Email</th>
                <th className="pb-3 text-left">Role</th>
                <th className="pb-3 text-left hidden md:table-cell">Joined</th>
                <th className="pb-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No users found</td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="py-3 text-white font-medium">{u.name}</td>
                  <td className="py-3 text-gray-400">{u.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      u.role === 'admin'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 hidden md:table-cell">{fmt(u.createdAt)}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={deletingId === u._id}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete user"
                    >
                      <Trash2 size={15} />
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
