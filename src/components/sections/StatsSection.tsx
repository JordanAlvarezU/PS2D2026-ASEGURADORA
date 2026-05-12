'use client'

import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { cn } from '@/lib/utils'

const stats = [
  { value: 18, suffix: '+', label: 'Años de experiencia', description: 'En el mercado latinoamericano' },
  { value: 130, suffix: '', label: 'Países cubiertos', description: 'Red global de atención' },
  { value: 50000, suffix: '+', label: 'Viajeros protegidos', description: 'Que confían en nosotros' },
  { value: 24, suffix: '/7', label: 'Disponibilidad', description: 'Los 365 días del año' },
]

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="relative py-24 bg-dark-green overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-pattern opacity-30" />
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-orange/5 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cream/3 translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Quiénes{' '}
            <span className="text-gradient">somos</span>
          </h2>
          <p className="text-cream/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Una sólida institución posicionada como una de las empresas de asistencia más confiables y con mejor capacidad de respuesta en América Latina.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange/30 transition-all duration-300 hover:bg-white/8',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
              style={{ transitionDelay: `${index * 100}ms`, transition: 'all 0.6s ease' }}
            >
              <div className="text-4xl lg:text-5xl font-bold text-orange mb-1">
                {inView ? (
                  <CountUp
                    end={stat.value}
                    duration={2}
                    separator=","
                    suffix={stat.suffix}
                    delay={index * 0.15}
                  />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>
              <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
              <div className="text-cream/40 text-xs">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* About text */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={cn(
            'transition-all duration-700',
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          )}>
            <blockquote className="text-xl text-cream/80 leading-relaxed italic mb-6 border-l-4 border-orange pl-6">
              "Nuestra misión es resolver los problemas más críticos que puedan ocurrir en un viaje, brindándote la atención y servicios médicos, legales y personales más importantes."
            </blockquote>
            <p className="text-cream/60 leading-relaxed">
              El equipo internacional de Euro American Assistance brinda asistencia directa y asume los gastos hasta los límites establecidos en cada producto. Contamos con una amplia red de médicos, hospitales y centros de atención médica especializada, así como ambulancias aéreas y terrestres, y abogados alrededor del mundo.
            </p>
          </div>
          
          <div className={cn(
            'grid grid-cols-2 gap-4 transition-all duration-700',
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          )}>
            {[
              { icon: '🏥', title: 'Red médica global', desc: 'Hospitales y clínicas en todo el mundo' },
              { icon: '✈️', title: 'Ambulancia aérea', desc: 'Traslados médicos de emergencia' },
              { icon: '⚖️', title: 'Red legal', desc: 'Abogados en más de 130 países' },
              { icon: '💬', title: 'Atención directa', desc: 'Sin intermediarios, sin demoras' },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange/30 transition-all duration-200">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-cream/50 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
