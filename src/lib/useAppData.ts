import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db, Producto, Destino, Origen } from './firebase'

// Caché en memoria para evitar múltiples llamadas a la base de datos durante la misma sesión
let cachedData: {
  productos: Producto[]
  destinos: Destino[]
  origen: Origen[]
} | null = null

export function useAppData() {
  const [data, setData] = useState<{
    productos: Producto[]
    destinos: Destino[]
    origen: Origen[]
  } | null>(cachedData)
  
  const [loading, setLoading] = useState(!cachedData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cachedData) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Ejecutamos las 3 consultas de forma paralela para mayor velocidad
        const [productosSnap, destinosSnap, origenSnap] = await Promise.all([
          getDocs(collection(db, 'productos')),
          getDocs(collection(db, 'destinos')),
          getDocs(collection(db, 'origen'))
        ])

        const productos = productosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Producto))
        const destinos = destinosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destino))
        const origen = origenSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Origen))

        // Ordenar alfabéticamente
        destinos.sort((a, b) => a.nombre.localeCompare(b.nombre))
        origen.sort((a, b) => a.nombre.localeCompare(b.nombre))
        // Los productos los podríamos ordenar por precio o nombre
        productos.sort((a, b) => (a.precio_base || 0) - (b.precio_base || 0))

        const result = { productos, destinos, origen }
        cachedData = result // Guardar en caché
        
        setData(result)
      } catch (err: any) {
        console.error('Error fetching app data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
