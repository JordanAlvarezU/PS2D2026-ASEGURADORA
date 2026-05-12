'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAppData } from '@/lib/useAppData'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Check, ArrowLeft, ArrowRight, Phone, MapPin, Calendar, Users, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Multiplicadores de precio por categoría de edad ──────────────────────────
// Menores (0–17): descuento del 30% sobre tarifa base
// Adultos (18–59): tarifa estándar (×1)
// Mayores (60+):  recargo del 50% sobre tarifa base (Age Upgrade)
const getAgeMultiplier = (age: number): number => {
  if (age <= 17) return 0.70
  if (age <= 59) return 1.00
  return 1.50
}

const getAgeCategoryLabel = (age: number): string => {
  if (age <= 17) return '🧒 Menor'
  if (age <= 59) return '🧑 Adulto'
  return '👴 Senior'
}

// ── Tabla de tarifas por plan y rango de días ─────────────────────────────────
// Los nombres de clave deben coincidir exactamente con product.nombre en firebase.ts
const tarifas: Record<string, Record<number, number>> = {
  Classic: {
    5: 30, 8: 32, 10: 35, 14: 41, 15: 41, 16: 44, 20: 50, 22: 50,
    30: 65, 45: 92, 60: 99, 90: 105, 120: 119, 150: 127, 180: 135,
    210: 176, 240: 203, 270: 244, 300: 271, 330: 312, 365: 339,
  },
  Priority: {
    5: 36, 8: 38, 10: 42, 14: 49, 15: 49, 16: 53, 20: 60, 22: 60,
    30: 78, 45: 110, 60: 119, 90: 126, 120: 143, 150: 152, 180: 162,
    210: 211, 240: 244, 270: 293, 300: 325, 330: 374, 365: 407,
  },
  // Clave "International" — coincide con product.nombre en firebase.ts
  International: {
    5: 37, 8: 47, 10: 57, 14: 77, 15: 82, 16: 85, 20: 85, 22: 95,
    30: 95, 45: 135, 60: 145, 90: 155, 120: 175, 150: 187, 180: 199,
    210: 259, 240: 299, 270: 359, 300: 399, 330: 459, 365: 499,
  },
  Invicta: {
    5: 44, 8: 56, 10: 68, 14: 92, 15: 98, 16: 102, 20: 102, 22: 114,
    30: 114, 45: 162, 60: 174, 90: 186, 120: 210, 150: 224, 180: 239,
    210: 311, 240: 359, 270: 431, 300: 479, 330: 551, 365: 599,
  },
  Gold: {
    5: 54, 8: 67, 10: 91, 14: 108, 15: 112, 16: 114, 20: 131, 22: 131,
    30: 146, 45: 175, 60: 235, 90: 361, 120: 403, 150: 445, 180: 487,
    210: 529, 240: 571, 270: 613, 300: 655, 330: 680, 365: 699,
  },
  Platino: {
    5: 77, 8: 102, 10: 119, 14: 149, 15: 149, 16: 149, 20: 167, 22: 167,
    30: 191, 45: 239, 60: 288, 90: 456, 120: 504, 150: 552, 180: 600,
    210: 648, 240: 696, 270: 744, 300: 792, 330: 815, 365: 840,
  },
}

const getTarifaPorDias = (planNombre: string, dias: number): number => {
  const tabla = tarifas[planNombre]
  if (!tabla) return 0
  const rangos = Object.keys(tabla).map(Number).sort((a, b) => a - b)
  const rangoEncontrado = rangos.find((r) => dias <= r)
  return rangoEncontrado ? tabla[rangoEncontrado] : tabla[365]
}

const calcPrecio = (planNombre: string, dias: number, edades: number[]): string => {
  const tarifaBase = getTarifaPorDias(planNombre, dias)
  const total = edades.reduce((sum, age) => sum + tarifaBase * getAgeMultiplier(age), 0)
  return total.toFixed(2)
}

