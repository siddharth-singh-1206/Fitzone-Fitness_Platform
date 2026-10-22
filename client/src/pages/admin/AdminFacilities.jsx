import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const EMPTY = { name: '', description: '', imageUrl: '', isActive: true }

/** AdminFacilities — full CRUD for gym facilities */
export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchFacilities = () => {
    setLoading(true)
    api.get('/facilities')
      .then((res) => setFacilities(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => toast.error('Failed to load facilities'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchFacilities() }, [])

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (f) => {
    setEditTarget(f)
    setForm({ name: f.name || '', description: f.description || '', imageUrl: f.imageUrl || '', isActive: f.isActive !== false })
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      if (editTarget) {
        const res = await api.put(`/facilities/${editTarget._id}`, form)
        setFacilities((prev) => prev.map((f) => (f._id === editTarget._id ? res.data : f)))
        toast.success('Facility updated')
      } else {
        const res = await api.post('/facilities', form)
        setFacilities((prev) => [...prev, res.data])
        toast.success('Facility added')
      }
      setModalOpen(false)
    } catch {
      toast.error('Failed to save facility')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility?')) return
    setDeletingId(id)
    try {
      await api.delete(`/facilities/${id}`)
      setFacilities((prev) => prev.filter((f) => f._id !== id))
      toast.success('Facility deleted')
    } catch {
      toast.error('Failed to delete facility')
    } finally {
      setDeletingId(null)
    }
  }

  const inputCls = 'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500 transition-colors'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Facilities</h1>
          <p className="text-gray-400 text-sm mt-1">Manage gym facilities</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Add Facility
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
                <th className="pb-3 text-left hidden md:table-cell">Description</th>
                <th className="pb-3 text-left">Active</th>
                <th className="pb-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {facilities.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500">No facilities found</td></tr>
              )}
              {facilities.map((f) => (
                <tr key={f._id}>
                  <td className="py-3 text-white font-medium">{f.name}</td>
                  <td className="py-3 text-gray-400 hidden md:table-cell max-w-xs truncate">{f.description}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${f.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {f.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 flex items-center gap-1">
                    <button onClick={() => openEdit(f)} className="p-2 text-gray-500 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(f._id)} disabled={deletingId === f._id} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"><Trash2 size={14} /></button>
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
              <h2 className="text-white font-semibold">{editTarget ? 'Edit Facility' : 'Add Facility'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Olympic Swimming Pool" />
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputCls} placeholder="Facility description..." />
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className={inputCls} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isActive" id="facilityActive" checked={form.isActive} onChange={handleChange} className="accent-orange-500 w-4 h-4" />
                <label htmlFor="facilityActive" className="text-gray-300 text-sm">Active</label>
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
