import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Phone, Clock, Globe, Heart, Shield, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Asistencia | Euro American Assistance',
  description: 'Cómo solicitar asistencia durante tu viaje. Líneas de emergencia 24/7 en todo el mundo.',
}

const steps = [
  {
    number: '01',
    title: 'Comunícate inmediatamente',
    description: 'Llama a nuestra central de emergencias más cercana. Tenemos líneas en USA y Europa disponibles las 24 horas.',
    icon: Phone,
  },
  {
    number: '02',
    title: 'Proporciona tu información',
    description: 'Ten a mano tu número de tarjeta EUA y tus datos personales. Nuestros operadores te guiarán paso a paso.',
    icon: Shield,
  },
  {
    number: '03',
    title: 'Recibe la asistencia',
    description: 'Coordinamos directamente con médicos, hospitales o proveedores según tu necesidad. Sin papeleo inicial.',
    icon: Heart,
  },
  {
    number: '04',
    title: 'Seguimiento continuo',
    description: 'Nuestro equipo hace seguimiento de tu caso hasta su resolución completa. No estás solo.',
    icon: Clock,
  },
]

const emergencyNumbers = [
  { region: 'Bolivia - La Paz', number: '+591 78442941', icon: 'bo' },
  { region: 'USA - Florida', number: '+1 (954) 678 6680', icon: '🇺🇸' },
  { region: 'Europa - Barcelona', number: '+34 (93) 172 7699', icon: '🇪🇸' },
  { region: 'WhatsApp Asistencia 1', number: '+591 78442941', icon: '📱' },
  { region: 'WhatsApp Asistencia 2', number: '+591 68138915', icon: '📱' },
]

export default function AsistenciaPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-dark-green py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-orange/15 border border-orange/30 rounded-full px-4 py-1.5 text-orange text-sm font-medium mb-6">
            <AlertCircle size={14} />
            Siempre disponibles
          </div>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            ¿Necesitas{' '}
            <span className="text-gradient">asistencia</span>?
          </h1>
          <p className="text-cream/60 text-xl max-w-2xl mx-auto mb-8">
            Nuestras centrales están activas 24 horas, 365 días al año. En cualquier emergencia, estamos a una llamada de distancia.
          </p>
          <a
            href="https://wa.link/g2f8eh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange hover:bg-orange-hover text-white font-bold text-lg transition-all duration-200 shadow-orange hover:shadow-orange-lg hover:scale-105 group"
          >
            <Phone size={20} />
            Contactar ahora
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Emergency numbers */}
      <section className="py-16 bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-dark-green text-center mb-10" style={{ fontFamily: 'Playfair Display, serif' }}>
            Líneas de emergencia
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyNumbers.map((em) => (
              <a
                key={em.region}
                href={`tel:${em.number.replace(/\s|\(|\)/g, '')}`}
                className="flex flex-col items-center p-6 rounded-2xl bg-cream/50 border border-cream hover:border-orange/40 hover:shadow-card transition-all duration-200 text-center group"
              >
                <div className="text-3xl mb-3">{em.icon}</div>
                <div className="text-xs text-gray-mid uppercase tracking-wide mb-1">{em.region}</div>
                <div className="font-bold text-dark-green group-hover:text-orange transition-colors">{em.number}</div>
              </a>
            ))}
          </div>
          <p className="text-center text-gray-mid text-xs mt-6">
            Reemplaza los signos (++) por el código de salida internacional del país donde te encuentres
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-green mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cómo solicitar{' '}
              <span className="text-gradient">asistencia</span>
            </h2>
            <p className="text-gray-mid text-lg max-w-xl mx-auto">
              Proceso simple y directo para que recibas ayuda cuando más lo necesitas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%-12px)] w-6 border-t-2 border-dashed border-orange/30 z-0" />
                  )}
                  <div className="relative z-10 bg-white rounded-2xl p-6 border border-cream shadow-card hover:shadow-card-hover hover:border-orange/30 transition-all duration-300">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-orange" />
                      </div>
                      <div className="text-4xl font-bold text-cream leading-none mt-1">{step.number}</div>
                    </div>
                    <h3 className="font-bold text-dark-green mb-2">{step.title}</h3>
                    <p className="text-gray-mid text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Important info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-orange/8 border border-orange/20 rounded-3xl p-8 max-w-3xl mx-auto text-center">
            <Globe size={40} className="text-orange mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark-green mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cobertura en todo el mundo
            </h3>
            <p className="text-gray-mid leading-relaxed mb-6">
              Nuestra empresa reemplaza, con creces, la red personal de profesionales, amigos e instituciones que cada persona tiene en su propio medio. Contamos con médicos, hospitales, clínicas, ambulancias aéreas y terrestres, y abogados en más de 130 países.
            </p>
            <Link
              href="/cotizar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-green text-white font-semibold hover:bg-dark-green/90 transition-all group"
            >
              Cotizar mi asistencia
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
