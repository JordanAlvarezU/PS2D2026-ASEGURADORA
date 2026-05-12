import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBpL253A7tlivXr_Hhg_7VYNmgmMLBWs3E",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bd-web-eua-bo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bd-web-eua-bo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bd-web-eua-bo.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "848711100328",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:848711100328:web:d729c8b7fdbb376cb89f9d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5PGKWMEVGL",
}

// Inicializar Firebase solo una vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const db = getFirestore(app)
export const auth = getAuth(app)

// ── Tipos de datos ────────────────────────────────────────────────────────────

export interface Destino {
  id: string
  nombre: string
  zona_tarifa: string
}

export interface Origen {
  id: string
  nombre: string
}

export interface Producto {
  id: string
  nombre: string
  activo: boolean
  limite_edad: number
  region_cobertura: string
  beneficios: string[]
  precio_base?: number
  color?: string
  icon?: string
}

export interface Lead {
  id: string
  contacto: {
    nombres: string
    apellidos: string
    email: string
    telefono: string
  }
  creado_en: string
  datos_viaje: {
    cantidad_pasajeros: number
    destino: string
    origen: string
    fecha_inicio: string
    fecha_fin: string
    edades_pasajeros: (number | string)[]
  }
}

export interface UsuarioAdmin {
  id: string
  email: string
  activo: boolean
}

// ── Datos estáticos de respaldo ───────────────────────────────────────────────
