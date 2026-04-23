'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, ArrowRight, Shield } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Por favor completa todos los campos.')
      return
    }
    setLoading(true)
    // TODO: Conectar con Firebase Auth
    setTimeout(() => {
      setLoading(false)
      setError('Sistema de autenticación pendiente de configuración Firebase.')
    }, 1500)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel - Brand */}
      <div className="hidden lg:flex flex-col justify-between bg-dark-green p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/3" />
        
        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center shadow-orange">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <div className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Euro American</div>
            <div className="text-orange text-xs tracking-widest uppercase">Assistance</div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative text-center">
          <div className="w-24 h-24 rounded-3xl bg-orange/15 border border-orange/30 flex items-center justify-center mx-auto mb-8 animate-float">
            <Shield size={44} className="text-orange" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Portal de<br />
            <span className="text-gradient">Administración</span>
          </h1>
          <p className="text-cream/60 text-lg leading-relaxed max-w-sm mx-auto">
            Accede al sistema de gestión de asistencia al viajero. Administra leads, productos y configuración.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: '18+', label: 'Años' },
            { value: '130', label: 'Países' },
            { value: '24/7', label: 'Soporte' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl font-bold text-orange">{stat.value}</div>
              <div className="text-cream/50 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-orange flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <div>
              <div className="font-bold text-dark-green" style={{ fontFamily: 'Playfair Display, serif' }}>Euro American</div>
              <div className="text-orange text-xs tracking-widest uppercase">Assistance</div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-dark-green mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Iniciar sesión
          </h2>
          <p className="text-gray-mid text-sm mb-8">
            Accede con tu cuenta de administrador
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-mid" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@euroamerican.com"
                  className="form-input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-green/70 uppercase tracking-wide mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-mid" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-mid hover:text-dark-green transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-dark-green hover:bg-dark-green/90 text-white font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Ingresar al sistema
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-cream text-center">
            <p className="text-gray-mid text-xs mb-2">¿Eres cliente y buscas tu tarjeta?</p>
            <Link href="/#buscar-tarjeta" className="text-orange text-sm font-medium hover:underline">
              Buscar mi tarjeta de asistencia →
            </Link>
          </div>

          <Link href="/" className="mt-4 flex items-center justify-center gap-1 text-gray-mid text-xs hover:text-dark-green transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
