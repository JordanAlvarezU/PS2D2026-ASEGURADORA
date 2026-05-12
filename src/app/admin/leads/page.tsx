'use client'

import { useEffect, useState } from 'react'
import {
  collection, getDocs, deleteDoc, doc, query, orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAdminAuth } from '@/lib/useAdminAuth'
import AdminLayout from '@/components/layout/AdminLayout'
import type { Lead } from '@/lib/firebase'
import {
  Users, Search, Trash2, Eye, Mail, Phone, MapPin, Calendar,
  ChevronDown, X, Globe, Clock,
} from 'lucide-react'

function LeadModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-BO', {
    day: '2-digit', month: 'long', year: 'numeric',
  }) : '—'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-cream">
          <h3 className="text-base font-semibold text-dark-green">Detalle del Lead</h3>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg transition-colors">
            <X size={18} className="text-gray-mid" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {/* Contacto */}
          <div>
            <p className="text-xs font-semibold text-orange uppercase tracking-wider mb-3">Contacto</p>
            <div className="bg-cream/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-dark-green">
                {lead.contacto?.nombres} {lead.contacto?.apellidos}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-mid">
                <Mail size={12} className="text-orange" />
                {lead.contacto?.email || '—'}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-mid">
                <Phone size={12} className="text-orange" />
                {lead.contacto?.telefono || '—'}
              </div>
            </div>
          </div>

          {/* Viaje */}
          <div>
            <p className="text-xs font-semibold text-orange uppercase tracking-wider mb-3">Datos del Viaje</p>
            <div className="bg-cream/50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-mid">Origen</p>
                  <p className="text-sm font-medium text-dark-green">{lead.datos_viaje?.origen || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-mid">Destino</p>
                  <p className="text-sm font-medium text-dark-green">{lead.datos_viaje?.destino || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-mid">Fecha inicio</p>
                  <p className="text-sm font-medium text-dark-green">{formatDate(lead.datos_viaje?.fecha_inicio)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-mid">Fecha fin</p>
                  <p className="text-sm font-medium text-dark-green">{formatDate(lead.datos_viaje?.fecha_fin)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-mid">Pasajeros</p>
                  <p className="text-sm font-medium text-dark-green">{lead.datos_viaje?.cantidad_pasajeros || '—'}</p>
                </div>
              </div>
              {lead.datos_viaje?.edades_pasajeros?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-mid mb-1">Edades</p>
                  <div className="flex flex-wrap gap-1">
                    {lead.datos_viaje.edades_pasajeros.map((e, i) => (
                      <span key={i} className="bg-dark-green text-cream text-xs px-2 py-0.5 rounded-full">
                        {e} años
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-gray-mid">
            <Clock size={12} />
            Registrado: {formatDate(lead.creado_en)}
            <span className="text-cream">|</span>
            ID: <code className="bg-cream px-1 rounded text-dark-green">{lead.id.slice(0, 8)}…</code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LeadsPage() {
  const { loading, authorized } = useAdminAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchLeads = async () => {
    setLoadingData(true)
    try {
      const snap = await getDocs(collection(db, 'leads'))
      const data: Lead[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Lead))
      data.sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())
      setLeads(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (authorized) fetchLeads()
  }, [authorized])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este lead? Esta acción no se puede deshacer.')) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'leads', id))
      setLeads(prev => prev.filter(l => l.id !== id))
    } catch (e) {
      alert('Error al eliminar el lead.')
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

  const filtered = leads.filter(l => {
    const q = search.toLowerCase()
    return (
      l.contacto?.nombres?.toLowerCase().includes(q) ||
      l.contacto?.apellidos?.toLowerCase().includes(q) ||
      l.contacto?.email?.toLowerCase().includes(q) ||
      l.datos_viaje?.destino?.toLowerCase().includes(q) ||
      l.datos_viaje?.origen?.toLowerCase().includes(q)
    )
  })

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-green font-display">Leads / Cotizaciones</h1>
            <p className="text-gray-mid text-sm mt-1">{leads.length} registros totales</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-mid" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, destino…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-cream text-sm text-dark-green focus:outline-none focus:ring-2 focus:ring-orange/30 shadow-card"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-mid" />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {loadingData ? (
            <div className="p-8 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-cream/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-gray-mid">
              <Users size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No se encontraron resultados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream bg-[#f9faf5]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-mid uppercase tracking-wider">Nombre</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-mid uppercase tracking-wider hidden md:table-cell">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-mid uppercase tracking-wider hidden lg:table-cell">Ruta</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-mid uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream">
                  {filtered.map(lead => (
                    <tr key={lead.id} className="hover:bg-cream/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-dark-green rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-cream text-xs font-semibold">
                              {lead.contacto?.nombres?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-dark-green">
                              {lead.contacto?.nombres} {lead.contacto?.apellidos}
                            </p>
                            <p className="text-xs text-gray-mid md:hidden">{lead.contacto?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-gray-mid">{lead.contacto?.email}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="text-xs bg-cream px-2 py-1 rounded-lg text-dark-green font-medium">
                          {lead.datos_viaje?.origen} → {lead.datos_viaje?.destino}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-xs text-gray-mid">
                        {lead.creado_en ? new Date(lead.creado_en).toLocaleDateString('es-BO') : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 rounded-lg hover:bg-cream transition-colors text-gray-mid hover:text-dark-green"
                            title="Ver detalle"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            disabled={deletingId === lead.id}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-mid hover:text-red-500"
                            title="Eliminar"
                          >
                            {deletingId === lead.id ? (
                              <div className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedLead && <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </AdminLayout>
  )
}
