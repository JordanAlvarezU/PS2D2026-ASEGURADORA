'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/login')
        setLoading(false)
        return
      }

      // Verificar si está en usuarios_admin y está activo
      try {
        const ref = doc(db, 'usuarios_admin', firebaseUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists() && snap.data()?.activo === true) {
          setUser(firebaseUser)
          setAuthorized(true)
        } else {
          router.replace('/login')
        }
      } catch {
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [router])

  return { user, loading, authorized }
}
