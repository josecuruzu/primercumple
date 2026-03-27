import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Gael 🐠 Mi Primer Añito',
  description: 'Libro de visitas para el primer cumpleaños de Gael 🌊',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Gael 🎂',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#b8e8f0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-body">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(110,198,216,0.4)',
              color: '#1d6d87',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 600,
              borderRadius: '16px',
              padding: '12px 20px',
            },
            success: {
              iconTheme: { primary: '#5aab7a', secondary: 'white' },
            },
            error: {
              iconTheme: { primary: '#f06b8a', secondary: 'white' },
            },
          }}
        />
      </body>
    </html>
  )
}
