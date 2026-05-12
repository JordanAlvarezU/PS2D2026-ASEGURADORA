'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, Globe, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Productos' },
  { href: '/asistencia', label: 'Asistencia' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('/')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setActiveLink(window.location.pathname)
  }, [])

  return (
    <>
      {/* Top bar */}
      <div className="bg-dark-green text-cream/70 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Globe size={12} className="text-orange" />
              Síguenos:
            </span>
            <a href="#" className="hover:text-orange transition-colors">Facebook</a>
            <a href="#" className="hover:text-orange transition-colors">Instagram</a>
            <a href="#" className="hover:text-orange transition-colors">YouTube</a>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-cream/50">Emisión Agencias de Viaje:</span>
            <a href="#" className="hover:text-orange transition-colors">Sistema Nuevo</a>
            <span className="text-cream/30">|</span>
            <a href="#" className="hover:text-orange transition-colors">Sistema Tradicional</a>
            <a
              href="https://wa.link/g2f8eh"
              className="flex items-center gap-1.5 text-orange font-medium hover:text-orange-hover transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone size={12} />
              Ventas: +591 78442941
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-dark-green/95 backdrop-blur-md shadow-lg shadow-dark-green/20'
            : 'bg-dark-green'
        )}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center shadow-orange group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg leading-none">E</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-lg leading-tight tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Euro American
                </div>
                <div className="text-orange text-xs font-medium tracking-widest uppercase">
                  Assistance
                </div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    activeLink === link.href
                      ? 'bg-orange text-white shadow-orange'
                      : 'text-cream/80 hover:text-white hover:bg-white/8'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cream/20 text-cream/80 hover:text-white hover:border-cream/40 text-sm font-medium transition-all duration-200"
              >
                <LogIn size={16} />
                Ingresar
              </Link>
              <Link
                href="/cotizar"
                className="px-5 py-2.5 rounded-xl bg-orange hover:bg-orange-hover text-white text-sm font-semibold transition-all duration-200 shadow-orange hover:shadow-orange-lg hover:scale-105"
              >
                Cotizar ahora
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-cream hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isOpen ? 'max-h-96 border-t border-white/10' : 'max-h-0'
          )}
        >
          <div className="px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  activeLink === link.href
                    ? 'bg-orange text-white'
                    : 'text-cream/80 hover:text-white hover:bg-white/8'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-2 pt-4 border-t border-white/10">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-cream/20 text-cream/80 text-sm font-medium"
              >
                <LogIn size={16} />
                Ingresar
              </Link>
              <Link
                href="/cotizar"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-orange text-white text-sm font-semibold text-center"
              >
                Cotizar ahora
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
