'use client'

import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    name: 'Marcela López',
    code: 'EUA 845938',
    country: '🇨🇦 Canadá',
    text: 'El proceso fue expedito y recibí pronta respuesta. La atención en la clínica fue buena y la ubicación muy conveniente. Seguí la recomendación de la doctora y en los días posteriores me sentí mucho mejor.',
    rating: 5,
  },
  {
    name: 'Helbert Cruces',
    code: 'EUA 913314',
    country: '🇫🇷 Francia',
    text: 'Me encuentro mucho mejor con la medicación indicada. La atención tanto en la Clínica Creu Blanca como en los canales de Euroamerican han sido de primer nivel, no he dudado en recomendarlos.',
    rating: 5,
  },
  {
    name: 'Paulo Pelegrini',
    code: 'EUA 921763',
    country: '🇹🇭 Tailandia',
    text: 'La atención ha sido muy buena, tanto desde la gente coordinando el encuentro como el centro médico. Fue rápido, breve y sencillo. Muchas gracias por todo.',
    rating: 5,
  },
  {
    name: 'Aldo Dector',
    code: 'EUA 919471',
    country: '🇪🇸 España',
    text: 'Muy buen servicio. Excelentes gestores de atención: amables, puntuales y eficientes. Médico muy amable y bien preparado. Lo recomendaría completamente.',
    rating: 5,
  },
  {
    name: 'Vilma Palomino',
    code: 'EUA 838900',
    country: '🇵🇹 Portugal',
    text: 'Doy destaque a la rapidez en las respuestas. La atención médica fue buena. Muy agradecida por el servicio y el apoyo recibido durante todo el proceso.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange/5 blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cream rounded-full px-4 py-1.5 text-dark-green text-sm font-medium mb-4">
            <Quote size={14} className="text-orange" />
            Lo que dicen nuestros viajeros
          </div>
          <h2 
            className="text-4xl lg:text-5xl font-bold text-dark-green mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Testimonios{' '}
            <span className="text-gradient">reales</span>
          </h2>
          <p className="text-gray-mid text-lg max-w-xl mx-auto">
            Miles de viajeros ya confían en nosotros. Esto es lo que dicen de su experiencia.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={t.code}
              className={cn(
                'p-6 rounded-2xl bg-white border border-cream hover:border-orange/30 hover:shadow-card-hover transition-all duration-300 shadow-card',
                index === 2 ? 'md:col-span-2 lg:col-span-1' : '',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
              style={{ transitionDelay: `${index * 100}ms`, transition: 'all 0.6s ease' }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-orange fill-orange" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-dark-green/70 text-sm leading-relaxed mb-5 italic">
                "{t.text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center justify-between pt-4 border-t border-cream">
                <div>
                  <div className="font-semibold text-dark-green text-sm">{t.name}</div>
                  <div className="text-gray-mid text-xs">{t.code}</div>
                </div>
                <div className="text-sm">{t.country}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
