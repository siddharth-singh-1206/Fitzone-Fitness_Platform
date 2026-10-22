import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const EMPTY = { name: '', specialization: '', experience: '', bio: '', imageUrl: '', isActive: true }

/** AdminTrainers — full CRUD for trainers */
export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // null = create mode
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchTrainers = () => {
    setLoading(true)
    api.get('/trainers')
      .then((res) => setTrainers(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(() => toast.error('Failed to load trainers'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrainers() }, [])

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (trainer) => {
    setEditTarget(trainer)
    setForm({
      name: trainer.name || '',
      specialization: trainer.specialization || '',
      experience: trainer.experience ?? '',
      bio: trainer.bio || '',
      imageUrl: trainer.imageUrl || '',
      isActive: trainer.isActive !== false,
    })
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
        const res = await api.put(`/trainers/${editTarget._id}`, form)
        setTrainers((prev) => prev.map((t) => (t._id === editTarget._id ? res.data : t)))
        toast.success('Trainer updated')
      } else {
        const res = await api.post('/trainers', form)
        setTrainers((prev) => [...prev, res.data])
        toast.success('Trainer added')
      }
      setModalOpen(false)
    } catch {
      toast.error('Failed to save trainer')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trainer?')) return
    setDeletingId(id)
    try {
      await api.delete(`/trainers/${id}`)
      setTrainers((prev) => prev.filter((t) => t._id !== id))
      toast.success('Trainer deleted')
    } catch {
      toast.error('Failed to delete trainer')
    } finally {
      setDeletingId(null)
    }
  }

  const inputCls =
    'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500 transition-colors'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Trainers</h1>
          <p className="text-gray-400 text-sm mt-1">Manage gym trainers</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Add Trainer
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
                <th className="pb-3 text-left">Specialization</th>
                <th className="pb-3 text-left hidden md:table-cell">Experience</th>
                <th className="pb-3 text-left hidden lg:table-cell">Active</th>
                <th className="pb-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {trainers.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No trainers found</td></tr>
              )}
              {trainers.map((t) => (
                <tr key={t._id}>
                  <td className="py-3 text-white font-medium">{t.name}</td>
                  <td className="py-3 text-gray-400">{t.specialization}</td>
                  <td className="py-3 text-gray-400 hidden md:table-cell">{t.experience} yrs</td>
                  <td className="py-3 hidden lg:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      t.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {t.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 flex items-center gap-1">
                    <button onClick={() => openEdit(t)} className="p-2 text-gray-500 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(t._id)} disabled={deletingId === t._id} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                      <Trash2 size={14} />
                    </button>
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
              <h2 className="text-white font-semibold">{editTarget ? 'Edit Trainer' : 'Add Trainer'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Specialization</label>
                <input name="specialization" value={form.specialization} onChange={handleChange} className={inputCls} placeholder="Strength & Conditioning" />
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Experience (years)</label>
                <input type="number" name="experience" value={form.experience} onChange={handleChange} className={inputCls} placeholder="5" min="0" />
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className={inputCls} placeholder="Short bio..." />
              </div>
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-1">Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className={inputCls} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isActive" id="trainerActive" checked={form.isActive} onChange={handleChange} className="accent-orange-500 w-4 h-4" />
                <label htmlFor="trainerActive" className="text-gray-300 text-sm">Active</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2 px-4 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 text-sm transition-colors">
                  Cancel
                </button>
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
