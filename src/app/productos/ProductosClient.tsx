'use client'

import { useAppData } from '@/lib/useAppData'
import { Check, ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ProductosClient() {
  const { data, loading } = useAppData()

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
      </div>
    )
  }

  const productosActivos = data?.productos.filter(p => p.activo) || []

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {productosActivos.map((product, index) => {
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
  )
}