// ── Etiqueta de categorías de edad del plan ───────────────────────────────────
// Reemplaza el antiguo "Hasta X años" con las 3 categorías de tarifa
function AgeCategoryBadges({ isPremium }: { isPremium: boolean }) {
  return (
    <div className="flex flex-wrap gap-1 mb-4">
      <span className={cn(
        'text-xs px-2 py-0.5 rounded-full',
        isPremium ? 'bg-white/10 text-cream/70' : 'bg-blue-50 text-blue-600'
      )}>
        🧒 0–17 · -30%
      </span>
      <span className={cn(
        'text-xs px-2 py-0.5 rounded-full',
        isPremium ? 'bg-white/10 text-cream/70' : 'bg-green-50 text-green-600'
      )}>
        🧑 18–59 · estándar
      </span>
      <span className={cn(
        'text-xs px-2 py-0.5 rounded-full',
        isPremium ? 'bg-orange/20 text-orange' : 'bg-orange/10 text-orange'
      )}>
        👴 60+ · +50%
      </span>
    </div>
  )
}

function CotizarContent() {
  const params = useSearchParams()
  const origen = params.get('origen') || ''
  const destino = params.get('destino') || ''
  const fechaSalida = params.get('fechaSalida') || ''
  const fechaRegreso = params.get('fechaRegreso') || ''
  const edadesStr = params.get('edades') || '30'
  const edades = edadesStr.split(',').map(Number)
  const [selected, setSelected] = useState<string | null>(null)
  const [savingLead, setSavingLead] = useState(false)
  const [email, setEmail] = useState(params.get('email') || '')
  const [telefono, setTelefono] = useState(params.get('telefono') || '')
  const { data, loading } = useAppData()

  const dias = fechaSalida && fechaRegreso
    ? Math.ceil(
        (new Date(fechaRegreso).getTime() - new Date(fechaSalida).getTime()) /
        (1000 * 60 * 60 * 24)
      )
    : 10

  const maxEdad = Math.max(...edades)
  const productos = data?.productos.filter((p) => p.activo && p.limite_edad >= maxEdad) || []

  // Guardar en Firestore y redirigir a WhatsApp
  const handleWhatsAppClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (savingLead) return

    setSavingLead(true)
    try {
      const planElegido = productos.find(p => p.id === selected)
      
      // Construir el objeto de lead con los datos requeridos
      const leadData = {
        contacto: {
          nombres: '', // Opcional, si no lo tenemos aún en el home
          apellidos: '',
          email: email,
          telefono: telefono,
        },
        creado_en: new Date().toISOString(), // O serverTimestamp()
        datos_viaje: {
          cantidad_pasajeros: edades.length,
          destino: destino,
          origen: origen,
          fecha_inicio: fechaSalida,
          fecha_fin: fechaRegreso,
          edades_pasajeros: edades,
        },
        // Guardamos también info de qué plan cotizó
        plan_seleccionado: planElegido?.nombre || 'Ninguno',
        precio_cotizado: selected ? calcPrecio(planElegido?.nombre || '', dias, edades) : 0,
        dias_viaje: dias
      }

      await addDoc(collection(db, 'leads'), leadData)
      
      // Construir el mensaje para el bot
      const mensaje = `Hola, me interesa el plan *${planElegido?.nombre || ''}* para mi viaje de ${origen} a ${destino} (${dias} días, ${edades.length} pasajeros). Cotización: $${selected ? calcPrecio(planElegido?.nombre || '', dias, edades) : 0}. Mi correo es ${email}.`
      
      // Redirigir a WhatsApp con el mensaje
      window.location.href = `https://wa.me/message/WDKJXXW2QZ2YJ1?text=${encodeURIComponent(mensaje)}`
    } catch (error) {
      console.error("Error al guardar lead:", error)
      // Si falla, igual redirigimos para no perder el cliente
      window.location.href = `https://wa.me/message/WDKJXXW2QZ2YJ1`
    } finally {
      setSavingLead(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-cream">
        {/* Header */}
        <div className="bg-dark-green py-12">
          <div className="max-w-7xl mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-cream/60 hover:text-cream text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              Volver al inicio
            </Link>
            <h1
              className="text-4xl font-bold text-white mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Opciones de <span className="text-gradient">cobertura</span>
            </h1>
            <p className="text-cream/60 mb-6">
              Encontramos {productos.length} planes disponibles para tu viaje
            </p>

            {/* Trip summary */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: MapPin, label: `${origen || 'Bolivia'} → ${destino || 'Europa'}` },
                { icon: Calendar, label: `${dias} días de cobertura` },
                {
                  icon: Users,
                  label: `${edades.length} pasajero${edades.length > 1 ? 's' : ''} · Máx. ${maxEdad} años`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-cream/80 text-sm"
                >
                  <item.icon size={14} className="text-orange" />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Age category breakdown */}
            {edades.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {edades.map((age, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/10 text-cream/70 rounded-full px-3 py-1"
                  >
                    Pas. {i + 1}: {age}a — {getAgeCategoryLabel(age)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {productos.map((product) => {
              const precio = calcPrecio(product.nombre, dias, edades)
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
                  {isPremium && <div className="h-1 bg-gradient-orange" />}
                  <div className="p-6">
                    {/* Plan header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-2xl mb-1">{product.icon}</div>
                        <h3
                          className={cn(
                            'text-xl font-bold',
                            isPremium ? 'text-white' : 'text-dark-green'
                          )}
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          {product.nombre}
                        </h3>
                        <p
                          className={cn(
                            'text-xs',
                            isPremium ? 'text-cream/60' : 'text-gray-mid'
                          )}
                        >
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

                    {/* Price */}
                    <div className="mb-2">
                      <div
                        className={cn(
                          'text-3xl font-bold',
                          isPremium ? 'text-orange' : 'text-dark-green'
                        )}
                      >
                        USD ${precio}
                      </div>
                      <div
                        className={cn(
                          'text-xs',
                          isPremium ? 'text-cream/50' : 'text-gray-mid'
                        )}
                      >
                        Total · {edades.length} pasajero{edades.length > 1 ? 's' : ''} · {dias} días
                      </div>

                      {/* Per-passenger breakdown */}
                      {edades.length > 0 && (
                        <div
                          className={cn(
                            'mt-2 space-y-0.5',
                            isPremium ? 'text-cream/50' : 'text-gray-mid'
                          )}
                        >
                          {edades.map((age, i) => (
                            <div key={i} className="text-xs flex justify-between">
                              <span>
                                {getAgeCategoryLabel(age)} (Pas. {i + 1}, {age}a)
                              </span>
                              <span>
                                USD $
                                {(
                                  getTarifaPorDias(product.nombre, dias) *
                                  getAgeMultiplier(age)
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Age category badges — reemplaza "Hasta X años" */}
                    <AgeCategoryBadges isPremium={isPremium} />

                    {/* Benefits */}
                    <ul className="space-y-2 mb-6">
                      {product.beneficios.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check
                            size={14}
                            className={cn(
                              'mt-0.5 shrink-0',
                              isPremium ? 'text-orange' : 'text-dark-green'
                            )}
                          />
                          <span
                            className={cn(
                              'text-xs leading-relaxed',
                              isPremium ? 'text-cream/70' : 'text-gray-mid'
                            )}
                          >
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>

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
                      {!isSelected && (
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      )}
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
                href="#"
                onClick={handleWhatsAppClick}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all group",
                  savingLead ? "bg-gray-400 text-white cursor-not-allowed" : "bg-dark-green hover:bg-dark-green/90 text-white hover:scale-105 shadow-orange hover:shadow-orange-lg"
                )}
              >
                {savingLead ? (
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  <Phone size={16} />
                )}
                {savingLead ? 'Conectando...' : 'Contactar por WhatsApp'}
                {!savingLead && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
        </div>
      }
    >
      <CotizarContent />
    </Suspense>
  )
}
