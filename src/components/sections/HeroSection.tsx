'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, MapPin, Users, PlusCircle, MinusCircle, ArrowRight, Shield } from 'lucide-react'
import { staticData } from '@/lib/firebase'
import { cn } from '@/lib/utils'

export default function HeroSection() {
  const router = useRouter()
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [fechaSalida, setFechaSalida] = useState('')
  const [fechaRegreso, setFechaRegreso] = useState('')
  const [edades, setEdades] = useState<number[]>([30])
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const addPasajero = () => {
    if (edades.length < 5) setEdades([...edades, 30])
  }

  const removePasajero = (index: number) => {
    if (edades.length > 1) setEdades(edades.filter((_, i) => i !== index))
  }

  const updateEdad = (index: number, value: number) => {
    const newEdades = [...edades]
    newEdades[index] = value
    setEdades(newEdades)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!origen || !destino || !fechaSalida || !fechaRegreso || !email) {
      setError('Por favor completa todos los campos para continuar.')
      return
    }
    const params = new URLSearchParams({
      origen, destino, fechaSalida, fechaRegreso,
      edades: edades.join(','), email,
    })
    router.push(`/cotizar?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero bg-pattern" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-orange/6 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-cream/4 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/4" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/4" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero text */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-orange/15 border border-orange/30 rounded-full px-4 py-1.5 text-orange text-sm font-medium mb-6 animate-fade-in">
              <Shield size={14} />
              Más de 18 años protegiendo viajeros
            </div>
            <h1 
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Tu{' '}
              <span className="text-gradient">protección</span>
              {' '}en cada rincón del mundo
            </h1>
            <p className="text-cream/70 text-lg leading-relaxed mb-8 animate-slide-up animate-delay-100">
              Asistencia médica, legal y personal en más de{' '}
              <strong className="text-white">130 países</strong>. 
              Desde el momento en que inicia tu viaje hasta que regresas a casa.
            </p>
            
            {/* Stats */}
            <div className="flex gap-8 animate-slide-up animate-delay-200">
              {[
                { value: '18+', label: 'Años de experiencia' },
                { value: '130', label: 'Países cubiertos' },
                { value: '24/7', label: 'Soporte disponible' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-orange">{stat.value}</div>
                  <div className="text-cream/60 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote form */}
          <div className="animate-slide-in-right">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Form header */}
              <div className="bg-dark-green px-6 py-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange animate-pulse-orange" />
                <h2 className="text-white font-semibold text-sm">Cotiza tu asistencia al viajero</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Origen / Destino */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                      <MapPin size={11} className="inline mr-1 text-orange" />
                      Origen
                    </label>
                    <select
                      value={origen}
                      onChange={(e) => setOrigen(e.target.value)}
                      className="form-input text-sm"
                    >
                      <option value="">Seleccione...</option>
                      {staticData.origen.map((o) => (
                        <option key={o.id} value={o.nombre}>{o.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                      <MapPin size={11} className="inline mr-1 text-orange" />
                      Destino
                    </label>
                    <select
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)}
                      className="form-input text-sm"
                    >
                      <option value="">Seleccione...</option>
                      {staticData.destinos.map((d) => (
                        <option key={d.id} value={d.nombre}>{d.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                      <CalendarDays size={11} className="inline mr-1 text-orange" />
                      Salida
                    </label>
                    <input
                      type="date"
                      value={fechaSalida}
                      onChange={(e) => setFechaSalida(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                      <CalendarDays size={11} className="inline mr-1 text-orange" />
                      Regreso
                    </label>
                    <input
                      type="date"
                      value={fechaRegreso}
                      onChange={(e) => setFechaRegreso(e.target.value)}
                      min={fechaSalida || new Date().toISOString().split('T')[0]}
                      className="form-input text-sm"
                    />
                  </div>
                </div>

                {/* Pasajeros */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-dark-green/70 uppercase tracking-wide">
                      <Users size={11} className="inline mr-1 text-orange" />
                      Edades de pasajeros
                    </label>
                    {edades.length < 5 && (
                      <button
                        type="button"
                        onClick={addPasajero}
                        className="flex items-center gap-1 text-orange text-xs font-medium hover:text-orange-hover transition-colors"
                      >
                        <PlusCircle size={14} />
                        Agregar
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {edades.map((edad, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <select
                          value={edad}
                          onChange={(e) => updateEdad(index, parseInt(e.target.value))}
                          className="form-input text-sm flex-1"
                        >
                          {Array.from({ length: 85 }, (_, i) => i).map((age) => (
                            <option key={age} value={age}>{age} años</option>
                          ))}
                        </select>
                        {edades.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePasajero(index)}
                            className="text-gray-mid hover:text-red-500 transition-colors"
                          >
                            <MinusCircle size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="form-input"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2">
                    ⚠️ {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-orange hover:bg-orange-hover text-white font-bold text-base transition-all duration-200 shadow-orange hover:shadow-orange-lg hover:scale-[1.02] group"
                >
                  Ver mis opciones
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-xs text-gray-mid">
                  Sin compromisos · Cotización gratuita · Respuesta inmediata
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/40">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-cream/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
