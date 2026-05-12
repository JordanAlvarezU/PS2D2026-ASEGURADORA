'use client'

import { useState } from 'react'
import { Search, CreditCard, User, ArrowRight } from 'lucide-react'

export default function CardSearchSection() {
  const [tarjeta, setTarjeta] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tarjeta || !apellidos) {
      setMessage('Por favor ingresa el número de tarjeta y apellidos.')
      return
    }
    setLoading(true)
    setMessage('')
    // TODO: Conectar con Firebase para buscar tarjeta
    setTimeout(() => {
      setLoading(false)
      setMessage('Sistema de búsqueda próximamente disponible. Contáctanos por WhatsApp.')
    }, 1500)
  }

  return (
    <section className="py-24 bg-dark-green relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-orange/8" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange/15 border border-orange/30 rounded-full px-4 py-1.5 text-orange text-sm font-medium mb-6">
            <CreditCard size={14} />
            Busca tu tarjeta de asistencia
          </div>
          <h2 
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            ¿Ya realizaste el{' '}
            <span className="text-gradient">pago</span>?
          </h2>
          <p className="text-cream/60 text-lg mb-10">
            Busca tu tarjeta de asistencia ingresando los datos de tu compra.
          </p>

          <form onSubmit={handleSearch} className="bg-white/8 backdrop-blur border border-white/15 rounded-3xl p-8 text-left space-y-5">
            <div>
              <label className="block text-cream/70 text-xs font-semibold uppercase tracking-wide mb-2">
                <CreditCard size={11} className="inline mr-1 text-orange" />
                Número de tarjeta de asistencia
              </label>
              <input
                type="text"
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
                placeholder="Ej: EUA 845938"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-cream/30 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-cream/70 text-xs font-semibold uppercase tracking-wide mb-2">
                <User size={11} className="inline mr-1 text-orange" />
                Apellidos del titular
              </label>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Ingresa tus apellidos"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-cream/30 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20 transition-all"
              />
            </div>

            {message && (
              <p className="text-orange text-sm bg-orange/10 border border-orange/20 rounded-xl px-4 py-2">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-orange hover:bg-orange-hover text-white font-bold transition-all duration-200 shadow-orange hover:shadow-orange-lg disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={18} />
                  Buscar mi tarjeta
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
