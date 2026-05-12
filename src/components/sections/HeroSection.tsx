'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, MapPin, Users, PlusCircle, MinusCircle, ArrowRight, Shield } from 'lucide-react'
import { useAppData } from '@/lib/useAppData'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    intlTelInput?: (
      input: HTMLInputElement,
      options: object
    ) => {
      getNumber: () => string
      isValidNumber: () => boolean
      setCountry: (iso2: string) => void
      getSelectedCountryData: () => {
        name: string
        iso2: string
        dialCode: string
      }
    }
  }
}

// Mapa de país (nombre en español) → código ISO2 para intl-tel-input
const COUNTRY_ISO2: Record<string, string> = {
  'Argentina':             'ar',
  'Bolivia':               'bo',
  'Brasil':                'br',
  'Chile':                 'cl',
  'Colombia':              'co',
  'Costa Rica':            'cr',
  'Ecuador':               'ec',
  'El Salvador':           'sv',
  'Guatemala':             'gt',
  'Honduras':              'hn',
  'Mexico':                'mx',
  'Panama':                'pa',
  'Paraguay':              'py',
  'Peru':                  'pe',
  'Republica Dominicana':  'do',
  'Uruguay':               'uy',
  'Venezuela':             've',
}

export default function HeroSection() {
  const router = useRouter()
  const phoneRef = useRef<HTMLInputElement>(null)
  const itiRef = useRef<{
    getNumber: () => string
    isValidNumber: () => boolean
    setCountry: (iso2: string) => void
    getSelectedCountryData: () => { name: string; iso2: string; dialCode: string }
  } | null>(null)

  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [fechaSalida, setFechaSalida] = useState('')
  const [fechaRegreso, setFechaRegreso] = useState('')
  const [edades, setEdades] = useState<number[]>([30])
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  // Rastreamos si el usuario ya interactuó con el teléfono (escribió un número O cambió el país manualmente)
  // Una vez tocado, el origen nunca vuelve a cambiar el código de país
  const phoneUserTouched = useRef(false)

  // Obtener datos desde Firebase
  const { data, loading } = useAppData()

  // ── Fecha regreso: máximo 1 año desde salida ───────────────────────────────
  const maxFechaRegreso = fechaSalida
    ? (() => {
        const d = new Date(fechaSalida)
        d.setFullYear(d.getFullYear() + 1)
        return d.toISOString().split('T')[0]
      })()
    : ''

  const handleFechaSalidaChange = (val: string) => {
    setFechaSalida(val)
    if (val && fechaRegreso) {
      const maxDate = new Date(val)
      maxDate.setFullYear(maxDate.getFullYear() + 1)
      if (new Date(fechaRegreso) > maxDate || new Date(fechaRegreso) <= new Date(val)) {
        setFechaRegreso('')
      }
    }
  }

  // ── Cambiar país del teléfono según origen ────────────────────────────────
  // Solo cambia si el usuario NUNCA ha tocado el campo de teléfono
  const handleOrigenChange = (val: string) => {
    setOrigen(val)
    if (!phoneUserTouched.current && itiRef.current) {
      const iso2 = COUNTRY_ISO2[val]
      if (iso2) {
        itiRef.current.setCountry(iso2)
      }
    }
  }

  // ── Cargar intl-tel-input ──────────────────────────────────────────────────
  useEffect(() => {
    const initIti = () => {
      if (phoneRef.current && window.intlTelInput) {
        itiRef.current = window.intlTelInput(phoneRef.current, {
          initialCountry: 'bo',
          separateDialCode: true,
          preferredCountries: ['bo', 'pe', 'ar', 'co', 'cl', 'mx'],
          utilsScript:
            'https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/utils.js',
        })
        // Si el usuario cambia el país manualmente desde el dropdown de banderas,
        // marcar como "tocado" para que el origen ya no lo sobreescriba
        phoneRef.current.addEventListener('countrychange', () => {
          phoneUserTouched.current = true
        })
      }
    }

    if (window.intlTelInput) {
      // Ya estaba cargado; solo inicializar
      initIti()
    } else {
      // CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href =
        'https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/css/intlTelInput.min.css'
      document.head.appendChild(link)

      // JS principal — el utilsScript se pasa como opción, no como script separado
      const script = document.createElement('script')
      script.src =
        'https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/intlTelInput.min.js'
      script.onload = initIti
      document.head.appendChild(script)
    }
  }, [])

  // ── Pasajeros ──────────────────────────────────────────────────────────────
  const addPasajero = () => {
    if (edades.length < 5) setEdades([...edades, 30])
  }
  const removePasajero = (index: number) => {
    if (edades.length > 1) setEdades(edades.filter((_, i) => i !== index))
  }
  const updateEdad = (index: number, value: number) => {
    const next = [...edades]
    next[index] = value
    setEdades(next)
  }
  const getAgeCategory = (age: number) => {
    if (age <= 17) return '🧒 Menor (0–17)'
    if (age <= 59) return '🧑 Adulto (18–59)'
    return '👴 Mayor (60+)'
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const phone = itiRef.current
      ? itiRef.current.getNumber()
      : phoneRef.current?.value || ''

    // Validación de teléfono (solo si ingresó algo)
    // Nota: NO usamos isValidNumber() porque depende de utils.js que carga
    // de forma asíncrona y puede no estar listo. Usamos validación por longitud.
    const rawPhone = phoneRef.current?.value || ''
    if (rawPhone.length > 0 && itiRef.current) {
      const country = itiRef.current.getSelectedCountryData()
        
      // Validar que sean SOLO números
      if (!/^\d+$/.test(rawPhone)) {
        setError('El teléfono solo debe contener números.')
        return
      }
    
      if (country.iso2 === 'bo') {
        // Bolivia: exactamente 8 dígitos y empieza con 6 o 7
        if (rawPhone.length !== 8 || !/^[67]/.test(rawPhone)) {
          setError('El número boliviano debe tener 8 dígitos y comenzar con 6 o 7.')
          return
        }
      } else {
        // Resto de países
        if (rawPhone.length < 6 || rawPhone.length > 15) {
          setError(`El número para ${country.name} debe tener entre 6 y 15 dígitos.`)
          return
        }
      }
    }

    if (!origen || !destino || !fechaSalida || !fechaRegreso || !email) {
      setError('Por favor completa todos los campos para continuar.')
      return
    }

    const params = new URLSearchParams({
      origen, destino, fechaSalida, fechaRegreso,
      edades: edades.join(','), email,
      telefono: phone,
    })
    router.push(`/cotizar?${params.toString()}`)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero bg-pattern" />
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
                      onChange={(e) => handleOrigenChange(e.target.value)}
                      className="form-input text-sm"
                      disabled={loading}
                    >
                      <option value="">{loading ? 'Cargando...' : 'Seleccione...'}</option>
                      {data?.origen.map((o) => (
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
                      disabled={loading}
                    >
                      <option value="">{loading ? 'Cargando...' : 'Seleccione...'}</option>
                      {data?.destinos.map((d) => (
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
                      onChange={(e) => handleFechaSalidaChange(e.target.value)}
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
                      max={maxFechaRegreso}
                      className="form-input text-sm"
                    />
                    {maxFechaRegreso && (
                      <p className="text-xs text-gray-mid mt-1">Máx. 1 año desde salida</p>
                    )}
                  </div>
                </div>

                {/* Pasajeros */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-dark-green/70 uppercase tracking-wide">
                      <Users size={11} className="inline mr-1 text-orange" />
                      Pasajeros y edades
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
                        <div className="flex-1">
                          <select
                            value={edad}
                            onChange={(e) => updateEdad(index, parseInt(e.target.value))}
                            className="form-input text-sm w-full"
                          >
                            {Array.from({ length: 86 }, (_, i) => i).map((age) => (
                              <option key={age} value={age}>{age} años</option>
                            ))}
                          </select>
                          <span className="text-xs text-gray-mid mt-0.5 block">
                            {getAgeCategory(edad)}
                          </span>
                        </div>
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-50 text-blue-600 rounded-md px-2 py-0.5">🧒 0–17: tarifa menor</span>
                    <span className="text-xs bg-green-50 text-green-600 rounded-md px-2 py-0.5">🧑 18–59: tarifa estándar</span>
                    <span className="text-xs bg-orange/10 text-orange rounded-md px-2 py-0.5">👴 60+: tarifa senior</span>
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

                {/* Teléfono con código de país */}
                <div>
                  <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                    Teléfono / WhatsApp
                  </label>
                  {/* iti-hero: clase usada en globals.css para hacer el dropdown más ancho */}
                  <div className="iti-hero-wrapper">
                    <input
                      ref={phoneRef}
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={15}
                      className="form-input"
                      placeholder="Tu número de contacto"
                      onInput={(e) => {
                        // Solo permitir números
                        e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')
                      
                        // Marcar tocado cuando escribe
                        phoneUserTouched.current = true
                      }}
                      onFocus={() => {
                        // Marcar tocado al hacer foco
                        phoneUserTouched.current = true
                      }}
                    />
                  </div>
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/40">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-cream/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
