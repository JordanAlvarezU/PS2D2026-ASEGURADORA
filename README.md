# Euro American Assistance - Plataforma Web

Plataforma de asistencia al viajero desarrollada con Next.js, Tailwind CSS y Firebase.

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Estilos**: Tailwind CSS con paleta personalizada
- **Componentes**: Radix UI + Lucide Icons
- **Animaciones**: Framer Motion + CSS animations
- **Backend**: Firebase (Auth + Firestore)
- **Teléfonos**: intl-tel-input v25

## Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Cream | `#E3E7D3` | Fondos claros, cards |
| Gray Light | `#BDC2BF` | Bordes, separadores |
| Gray Mid | `#989C94` | Texto secundario |
| Dark Green | `#25291C` | Fondo principal, navbar |
| Orange | `#FF8811` | CTAs, acentos, highlights |

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx           # Página principal
│   ├── login/page.tsx     # Login admin
│   ├── cotizar/page.tsx   # Resultados cotización
│   ├── productos/page.tsx # Catálogo de productos
│   ├── asistencia/page.tsx
│   ├── contacto/page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/
│       ├── HeroSection.tsx      # Hero con formulario cotizador
│       ├── BenefitsSection.tsx  # Beneficios y features
│       ├── StatsSection.tsx     # Estadísticas animadas
│       ├── ProductsSection.tsx  # Preview de productos
│       ├── TestimonialsSection.tsx
│       └── CardSearchSection.tsx
└── lib/
    ├── firebase.ts   # Config Firebase + datos estáticos
    └── utils.ts      # Utilidades
```

## Instalación y Setup

### Paso 1 - Requisitos
```bash
node --version  # Necesitas Node.js 18+
```

### Paso 2 - Abrir el proyecto en VS Code
```bash
# Mueve la carpeta del proyecto a tu ubicación deseada
# Luego ábrelo en VS Code:
code eua-assistance
```

### Paso 3 - Instalar dependencias
```bash
cd eua-assistance
npm install
```

### Paso 4 - Variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales de Firebase
# (Puedes dejarlo así por ahora, la app funciona con datos estáticos)
```

### Paso 5 - Ejecutar en desarrollo
```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## Páginas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/login` | Login de administrador |
| `/cotizar` | Resultados de cotización |
| `/productos` | Catálogo de productos |
| `/asistencia` | Información de asistencia |
| `/contacto` | Formulario de contacto |

## Conectar Firebase (cuando estés listo)

1. Crea un proyecto en https://console.firebase.google.com
2. Activa Authentication (Email/Password)
3. Activa Firestore Database
4. Copia las credenciales a `.env.local`
5. Descomenta el código en `src/lib/firebase.ts`

### Estructura Firestore

```
firestore/
├── destinos/    { nombre, zona_tarifa }
├── origen/      { nombre }
├── productos/   { nombre, activo, limite_edad, region_cobertura, beneficios[] }
├── leads/       { contacto{}, datos_viaje{}, creado_en }
└── usuarios_admin/ { email, activo }
```

## Agregar WhatsApp Business (futuro)

El chatbot de WhatsApp Business se conectará mediante webhook.
Crea un endpoint en `/api/webhook/whatsapp` cuando estés listo.

## Deploy en Vercel

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel

# Agrega las variables de entorno en el dashboard de Vercel
```
