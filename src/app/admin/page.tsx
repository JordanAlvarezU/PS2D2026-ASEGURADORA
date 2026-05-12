'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAdminAuth } from '@/lib/useAdminAuth'
import AdminLayout from '@/components/layout/AdminLayout'
import { Users, Package, MapPin, Globe, TrendingUp, Clock, Mail, Phone } from 'lucide-react'
import type { Lead } from '@/lib/firebase'

interface Stats {
  leads: number
  productos: number
  destinos: number
  origenes: number
}

export default function AdminDashboard() {
  const { loading, authorized } = useAdminAuth()
  const [stats, setStats] = useState<Stats>({ leads: 0, productos: 0, destinos: 0, origenes: 0 })
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!authorized) return
    const fetchData = async () => {
      try {
        const [leadsSnap, productosSnap, destinosSnap, origenSnap] = await Promise.all([
          getDocs(collection(db, 'leads')),
          getDocs(collection(db, 'productos')),
          getDocs(collection(db, 'destinos')),
          getDocs(collection(db, 'origen')),
        ])

        setStats({
          leads: leadsSnap.size,
          productos: productosSnap.size,
          destinos: destinosSnap.size,
          origenes: origenSnap.size,
        })

        // Recent leads
        const leadsData: Lead[] = leadsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Lead))
        leadsData.sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())
        setRecentLeads(leadsData.slice(0, 5))
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [authorized])

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-dark-green flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { label: 'Leads totales', value: stats.leads, icon: Users, color: 'bg-blue-500' },
    { label: 'Productos', value: stats.productos, icon: Package, color: 'bg-orange' },
    { label: 'Destinos', value: stats.destinos, icon: MapPin, color: 'bg-green-500' },
    { label: 'Orígenes', value: stats.origenes, icon: Globe, color: 'bg-purple-500' },
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark-green font-display">Dashboard</h1>
          <p className="text-gray-mid text-sm mt-1">Resumen general de EUA Assistance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-mid font-medium uppercase tracking-wider">{label}</p>
                <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon size={16} className="text-white" />
                </div>
              </div>
              {loadingData ? (
                <div className="h-8 w-16 bg-cream rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-dark-green">{value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-orange" />
              <h2 className="text-base font-semibold text-dark-green">Últimas cotizaciones</h2>
            </div>
            <a href="/admin/leads" className="text-xs text-orange hover:text-orange-hover font-medium">
              Ver todas →
            </a>
          </div>

          {loadingData ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-cream/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentLeads.length === 0 ? (
            <div className="p-12 text-center text-gray-mid">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay leads aún</p>
            </div>
          ) : (
            <div className="divide-y divide-cream">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="px-6 py-4 flex items-center gap-4 hover:bg-cream/30 transition-colors">
                  <div className="w-10 h-10 bg-dark-green rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-cream text-sm font-semibold">
                      {lead.contacto?.nombres?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark-green truncate">
                      {lead.contacto?.nombres} {lead.contacto?.apellidos}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-gray-mid">
                        <Mail size={10} /> {lead.contacto?.email}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-medium text-dark-green bg-cream px-2 py-1 rounded-lg">
                      {lead.datos_viaje?.destino || '—'}
                    </span>
                    <div className="flex items-center gap-1 justify-end mt-1 text-xs text-gray-mid">
                      <Clock size={10} />
                      {lead.creado_en ? new Date(lead.creado_en).toLocaleDateString('es-BO') : '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
