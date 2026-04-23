'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { staticData } from '@/lib/firebase'
import { Check, ArrowLeft, ArrowRight, Phone, MapPin, Calendar, Users, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

function CotizarContent() {
  const params = useSearchParams()
  const origen = params.get('origen') || ''
  const destino = params.get('destino') || ''
  const fechaSalida = params.get('fechaSalida') || ''
  const fechaRegreso = params.get('fechaRegreso') || ''
  const edadesStr = params.get('edades') || '30'
  const edades = edadesStr.split(',').map(Number)
  const [selected, setSelected] = useState<string | null>(null)

  const dias = fechaSalida && fechaRegreso
    ? Math.ceil((new Date(fechaRegreso).getTime() - new Date(fechaSalida).getTime()) / (1000 * 60 * 60 * 24))
    : 10

  const maxEdad = Math.max(...edades)
  const productos = staticData.productos.filter(p => p.activo && p.limite_edad >= maxEdad)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-cream">
        {/* Header */}
        <div className="bg-dark-green py-12">
          <div className="max-w-7xl mx-auto px-6">
            <Link href="/" className="inline-flex items-center gap-2 text-cream/60 hover:text-cream text-sm mb-6 transition-colors">
              <ArrowLeft size={16} />
              Volver al inicio
            </Link>
            <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Opciones de{' '}
              <span className="text-gradient">cobertura</span>
            </h1>
            <p className="text-cream/60 mb-6">Encontramos {productos.length} planes disponibles para tu viaje</p>

            {/* Trip summary */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: MapPin, label: `${origen || 'Bolivia'} → ${destino || 'Europa'}` },
                { icon: Calendar, label: `${dias} días de cobertura` },
                { icon: Users, label: `${edades.length} pasajero${edades.length > 1 ? 's' : ''} · Máx. ${maxEdad} años` },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-cream/80 text-sm">
                  <item.icon size={14} className="text-orange" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {productos.map((product, index) => {
              const precio = (product.precio_base * dias * edades.length).toFixed(2)
              const isPremium = product.nombre === 'Invicta'
              const isSelected = selected === product.id
              return (
                <div
                  key={product.id}
                  onClick={() => setSelected(product.id)}
                  className={cn(
                    'rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1',
                    isSelected
                      ? 'ring-2 ring-orange shadow-orange-lg'
                      : 'shadow-card hover:shadow-card-hover',
                    isPremium ? 'bg-dark-green text-white' : 'bg-white'
                  )}
                >
                  {isPremium && (
                    <div className="h-1 bg-gradient-orange" />
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-2xl mb-1">{product.icon}</div>
                        <h3 className={cn('text-xl font-bold', isPremium ? 'text-white' : 'text-dark-green')}
                          style={{ fontFamily: 'Playfair Display, serif' }}>
                          {product.nombre}
                        </h3>
                        <p className={cn('text-xs', isPremium ? 'text-cream/60' : 'text-gray-mid')}>
                          {product.region_cobertura}
                        </p>
                      </div>
                      {isPremium && (
                        <div className="bg-orange text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Star size={10} fill="white" />
                          TOP
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className={cn('text-3xl font-bold', isPremium ? 'text-orange' : 'text-dark-green')}>
                        USD ${precio}
                      </div>
                      <div className={cn('text-xs', isPremium ? 'text-cream/50' : 'text-gray-mid')}>
                        Total · {edades.length} pasajero{edades.length > 1 ? 's' : ''} · {dias} días
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {product.beneficios.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check size={14} className={cn('mt-0.5 shrink-0', isPremium ? 'text-orange' : 'text-dark-green')} />
                          <span className={cn('text-xs leading-relaxed', isPremium ? 'text-cream/70' : 'text-gray-mid')}>
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className={cn(
                      'text-xs px-3 py-1.5 rounded-lg inline-block mb-4',
                      isPremium ? 'bg-orange/15 text-orange' : 'bg-cream text-dark-green/70'
                    )}>
                      Hasta {product.limite_edad} años de edad
                    </div>

                    <button
                      className={cn(
                        'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group',
                        isSelected
                          ? 'bg-orange text-white shadow-orange'
                          : isPremium
                          ? 'bg-orange/20 text-orange hover:bg-orange hover:text-white'
                          : 'bg-dark-green text-white hover:bg-dark-green/90'
                      )}
                    >
                      {isSelected ? '✓ Seleccionado' : 'Seleccionar plan'}
                      {!isSelected && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {selected && (
            <div className="mt-8 p-6 bg-orange/10 border border-orange/30 rounded-2xl text-center">
              <p className="text-dark-green font-semibold mb-2">
                ✅ Plan seleccionado. ¿Deseas continuar?
              </p>
              <p className="text-gray-mid text-sm mb-4">
                Contacta con nuestro equipo de ventas para finalizar tu compra.
              </p>
              <a
                href="https://wa.link/g2f8eh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-green text-white font-semibold hover:bg-dark-green/90 transition-all group"
              >
                <Phone size={16} />
                Contactar por WhatsApp
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function CotizarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
      </div>
    }>
      <CotizarContent />
    </Suspense>
  )
}
