'use client'

import { useInView } from 'react-intersection-observer'
import { 
  Luggage, Phone, Stethoscope, Scale, Heart, Plane, 
  Globe, Clock, Shield, ChevronRight 
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const benefits = [
  {
    icon: Heart,
    title: 'Asistencia Médica',
    description: 'Cobertura completa ante enfermedades y accidentes. Hospitalizaciones, medicamentos y más.',
    color: 'bg-red-50 text-red-500',
  },
  {
    icon: Phone,
    title: 'Centrales de Emergencia',
    description: 'Líneas de emergencia disponibles 24/7 en todo el mundo. Siempre una voz al otro lado.',
    color: 'bg-blue-50 text-blue-500',
  },
  {
    icon: Stethoscope,
    title: 'Médico Online',
    description: 'Consulta con médicos certificados desde donde estés, sin esperas ni filas.',
    color: 'bg-teal-50 text-teal-500',
  },
  {
    icon: Scale,
    title: 'Asistencia Legal',
    description: 'Asesoría legal internacional cuando más la necesites. Abogados en todo el mundo.',
    color: 'bg-purple-50 text-purple-500',
  },
  {
    icon: Plane,
    title: 'Cancelación de Viaje',
    description: 'Protección ante cancelaciones imprevistas. Recupera tu inversión sin complicaciones.',
    color: 'bg-orange-50 text-orange',
  },
  {
    icon: Luggage,
    title: 'Exceso de Equipaje',
    description: 'Cobertura ante pérdida, robo o daño de tu equipaje durante el viaje.',
    color: 'bg-green-50 text-green-600',
  },
]

export default function BenefitsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cream/50 -translate-y-1/2 translate-x-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text + Image */}
          <div className={cn('transition-all duration-700', inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8')}>
            <div className="inline-flex items-center gap-2 bg-cream rounded-full px-4 py-1.5 text-dark-green text-sm font-medium mb-4">
              <Shield size={14} className="text-orange" />
              Todo incluido en tu plan
            </div>
            <h2 
              className="text-4xl lg:text-5xl font-bold text-dark-green leading-tight mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Somos mucho más que{' '}
              <span className="text-gradient">asistencia médica</span>
            </h2>
            <p className="text-gray-mid text-lg leading-relaxed mb-6">
              Adquiriendo tu tarjeta de asistencia, quedas protegido desde que inicia tu itinerario hasta que finalice, recibiendo los montos de asistencia más convenientes.
            </p>
            <p className="text-gray-mid leading-relaxed mb-8">
              Cuando y donde más lo necesites. Nuestro equipo internacional brinda asistencia directa y asume los gastos hasta los límites establecidos.
            </p>
            <Link
              href="/productos#beneficios"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-green text-cream font-semibold hover:bg-dark-green/90 transition-all duration-200 group"
            >
              Ver todos los beneficios
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Benefits grid */}
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className={cn(
                    'p-5 rounded-2xl bg-white border border-cream hover:border-orange/30 hover:shadow-card-hover transition-all duration-300 group cursor-default',
                    'shadow-card',
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  )}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', benefit.color)}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-dark-green text-sm mb-1 group-hover:text-orange transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-mid text-xs leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
