import React, { useEffect, useState } from 'react'
import { Trash2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** AdminEnquiries — status toggle and delete for contact enquiries */
export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchEnquiries = () => {
    setLoading(true)
    api.get('/enquiries')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || [])
        // Sort newest first
        const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setEnquiries(sorted)
      })
      .catch(() => toast.error('Failed to load enquiries'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEnquiries() }, [])

  const handleToggleStatus = async (enquiry) => {
    const newStatus = enquiry.status === 'new' ? 'resolved' : 'new'
    setTogglingId(enquiry._id)
    try {
      const res = await api.put(`/enquiries/${enquiry._id}`, { status: newStatus })
      setEnquiries((prev) =>
        prev.map((e) => (e._id === enquiry._id ? { ...e, status: res.data.status } : e))
      )
      toast.success(`Marked as ${newStatus}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return
    setDeletingId(id)
    try {
      await api.delete(`/enquiries/${id}`)
      setEnquiries((prev) => prev.filter((e) => e._id !== id))
      toast.success('Enquiry deleted')
    } catch {
      toast.error('Failed to delete enquiry')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Enquiries</h1>
        <p className="text-gray-400 text-sm mt-1">Manage contact form submissions</p>
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
                <th className="pb-3 text-left hidden md:table-cell">Phone</th>
                <th className="pb-3 text-left hidden lg:table-cell">Message</th>
                <th className="pb-3 text-left">Status</th>
                <th className="pb-3 text-left hidden xl:table-cell">Date</th>
                <th className="pb-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {enquiries.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-500">No enquiries found</td></tr>
              )}
              {enquiries.map((e) => (
                <tr key={e._id}>
                  <td className="py-3 text-white font-medium">{e.name}</td>
                  <td className="py-3 text-gray-400">{e.email}</td>
                  <td className="py-3 text-gray-400 hidden md:table-cell">{e.phone || '—'}</td>
                  <td className="py-3 text-gray-400 hidden lg:table-cell max-w-xs truncate">{e.message}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      e.status === 'new'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 hidden xl:table-cell">{fmt(e.createdAt)}</td>
                  <td className="py-3 flex items-center gap-1">
                    {/* Toggle status */}
                    <button
                      onClick={() => handleToggleStatus(e)}
                      disabled={togglingId === e._id}
                      className="p-2 text-gray-500 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors disabled:opacity-50"
                      title={e.status === 'new' ? 'Mark resolved' : 'Mark new'}
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(e._id)}
                      disabled={deletingId === e._id}
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
