'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react'

declare global {
  interface Window {
    intlTelInput?: (
      input: HTMLInputElement,
      options: object
    ) => {
      getNumber: () => string
      isValidNumber: () => boolean
      getSelectedCountryData: () => { name: string; iso2: string; dialCode: string }
    }
  }
}

export default function ContactoPage() {
  const phoneRef = useRef<HTMLInputElement>(null)
  const itiRef = useRef<{
    getNumber: () => string
    isValidNumber: () => boolean
    getSelectedCountryData: () => { name: string; iso2: string; dialCode: string }
  } | null>(null)

  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

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
      }
    }

    if (window.intlTelInput) {
      initIti()
    } else {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href =
        'https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/css/intlTelInput.min.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src =
        'https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/intlTelInput.min.js'
      script.onload = initIti
      document.head.appendChild(script)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.nombre || !form.email || !form.mensaje) {
      setError('Por favor completa los campos obligatorios.')
      return
    }

    // Validación de teléfono (opcional — solo si ingresó algo)
    const rawPhone = phoneRef.current?.value?.replace(/\D/g, '') || ''
    if (rawPhone.length > 0 && itiRef.current) {
      const country = itiRef.current.getSelectedCountryData()

      if (country.iso2 === 'bo') {
        // Bolivia: exactamente 8 dígitos, empieza con 6 o 7
        if (rawPhone.length !== 8 || !/^[67]/.test(rawPhone)) {
          setError('El número boliviano debe tener 8 dígitos y comenzar con 6 o 7.')
          return
        }
      } else {
        // Resto del mundo: longitud mínima/máxima estándar ITU-T E.164
        if (rawPhone.length < 6 || rawPhone.length > 15) {
          setError(`El número para ${country.name} debe tener entre 6 y 15 dígitos.`)
          return
        }
      }
    }

    setLoading(true)
    // TODO: Guardar lead en Firebase y enviar email
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1800)
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-dark-green py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Contáctanos
          </h1>
          <p className="text-cream/60 text-xl max-w-xl mx-auto">
            Estamos aquí para ayudarte. Respuesta en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-gradient-cream">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          
          {/* Contact info */}
          <div>
            <h2 className="text-3xl font-bold text-dark-green mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Nuestros canales de{' '}
              <span className="text-gradient">atención</span>
            </h2>
            <p className="text-gray-mid leading-relaxed mb-8">
              Contamos con múltiples canales para atenderte. Nuestro equipo está disponible las 24 horas para emergencias.
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  icon: Phone,
                  title: 'WhatsApp / Ventas',
                  value: '+591 78442941',
                  href: 'https://wa.link/g2f8eh',
                  highlight: true,
                },
                {
                  icon: Phone,
                  title: 'Central Bolivia - La Paz',
                  value: '+591 78442941',
                  href: 'tel:+59178442941',
                },
                {
                  icon: Phone,
                  title: 'Central USA - Florida',
                  value: '+1 (954) 678 6680',
                  href: 'tel:+19546786680',
                },
                {
                  icon: Phone,
                  title: 'Central Europa - Barcelona',
                  value: '+34 (93) 172 7699',
                  href: 'tel:+34931727699',
                },
                {
                  icon: Mail,
                  title: 'Correo electrónico',
                  value: 'informes@euroamericanassistance.com',
                  href: 'mailto:informes@euroamericanassistance.com',
                },
              ].map((contact) => (
                <a
                  key={contact.title}
                  href={contact.href}
                  target={contact.href.startsWith('https') ? '_blank' : undefined}
                  rel={contact.href.startsWith('https') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 border group ${
                    contact.highlight
                      ? 'bg-orange/10 border-orange/30 hover:bg-orange/15'
                      : 'bg-white border-cream hover:border-orange/30 hover:shadow-card'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    contact.highlight ? 'bg-orange text-white' : 'bg-cream text-dark-green'
                  }`}>
                    <contact.icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-mid uppercase tracking-wide">{contact.title}</div>
                    <div className={`font-semibold text-sm mt-0.5 group-hover:text-orange transition-colors ${
                      contact.highlight ? 'text-orange' : 'text-dark-green'
                    }`}>
                      {contact.value}
                    </div>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-gray-mid group-hover:text-orange group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>

            {/* Emergency box */}
            <div className="bg-dark-green rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={18} className="text-orange" />
                <span className="font-semibold text-sm">WhatsApp de emergencias</span>
              </div>
              <p className="text-cream/60 text-sm mb-3">
                Si te encuentras en el exterior y necesitas asistencia:
              </p>
              <div className="space-y-1">
                <p className="text-white font-medium">+591 78442941</p>
                <p className="text-white font-medium">+591 68138915</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-card p-8 border border-cream">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-dark-green mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  ¡Mensaje enviado!
                </h3>
                <p className="text-gray-mid mb-6">Te contactaremos en menos de 24 horas.</p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-3 rounded-xl bg-dark-green text-white font-semibold hover:bg-dark-green/90 transition-all"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-2xl font-bold text-dark-green mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Envíanos un mensaje
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      placeholder="Tu nombre"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                      Correo *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                    Teléfono
                  </label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    autoComplete="tel"
                    className="form-input"
                    placeholder="Tu número de teléfono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                    Asunto
                  </label>
                  <select
                    value={form.asunto}
                    onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="cotizacion">Solicitar cotización</option>
                    <option value="asistencia">Solicitar asistencia</option>
                    <option value="informacion">Información sobre productos</option>
                    <option value="reclamo">Reclamos</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-1.5">
                    Mensaje *
                  </label>
                  <textarea
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    rows={5}
                    className="form-input resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2">⚠️ {error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-dark-green hover:bg-dark-green/90 text-white font-bold transition-all duration-200 disabled:opacity-60 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Enviar mensaje
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
