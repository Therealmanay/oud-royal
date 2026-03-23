import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'OUD ROYAL — Parfums Orientaux de Luxe',
    template: '%s | OUD ROYAL',
  },
  description:
    'Découvrez notre collection exclusive de parfums orientaux des plus grandes maisons émiraties. Livraison partout au Maroc.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Poppins:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins antialiased bg-white text-[#1a1a1a]" suppressHydrationWarning>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000000',
              color: '#FFFFFF',
              borderRadius: '0',
              fontSize: '13px',
              fontWeight: '400',
              letterSpacing: '0.02em',
              padding: '14px 20px',
            },
            success: {
              iconTheme: { primary: '#FFFFFF', secondary: '#000000' },
            },
            error: {
              iconTheme: { primary: '#FFFFFF', secondary: '#000000' },
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}