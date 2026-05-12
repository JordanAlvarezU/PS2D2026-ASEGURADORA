import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Shield, ArrowRight } from 'lucide-react'
import ProductosClient from './ProductosClient'

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
          <ProductosClient />
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
