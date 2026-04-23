import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { staticData } from '@/lib/firebase'
import { Check, ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Productos | Euro American Assistance',
  description: 'Descubre nuestros planes de asistencia al viajero. Cobertura médica, legal y personal en más de 130 países.',
}

export default function ProductosPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero */}
      <section className="bg-dark-green py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-orange/15 border border-orange/30 rounded-full px-4 py-1.5 text-orange text-sm font-medium mb-6">
            <Shield size={14} />
            Planes de asistencia
          </div>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Nuestros{' '}
            <span className="text-gradient">Productos</span>
          </h1>
          <p className="text-cream/60 text-xl max-w-2xl mx-auto">
            Protección premium diseñada para cada tipo de viajero. Elige la cobertura perfecta para tu próxima aventura.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-gradient-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staticData.productos.map((product, index) => {
              const isPremium = product.nombre === 'Invicta' || product.nombre === 'Priority'
              return (
                <div
                  key={product.id}
                  className={cn(
                    'rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2',
                    isPremium
                      ? 'bg-dark-green text-white shadow-2xl ring-1 ring-orange/20'
                      : 'bg-white text-dark-green shadow-card hover:shadow-card-hover border border-cream'
                  )}
                >
                  {isPremium && <div className="h-1.5 bg-gradient-orange" />}
                  <div className="p-8">
                    <div className={cn('text-4xl mb-4', isPremium ? '' : '')}>{product.icon}</div>
                    <h2
                      className={cn('text-3xl font-bold mb-1', isPremium ? 'text-white' : 'text-dark-green')}
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {product.nombre}
                    </h2>
                    <p className={cn('text-sm mb-2', isPremium ? 'text-cream/60' : 'text-gray-mid')}>
                      {product.region_cobertura}
                    </p>
                    <div className={cn(
                      'inline-block text-xs px-3 py-1 rounded-full mb-6',
                      isPremium ? 'bg-orange/20 text-orange' : 'bg-cream text-dark-green/60'
                    )}>
                      Hasta {product.limite_edad} años
                    </div>

                    <div className={cn('text-4xl font-bold mb-1', isPremium ? 'text-orange' : 'text-dark-green')}>
                      ${product.precio_base}
                      <span className={cn('text-sm font-normal', isPremium ? 'text-cream/50' : 'text-gray-mid')}>/día</span>
                    </div>
                    <p className={cn('text-xs mb-8', isPremium ? 'text-cream/40' : 'text-gray-mid')}>
                      Precio base por persona
                    </p>

                    <ul className="space-y-3 mb-8">
                      {product.beneficios.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5', isPremium ? 'bg-orange/20' : 'bg-cream')}>
                            <Check size={12} className={isPremium ? 'text-orange' : 'text-dark-green'} />
                          </div>
                          <span className={cn('text-sm leading-relaxed', isPremium ? 'text-cream/70' : 'text-gray-mid')}>
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/cotizar?producto=${product.id}`}
                      className={cn(
                        'flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold transition-all duration-200 group',
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-dark-green relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            ¿No sabes cuál elegir?
          </h2>
          <p className="text-cream/60 text-lg mb-8">
            Nuestro equipo te ayuda a encontrar el plan perfecto para tu viaje.
          </p>
          <a
            href="https://wa.link/g2f8eh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange hover:bg-orange-hover text-white font-bold text-lg transition-all duration-200 shadow-orange hover:shadow-orange-lg hover:scale-105 group"
          >
            Hablar con un asesor
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
