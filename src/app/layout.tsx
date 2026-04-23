import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EUA - Euro American Assistance | Asistencia al Viajero',
  description: 'Protección premium para tus viajes. Asistencia médica, legal y personal en más de 130 países. 18 años de experiencia.',
  keywords: 'asistencia viajero, seguro viaje, asistencia médica, Bolivia, Latinoamérica',
  openGraph: {
    title: 'Euro American Assistance - Tu protección en el mundo',
    description: 'Asistencia al viajero premium en más de 130 países.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/css/intlTelInput.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
