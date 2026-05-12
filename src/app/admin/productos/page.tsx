'use client'

import { useEffect, useState } from 'react'
import {
  collection, getDocs, deleteDoc, doc, updateDoc, addDoc, setDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Producto } from '@/lib/firebase'
import { useAdminAuth } from '@/lib/useAdminAuth'
import AdminLayout from '@/components/layout/AdminLayout'
import { Package, Plus, Pencil, Trash2, X, Check, PlusCircle, MinusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const emptyProducto: Omit<Producto, 'id'> = {
  nombre: '',
  activo: true,
  limite_edad: 65,
  region_cobertura: '',
  beneficios: [''],
  precio_base: 0,
  icon: '🛡️',
  color: '#FF8811',
}

function ProductoModal({
  producto,
  onClose,
  onSave,
}: {
  producto: Producto | null
  onClose: () => void
  onSave: (p: Omit<Producto, 'id'>, id?: string) => Promise<void>
}) {
  const [form, setForm] = useState<Omit<Producto, 'id'>>(
    producto ? { ...producto } : { ...emptyProducto, beneficios: [''] }
  )
  const [saving, setSaving] = useState(false)

  const handleBeneficio = (i: number, val: string) => {
    const arr = [...form.beneficios]
    arr[i] = val
    setForm(f => ({ ...f, beneficios: arr }))
  }

  const addBeneficio = () => setForm(f => ({ ...f, beneficios: [...f.beneficios, ''] }))
  const removeBeneficio = (i: number) => setForm(f => ({
    ...f,
    beneficios: f.beneficios.filter((_, idx) => idx !== i),
  }))

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return alert('El nombre es obligatorio.')
    setSaving(true)
    try {
      await onSave({ ...form, beneficios: form.beneficios.filter(b => b.trim()) }, producto?.id)
      onClose()
    } catch (e) {
      alert('Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-cream">
          <h3 className="text-base font-semibold text-dark-green">
            {producto ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg">
            <X size={18} className="text-gray-mid" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-mid mb-1 block">Nombre *</label>
              <input
                className="w-full border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-mid mb-1 block">Límite de edad</label>
              <input
                type="number"
                className="w-full border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
                value={form.limite_edad}
                onChange={e => setForm(f => ({ ...f, limite_edad: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-mid mb-1 block">Estado</label>
              <select
                className="w-full border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
                value={form.activo ? 'true' : 'false'}
                onChange={e => setForm(f => ({ ...f, activo: e.target.value === 'true' }))}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-mid mb-1 block">Precio base (USD)</label>
              <input
                type="number"
                className="w-full border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
                value={form.precio_base || 0}
                onChange={e => setForm(f => ({ ...f, precio_base: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-mid mb-1 block">Icono (Emoji)</label>
              <input
                className="w-full border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
                value={form.icon || ''}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="✈️"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-mid mb-1 block">Región de cobertura</label>
              <input
                className="w-full border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
                value={form.region_cobertura}
                onChange={e => setForm(f => ({ ...f, region_cobertura: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-mid">Beneficios</label>
              <button onClick={addBeneficio} className="flex items-center gap-1 text-xs text-orange hover:text-orange-hover">
                <PlusCircle size={13} /> Agregar
              </button>
            </div>
            <div className="space-y-2">
              {form.beneficios.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 border border-cream rounded-xl px-3 py-2 text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30"
                    value={b}
                    placeholder={`Beneficio ${i + 1}`}
                    onChange={e => handleBeneficio(i, e.target.value)}
                  />
                  {form.beneficios.length > 1 && (
                    <button onClick={() => removeBeneficio(i)} className="text-gray-mid hover:text-red-500 transition-colors">
                      <MinusCircle size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-cream text-sm text-dark-green hover:bg-cream transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-orange text-white text-sm font-medium hover:bg-orange-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={15} />}
              {producto ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductosAdminPage() {
  const { loading, authorized } = useAdminAuth()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [modalProducto, setModalProducto] = useState<Producto | null | 'new'>( null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProductos = async () => {
    setLoadingData(true)
    try {
      const snap = await getDocs(collection(db, 'productos'))
      setProductos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Producto)))
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (authorized) fetchProductos()
  }, [authorized])

  const handleSave = async (data: Omit<Producto, 'id'>, id?: string) => {
    if (id) {
      await updateDoc(doc(db, 'productos', id), data as any)
      setProductos(prev => prev.map(p => p.id === id ? { id, ...data } : p))
    } else {
      const ref = await addDoc(collection(db, 'productos'), data)
      setProductos(prev => [...prev, { id: ref.id, ...data }])
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'productos', id))
      setProductos(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Error al eliminar.')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleActivo = async (p: Producto) => {
    await updateDoc(doc(db, 'productos', p.id), { activo: !p.activo })
    setProductos(prev => prev.map(x => x.id === p.id ? { ...x, activo: !x.activo } : x))
  }

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-dark-green flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-green font-display">Productos</h1>
            <p className="text-gray-mid text-sm mt-1">{productos.length} planes de asistencia</p>
          </div>
          <button
            onClick={() => setModalProducto('new')}
            className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-hover transition-colors shadow-orange"
          >
            <Plus size={16} /> Nuevo producto
          </button>
        </div>

        {loadingData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-52 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="px-5 py-4 border-b border-cream flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-dark-green rounded-xl flex items-center justify-center">
                      <Package size={16} className="text-cream" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-green">{p.nombre}</p>
                      <p className="text-xs text-gray-mid">{p.region_cobertura}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActivo(p)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                      p.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    )}
                  >
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-mid">Límite de edad</p>
                      <p className="text-base font-bold text-dark-green">{p.limite_edad} años</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-mid mb-1.5">Beneficios ({p.beneficios?.length || 0})</p>
                    <ul className="space-y-1">
                      {p.beneficios?.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-dark-green/80">
                          <span className="text-orange mt-0.5">✓</span>
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                      {(p.beneficios?.length || 0) > 3 && (
                        <li className="text-xs text-gray-mid">+{p.beneficios.length - 3} más…</li>
                      )}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModalProducto(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-cream text-xs text-dark-green hover:bg-cream transition-colors"
                    >
                      <Pencil size={13} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 text-xs text-red-500 hover:bg-red-50 transition-colors"
                    >
                      {deletingId === p.id ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalProducto !== null && (
        <ProductoModal
          producto={modalProducto === 'new' ? null : modalProducto}
          onClose={() => setModalProducto(null)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  )
}
