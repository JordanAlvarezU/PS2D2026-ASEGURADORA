# Informe de Sprint 4: Migración a Firebase y Generación de Leads

Este documento es un informe detallado y educativo sobre todos los cambios realizados durante el Sprint 4. El objetivo principal fue eliminar los datos "hardcodeados" (escritos a fuego en el código), conectar la web a una base de datos real (Firestore), y crear el flujo de captura de clientes potenciales (Leads).

---

## 🎯 Desglose de Tareas del Sprint 4

| ID | Tarea | Prioridad | Tiempo Estimado | Estado |
| :--- | :--- | :---: | :---: | :---: |
| **TSK-401** | Configuración inicial y variables de entorno (`.env.local`) | Alta | 1h | ✅ Completado |
| **TSK-402** | Script de migración de datos estáticos a Firestore | Alta | 1h | ✅ Completado |
| **TSK-403** | Creación del Hook Global de carga de datos (`useAppData`) | Alta | 2h | ✅ Completado |
| **TSK-404** | Refactorización de Inicio y Catálogo (`HeroSection`, `ProductsSection`) | Media | 2h | ✅ Completado |
| **TSK-405** | Implementación de Leads y redirección a WhatsApp en Cotizador | Crítica | 3h | ✅ Completado |
| **TSK-406** | Mejora del Panel Admin (Campos Precio e Icono) | Media | 1.5h | ✅ Completado |
| **TSK-407** | Implementación de Reglas de Seguridad en Firestore (`firestore.rules`) | Crítica | 1h | ✅ Completado |

---

## 🧠 ¿Qué aprendimos y qué código modificamos?

A continuación se explican los cambios archivo por archivo para entender la lógica y sintaxis aplicada:

### 1. Eliminación de datos estáticos (`src/lib/firebase.ts`)
**¿Qué hicimos?**
- **Borramos** el objeto `staticData` que contenía todos los arrays de orígenes, destinos y productos.
- **Borramos** las claves (`apiKey`, etc.) escritas directamente en el código por razones de seguridad (evitar alertas en GitHub) y las reemplazamos por llamadas a variables de entorno: `process.env.NEXT_PUBLIC_FIREBASE_API_KEY`.

**Concepto aprendido:** *Variables de entorno*. Es la forma correcta de ocultar credenciales en producción.

### 2. El puente entre la BD y la Web (`src/lib/useAppData.ts`)
**¿Qué hicimos?**
- Creamos un **Custom Hook** (Gancho personalizado) de React llamado `useAppData`.
- Este archivo hace uso de `getDocs(collection(db, 'nombre_coleccion'))` para traer información de Firebase.

**Sintaxis Destacada:**
```typescript
// Promise.all permite hacer las 3 consultas AL MISMO TIEMPO, haciendo que la web cargue 3 veces más rápido.
const [productosSnap, destinosSnap, origenSnap] = await Promise.all([
  getDocs(collection(db, 'productos')),
  getDocs(collection(db, 'destinos')),
  getDocs(collection(db, 'origen'))
])
```
**Concepto aprendido:** *Caché en Memoria*. Creamos una variable global `let cachedData` fuera del hook. Si el usuario ya descargó los países en la página de inicio, cuando vaya a "Cotizar", React leerá la variable `cachedData` en vez de gastar lecturas cobrables en Firebase.

### 3. Vistas actualizadas (`HeroSection`, `ProductsSection`, `app/productos/...`)
**¿Qué hicimos?**
- Reemplazamos las menciones a `staticData.origen` por llamadas a nuestro nuevo hook:
  ```typescript
  const { data, loading } = useAppData()
  ```
- Agregamos lógica visual para el tiempo de espera. Por ejemplo, en los *selects* pusimos: `<option>{loading ? 'Cargando...' : 'Seleccione...'}</option>`.
- En `ProductosClient.tsx` agregamos un filtro para mostrar SOLO los productos activos: `data?.productos.filter(p => p.activo)`.

### 4. Guardado de Leads (`src/app/cotizar/page.tsx`)
**¿Qué hicimos?**
- Interceptamos el clic del botón de WhatsApp con la función `handleWhatsAppClick`.
- Usamos la función `addDoc` de Firebase para crear un documento nuevo en la colección `leads`.

**Sintaxis Destacada:**
```typescript
// Armamos el objeto con toda la información que el Bot de WhatsApp necesitará leer
const leadData = {
  contacto: { email: email, telefono: telefono },
  creado_en: new Date().toISOString(), // Fecha actual
  datos_viaje: { destino, origen, pasajeros: edades.length },
  plan_seleccionado: planElegido.nombre,
  precio_cotizado: 150.00
}
// Lo guardamos en Firestore
await addDoc(collection(db, 'leads'), leadData)
```
- Además, usamos `encodeURIComponent(mensaje)` para asegurar que el texto que se envía por la URL de WhatsApp soporte espacios y caracteres especiales (como tildes).

### 5. Reglas de Seguridad (`firestore.rules`)
**¿Qué hicimos?**
- Creamos un archivo maestro que le dice a Google quién puede hackear/leer la base de datos y quién no.

**Sintaxis Destacada:**
```javascript
function isAdmin() {
  return request.auth != null && 
         exists(/databases/$(database)/documents/usuarios_admin/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/usuarios_admin/$(request.auth.uid)).data.activo == true;
}
```
**Concepto aprendido:** Las reglas de Firebase no solo verifican si estás "logeado", sino que pueden buscar en otras colecciones (como `usuarios_admin`) para comprobar si tu usuario tiene el campo `activo == true`.

### 6. Panel de Administración (`src/app/admin/productos/page.tsx`)
**¿Qué hicimos?**
- Modificamos el modal donde el administrador crea/edita productos.
- Agregamos los inputs de `Precio base (USD)` y `Icono (Emoji)`.
- Enlazamos estos nuevos inputs al estado del formulario: `onChange={e => setForm(f => ({ ...f, precio_base: Number(e.target.value) }))}`. El uso de `Number()` asegura que a Firebase llegue un número matemático y no texto.

---

Este informe sirve como referencia técnica para todo el equipo. Muestra cómo pasamos de un prototipo de Front-End con datos simulados, a una aplicación de producción dinámica conectada a la nube.
