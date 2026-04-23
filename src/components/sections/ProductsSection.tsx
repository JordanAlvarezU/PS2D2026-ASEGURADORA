'use client'

import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Check, ArrowRight, Star } from 'lucide-react'
import { staticData } from '@/lib/firebase'
import { cn } from '@/lib/utils'

export default function ProductsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const featured = staticData.productos.slice(0, 3)

  return (
    <section ref={ref} className="py-24 bg-gradient-cream relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-orange/8 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange/10 border border-orange/20 rounded-full px-4 py-1.5 text-orange text-sm font-medium mb-4">
            <Star size={14} />
            Planes disponibles
          </div>
          <h2 
            className="text-4xl lg:text-5xl font-bold text-dark-green mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Nuestros{' '}
            <span className="text-gradient">Productos</span>
          </h2>
          <p className="text-gray-mid text-lg max-w-xl mx-auto">
            Planes diseñados para cada tipo de viajero. Encuentra la cobertura perfecta para tu próxima aventura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featured.map((product, index) => {
            const isPremium = product.nombre === 'Invicta'
            return (
              <div
                key={product.id}
                className={cn(
                  'relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2',
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                  isPremium
                    ? 'bg-dark-green text-white shadow-2xl ring-2 ring-orange/30'
                    : 'bg-white text-dark-green shadow-card hover:shadow-card-hover border border-cream'
                )}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {isPremium && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-orange" />
                )}
                {isPremium && (
                  <div className="absolute top-4 right-4 bg-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}

                <div className="p-7">
                  <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4',
                    isPremium ? 'bg-orange/20' : 'bg-cream'
                  )}>
                    {product.icon}
                  </div>
                  <h3 className={cn(
                    'text-2xl font-bold mb-1',
                    isPremium ? 'text-white' : 'text-dark-green'
                  )} style={{ fontFamily: 'Playfair Display, serif' }}>
                    {product.nombre}
                  </h3>
                  <p className={cn('text-sm mb-4', isPremium ? 'text-cream/60' : 'text-gray-mid')}>
                    {product.region_cobertura} · Hasta {product.limite_edad} años
                  </p>

                  <div className={cn(
                    'text-4xl font-bold mb-1',
                    isPremium ? 'text-orange' : 'text-dark-green'
                  )}>
                    ${product.precio_base}
                    <span className={cn('text-sm font-normal ml-1', isPremium ? 'text-cream/60' : 'text-gray-mid')}>
                      /persona
                    </span>
                  </div>
                  <p className={cn('text-xs mb-6', isPremium ? 'text-cream/50' : 'text-gray-mid')}>
                    Precio base por día
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {product.beneficios.slice(0, 3).map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check size={15} className={cn('mt-0.5 shrink-0', isPremium ? 'text-orange' : 'text-dark-green')} />
                        <span className={cn('text-xs leading-relaxed', isPremium ? 'text-cream/70' : 'text-gray-mid')}>
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/cotizar?producto=${product.id}`}
                    className={cn(
                      'flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 group',
                      isPremium
                        ? 'bg-orange hover:bg-orange-hover text-white shadow-orange hover:shadow-orange-lg'
                        : 'bg-dark-green hover:bg-dark-green/90 text-white'
                    )}
                  >
                    Cotizar este plan
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-dark-green text-dark-green font-semibold hover:bg-dark-green hover:text-white transition-all duration-200 group"
          >
            Ver todos los planes
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
