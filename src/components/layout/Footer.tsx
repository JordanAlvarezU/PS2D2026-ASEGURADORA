import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'

const footerLinks = [
  { href: '/condiciones', label: 'Condiciones Generales' },
  { href: '/como-funciona', label: 'Cómo Funcionamos' },
  { href: '/faq', label: 'Preguntas Frecuentes' },
  { href: '/importante', label: 'Importante' },
  { href: '/productos#porque', label: 'Por qué Elegirnos' },
]

export default function Footer() {
  return (
    <footer className="bg-dark-green text-cream">
      {/* Emergency banner */}
      <div className="border-t border-white/10 bg-dark-green/80">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Siempre atentos en caso de emergencia
            </h3>
            <p className="text-cream/60 text-sm">Nuestras centrales a nivel mundial · 24 horas · 365 días al año</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Phone size={20} className="text-orange" />
              <span className="text-xs text-cream/60 uppercase tracking-wide">Bolivia - La Paz</span>
              <span className="text-white font-semibold text-sm">+591 (7) 8442941</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Phone size={20} className="text-orange" />
              <span className="text-xs text-cream/60 uppercase tracking-wide">USA - Florida</span>
              <span className="text-white font-semibold text-sm">+1 (954) 678 6680</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Phone size={20} className="text-orange" />
              <span className="text-xs text-cream/60 uppercase tracking-wide">Europa - Barcelona</span>
              <span className="text-white font-semibold text-sm">+34 (93) 172 7699</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-orange/15 border border-orange/30">
              <MessageCircle size={20} className="text-orange" />
              <span className="text-xs text-cream/60 uppercase tracking-wide">WhatsApp Asistencias</span>
              <span className="text-white font-semibold text-sm">+591 (6) 8138915</span>
            </div>
          </div>
          <p className="text-center text-cream/40 text-xs mt-4">
            Solo sustituye los (++) por el código de salida internacional del país donde te encuentres
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Euro American</div>
                <div className="text-orange text-xs tracking-widest uppercase">Assistance</div>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed max-w-sm mb-6">
              Más de 18 años brindando asistencia directa y asumiendo los gastos hasta los límites establecidos. Nuestra misión: resolver los problemas más críticos que puedan ocurrir en un viaje.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-white/8 hover:bg-orange flex items-center justify-center transition-all duration-200 hover:scale-110">
                <Facebook size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-white/8 hover:bg-orange flex items-center justify-center transition-all duration-200 hover:scale-110">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-xl bg-white/8 hover:bg-orange flex items-center justify-center transition-all duration-200 hover:scale-110">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Información</h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/60 hover:text-orange text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange/40 group-hover:bg-orange transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={15} className="text-orange mt-0.5 shrink-0" />
                <div>
                  <p className="text-cream/40 text-xs uppercase tracking-wide mb-0.5">Central Regional</p>
                  <a
                    href="https://wa.link/g2f8eh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium text-sm hover:text-orange transition-colors"
                  >
                    +591 78442941
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={15} className="text-orange mt-0.5 shrink-0" />
                <a
                  href="mailto:informes@euroamericanassistance.com"
                  className="text-cream/70 hover:text-orange text-sm transition-colors break-all"
                >
                  informes@euroamerican<br />assistance.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-cream/40 text-xs">
            © {new Date().getFullYear()} Euro American Assistance · Todos los derechos reservados
          </p>
          <p className="text-cream/30 text-xs">
            Desarrollado con ❤️ para proteger tus viajes
          </p>
        </div>
      </div>
    </footer>
  )
}
