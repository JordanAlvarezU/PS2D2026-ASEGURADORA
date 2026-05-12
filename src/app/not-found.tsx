'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Rutas válidas de la aplicación
const VALID_ROUTES = [
  '/',
  '/productos',
  '/cotizar',
  '/asistencia',
  '/contacto',
  '/login',
]

/**
 * Dado un pathname inválido, encuentra la ruta válida más cercana.
 * Estrategia: compara el pathname con cada ruta válida y devuelve
 * la que tenga el prefijo más largo en común.
 * Ej: "/productosss" → "/productos"
 *     "/contactoss"  → "/contacto"
 *     "/xyzrandom"   → "/"
 */
function findClosestRoute(pathname: string): string {
  const lower = pathname.toLowerCase()

  let bestMatch = '/'
  let bestScore = 0

  for (const route of VALID_ROUTES) {
    if (route === '/') continue
    // Cuántos caracteres del inicio coinciden
    let score = 0
    for (let i = 0; i < Math.min(route.length, lower.length); i++) {
      if (route[i] === lower[i]) score++
      else break
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = route
    }
  }

  // Solo redirige a la ruta encontrada si comparten al menos 3 caracteres
  // (evita redirigir "/zzz" a "/productos" por coincidencia de "/")
  return bestScore >= 3 ? bestMatch : '/'
}

export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const target = findClosestRoute(pathname)
    // Reemplaza la URL incorrecta en el historial en vez de agregar una nueva entrada
    router.replace(target)
  }, [pathname, router])

  // Pantalla de transición mientras redirige (se ve muy brevemente)
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-orange/30 border-t-orange rounded-full animate-spin"
          style={{ borderTopColor: '#FF8811' }} />
        <p className="text-sm text-gray-500 font-medium">Redirigiendo...</p>
      </div>
    </div>
  )
}
