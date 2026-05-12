'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Origen } from '@/lib/firebase'
import { useAdminAuth } from '@/lib/useAdminAuth'
import AdminLayout from '@/components/layout/AdminLayout'
import { Globe, Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react'

function OrigenModal({
  origen,
  onClose,
  onSave,
}: {
  origen: Origen | null
  onClose: () => void
  onSave: (d: Omit<Origen, 'id'>, id?: string) => Promise<void>
}) {
  const [nombre, setNombre] = useState(origen?.nombre || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!nombre.trim()) return alert('El nombre es obligatorio.')
    setSaving(true)
    try {
      await onSave({ nombre }, origen?.id)
      onClose()
    } catch {
      alert('Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-cream">
          <h3 className="text-base font-semibold text-dark-green">
            {origen ? 'Editar origen' : 'Nuevo origen'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg">
            <X size={18} className="text-gray-mid" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-mid mb-1 block">País / Ciudad *</label>
            <input
              className="w-full border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-cream text-sm text-dark-green hover:bg-cream transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-orange text-white text-sm font-medium hover:bg-orange-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={15} />}
              {origen ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrigenAdminPage() {
  const { loading, authorized } = useAdminAuth()
  const [origenes, setOrigenes] = useState<Origen[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [modal, setModal] = useState<Origen | null | 'new'>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchOrigenes = async () => {
    setLoadingData(true)
    try {
      const snap = await getDocs(collection(db, 'origen'))
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Origen))
      data.sort((a, b) => a.nombre.localeCompare(b.nombre))
      setOrigenes(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (authorized) fetchOrigenes()
  }, [authorized])

  const handleSave = async (data: Omit<Origen, 'id'>, id?: string) => {
    if (id) {
      await updateDoc(doc(db, 'origen', id), data)
      setOrigenes(prev => prev.map(o => o.id === id ? { id, ...data } : o))
    } else {
      const ref = await addDoc(collection(db, 'origen'), data)
      setOrigenes(prev => [...prev, { id: ref.id, ...data }].sort((a, b) => a.nombre.localeCompare(b.nombre)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este origen?')) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'origen', id))
      setOrigenes(prev => prev.filter(o => o.id !== id))
    } catch {
      alert('Error al eliminar.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-dark-green flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filtered = origenes.filter(o => o.nombre?.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-green font-display">Orígenes</h1>
            <p className="text-gray-mid text-sm mt-1">{origenes.length} países de origen</p>
          </div>
          <button
            onClick={() => setModal('new')}
            className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-hover transition-colors shadow-orange"
          >
            <Plus size={16} /> Nuevo origen
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-mid" />
          <input
            type="text"
            placeholder="Buscar país…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-cream text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30 shadow-card"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {loadingData ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-cream/50 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-gray-mid">
              <Globe size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No hay orígenes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 divide-y sm:divide-y-0">
              {filtered.map(o => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3.5 border-b border-cream hover:bg-cream/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-orange flex-shrink-0" />
                    <span className="text-sm font-medium text-dark-green">{o.nombre}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setModal(o)} className="p-1.5 rounded-lg hover:bg-cream text-gray-mid hover:text-dark-green transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(o.id)}
                      disabled={deletingId === o.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-mid hover:text-red-500 transition-colors"
                    >
                      {deletingId === o.id ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal !== null && (
        <OrigenModal
          origen={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  )
}
