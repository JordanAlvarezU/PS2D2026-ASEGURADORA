// Firebase configuration - conexión pendiente
// Reemplaza estos valores con los de tu proyecto Firebase

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "TU_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "TU_PROJECT.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "TU_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "TU_PROJECT.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "TU_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "TU_APP_ID",
}

// Estructura de Firestore (referencia):
// 
// Colecciones:
// ├── destinos/        → { id, nombre, zona_tarifa }
// ├── origen/          → { id, nombre }
// ├── productos/       → { id, nombre, activo, limite_edad, region_cobertura, beneficios[] }
// ├── leads/           → { id, contacto{}, datos_viaje{}, creado_en }
// └── usuarios_admin/  → { id, email, activo }

// TODO: Descomentar cuando se conecte Firebase
// import { initializeApp, getApps } from 'firebase/app'
// import { getFirestore } from 'firebase/firestore'
// import { getAuth } from 'firebase/auth'
//
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
// export const db = getFirestore(app)
// export const auth = getAuth(app)

// Datos estáticos de muestra (basados en tu Firestore)
export const staticData = {
  destinos: [
    { id: '1', nombre: 'Africa', zona_tarifa: 'mundial' },
    { id: '2', nombre: 'Argentina', zona_tarifa: 'sudamerica' },
    { id: '3', nombre: 'Asia', zona_tarifa: 'mundial' },
    { id: '4', nombre: 'Caribe', zona_tarifa: 'caribe' },
    { id: '5', nombre: 'Chile', zona_tarifa: 'sudamerica' },
    { id: '6', nombre: 'Costa Rica', zona_tarifa: 'centroamerica' },
    { id: 'EakG4HpaBeP02lCihr7k', nombre: 'Holanda', zona_tarifa: 'europa' },
    { id: '7', nombre: 'Europa', zona_tarifa: 'europa' },
    { id: '8', nombre: 'Mundial', zona_tarifa: 'mundial' },
    { id: '9', nombre: 'Norte América', zona_tarifa: 'norteamerica' },
    { id: '10', nombre: 'Oceanía', zona_tarifa: 'mundial' },
    { id: '11', nombre: 'Sudamerica', zona_tarifa: 'sudamerica' },
    { id: '12', nombre: 'Suiza', zona_tarifa: 'europa' },
  ],
  origen: [
    { id: '1', nombre: 'Argentina' },
    { id: '2', nombre: 'Bolivia' },
    { id: '3', nombre: 'Brasil' },
    { id: '4', nombre: 'Chile' },
    { id: '5', nombre: 'Colombia' },
    { id: '6', nombre: 'Costa Rica' },
    { id: '7', nombre: 'Ecuador' },
    { id: '8', nombre: 'El Salvador' },
    { id: '9', nombre: 'Guatemala' },
    { id: '10', nombre: 'Honduras' },
    { id: '11', nombre: 'Mexico' },
    { id: '12', nombre: 'Panama' },
    { id: '13', nombre: 'Paraguay' },
    { id: '14', nombre: 'Peru' },
    { id: '15', nombre: 'Republica Dominicana' },
    { id: '16', nombre: 'Uruguay' },
    { id: '17', nombre: 'Venezuela' },
  ],
  productos: [
    {
      id: 'mE8ibcu57cKJumbevrIr',
      nombre: 'Invicta',
      activo: true,
      limite_edad: 74,
      region_cobertura: 'Europa / Mundial',
      precio_base: 45,
      color: '#FF8811',
      icon: '🛡️',
      beneficios: [
        'Asistencia médica por accidentes € 41.000 ó USD 50.000',
        'Asistencia médica por enfermedad € 41.000 ó USD 50.000',
        'Asistencia médica exclusivamente por COVID-19 € 41.000 ó USD 50.000',
        'Asistencia odontológica de urgencia USD 500',
        'Traslado sanitario y repatriación',
        'Regreso anticipado por fallecimiento de familiar',
      ],
    },
    {
      id: '2',
      nombre: 'Classic',
      activo: true,
      limite_edad: 65,
      region_cobertura: 'Sudamérica',
      precio_base: 25,
      color: '#989C94',
      icon: '✈️',
      beneficios: [
        'Asistencia médica por accidentes USD 20.000',
        'Asistencia médica por enfermedad USD 20.000',
        'Asistencia odontológica de urgencia USD 200',
        'Extensión de estadía por enfermedad',
        'Regreso anticipado por fallecimiento de familiar',
      ],
    },
    {
      id: '3',
      nombre: 'Gold',
      activo: true,
      limite_edad: 70,
      region_cobertura: 'Sudamérica / Caribe',
      precio_base: 35,
      color: '#BDC2BF',
      icon: '⭐',
      beneficios: [
        'Asistencia médica por accidentes USD 30.000',
        'Asistencia médica por enfermedad USD 30.000',
        'Asistencia por COVID-19 USD 30.000',
        'Asistencia odontológica de urgencia USD 350',
        'Traslado sanitario',
        'Exceso de equipaje',
      ],
    },
    {
      id: '4',
      nombre: 'Platinum',
      activo: true,
      limite_edad: 80,
      region_cobertura: 'Mundial',
      precio_base: 65,
      color: '#25291C',
      icon: '💎',
      beneficios: [
        'Asistencia médica por accidentes USD 100.000',
        'Asistencia médica por enfermedad USD 100.000',
        'Asistencia por COVID-19 USD 100.000',
        'Asistencia odontológica de urgencia USD 1.000',
        'Traslado sanitario y repatriación de restos',
        'Cancelación de viaje',
        'Asistencia legal',
        'Médico online 24/7',
      ],
    },
    {
      id: '5',
      nombre: 'Priority',
      activo: true,
      limite_edad: 85,
      region_cobertura: 'Mundial',
      precio_base: 90,
      color: '#FF8811',
      icon: '🌟',
      beneficios: [
        'Asistencia médica ilimitada',
        'COVID-19 ilimitado',
        'Asistencia dental USD 2.000',
        'Traslado sanitario premium',
        'Cancelación de viaje',
        'Pérdida de equipaje',
        'Asistencia legal internacional',
        'Médico online prioritario 24/7',
        'Concierge de viaje',
      ],
    },
  ],
}
