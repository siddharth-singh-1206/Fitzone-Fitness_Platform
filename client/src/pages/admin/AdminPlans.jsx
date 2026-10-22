import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const EMPTY = { name: '', price: '', duration: '', features: '', isPopular: false }

/** AdminPlans — full CRUD for membership plans */
export default function AdminPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchPlans = () => {
    setLoading(true)
    api.get('/plans')
      .then((res) => setPlans(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => toast.error('Failed to load plans'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPlans() }, [])

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (p) => {
    setEditTarget(p)
    setForm({
      name: p.name || '',
      price: p.price ?? '',
      duration: p.durationInDays ?? p.duration ?? '',
      features: (p.features || []).join(', '),
      isPopular: p.isPopular || false,
    })
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    const payload = {
      name: form.name,
      price: Number(form.price),
      durationInDays: Number(form.duration),
      duration: Number(form.duration),
      features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
      isPopular: form.isPopular,
    }
    setSaving(true)
    try {
      if (editTarget) {
        const res = await api.put(`/plans/${editTarget._id}`, payload)
        setPlans((prev) => prev.map((p) => (p._id === editTarget._id ? res.data : p)))
        toast.success('Plan updated')
      } else {
        const res = await api.post('/plans', payload)
        setPlans((prev) => [...prev, res.data])
        toast.success('Plan created')
      }
      setModalOpen(false)
    } catch {
      toast.error('Failed to save plan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return
    setDeletingId(id)
    try {
      await api.delete(`/plans/${id}`)
      setPlans((prev) => prev.filter((p) => p._id !== id))
      toast.success('Plan deleted')
    } catch {
      toast.error('Failed to delete plan')
    } finally {
      setDeletingId(null)
    }
  }

  const inputCls = 'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500 transition-colors'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Plans</h1>
          <p className="text-gray-400 text-sm mt-1">Manage membership plans</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="pb-3 text-left">Name</th>
                <th className="pb-3 text-left">Price</th>
                <th className="pb-3 text-left hidden md:table-cell">Duration</th>
                <th className="pb-3 text-left hidden lg:table-cell">Popular</th>
                <th className="pb-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {plans.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No plans found</td></tr>
              )}
              {plans.map((p) => (
                <tr key={p._id}>
                  <td className="py-3 text-white font-medium">{p.name}</td>
                  <td className="py-3 text-orange-400 font-semibold">₹{p.price}</td>
                  <td className="py-3 text-gray-400 hidden md:table-cell">{p.duration} days</td>
                  <td className="py-3 hidden lg:table-cell">
                    {p.isPopular && <Star size={16} className="text-orange-400 fill-orange-400" />}
                  </td>
                  <td className="py-3 flex items-center gap-1">
                    <button onClick={() => openEdit(p)} className="p-2 text-gray-500 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold">{editTarget ? 'Edit Plan' : 'Add Plan'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Plan Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Gold Membership" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Price (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className={inputCls} placeholder="2999" min="0" />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-medium mb-1">Duration (days)</label>
                  <input type="number" name="duration" value={form.duration} onChange={handleChange} className={inputCls} placeholder="30" min="1" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Features (comma-separated)</label>
                <textarea name="features" value={form.features} onChange={handleChange} rows={3} className={inputCls} placeholder="Unlimited access, Personal trainer, etc." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isPopular" id="planPopular" checked={form.isPopular} onChange={handleChange} className="accent-orange-500 w-4 h-4" />
                <label htmlFor="planPopular" className="text-gray-300 text-sm">Mark as Popular</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2 px-4 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 text-sm transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
