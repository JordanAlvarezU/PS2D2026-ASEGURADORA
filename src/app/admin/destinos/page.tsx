'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Destino } from '@/lib/firebase'
import { useAdminAuth } from '@/lib/useAdminAuth'
import AdminLayout from '@/components/layout/AdminLayout'
import { MapPin, Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react'

const ZONAS = ['sudamerica', 'europa', 'norteamerica', 'centroamerica', 'caribe', 'mundial', 'asia', 'africa', 'oceania']

function DestinoModal({
  destino,
  onClose,
  onSave,
}: {
  destino: Destino | null
  onClose: () => void
  onSave: (d: Omit<Destino, 'id'>, id?: string) => Promise<void>
}) {
  const [form, setForm] = useState({ nombre: destino?.nombre || '', zona_tarifa: destino?.zona_tarifa || 'mundial' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return alert('El nombre es obligatorio.')
    setSaving(true)
    try {
      await onSave(form, destino?.id)
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
            {destino ? 'Editar destino' : 'Nuevo destino'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg">
            <X size={18} className="text-gray-mid" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-mid mb-1 block">Nombre *</label>
            <input
              className="w-full border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-mid mb-1 block">Zona tarifaria</label>
            <select
              className="w-full border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
              value={form.zona_tarifa}
              onChange={e => setForm(f => ({ ...f, zona_tarifa: e.target.value }))}
            >
              {ZONAS.map(z => (
                <option key={z} value={z}>{z.charAt(0).toUpperCase() + z.slice(1)}</option>
              ))}
            </select>
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
              {destino ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DestinosAdminPage() {
  const { loading, authorized } = useAdminAuth()
  const [destinos, setDestinos] = useState<Destino[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [modal, setModal] = useState<Destino | null | 'new'>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchDestinos = async () => {
    setLoadingData(true)
    try {
      const snap = await getDocs(collection(db, 'destinos'))
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Destino))
      data.sort((a, b) => a.nombre.localeCompare(b.nombre))
      setDestinos(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (authorized) fetchDestinos()
  }, [authorized])

  const handleSave = async (data: Omit<Destino, 'id'>, id?: string) => {
    if (id) {
      await updateDoc(doc(db, 'destinos', id), data)
      setDestinos(prev => prev.map(d => d.id === id ? { id, ...data } : d))
    } else {
      const ref = await addDoc(collection(db, 'destinos'), data)
      setDestinos(prev => [...prev, { id: ref.id, ...data }].sort((a, b) => a.nombre.localeCompare(b.nombre)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este destino?')) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'destinos', id))
      setDestinos(prev => prev.filter(d => d.id !== id))
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

  const filtered = destinos.filter(d => d.nombre?.toLowerCase().includes(search.toLowerCase()))

  const zonaColor: Record<string, string> = {
    europa: 'bg-blue-100 text-blue-700',
    sudamerica: 'bg-green-100 text-green-700',
    mundial: 'bg-purple-100 text-purple-700',
    norteamerica: 'bg-orange-100 text-orange-700',
    caribe: 'bg-cyan-100 text-cyan-700',
    centroamerica: 'bg-yellow-100 text-yellow-700',
    asia: 'bg-red-100 text-red-700',
    africa: 'bg-amber-100 text-amber-700',
    oceania: 'bg-teal-100 text-teal-700',
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-green font-display">Destinos</h1>
            <p className="text-gray-mid text-sm mt-1">{destinos.length} destinos registrados</p>
          </div>
          <button
            onClick={() => setModal('new')}
            className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-hover transition-colors shadow-orange"
          >
            <Plus size={16} /> Nuevo destino
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-mid" />
          <input
            type="text"
            placeholder="Buscar destino…"
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
              <MapPin size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No hay destinos</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream bg-[#f9faf5]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-mid uppercase tracking-wider">Destino</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-mid uppercase tracking-wider">Zona tarifaria</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-cream">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-dark-green">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-orange flex-shrink-0" />
                        {d.nombre}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${zonaColor[d.zona_tarifa] || 'bg-cream text-dark-green'}`}>
                        {d.zona_tarifa}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setModal(d)} className="p-1.5 rounded-lg hover:bg-cream text-gray-mid hover:text-dark-green transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          disabled={deletingId === d.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-mid hover:text-red-500 transition-colors"
                        >
                          {deletingId === d.id ? <div className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal !== null && (
        <DestinoModal
          destino={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  )
}
