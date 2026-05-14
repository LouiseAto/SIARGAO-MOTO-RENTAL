import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

// Using system fonts for local development due to SSL issues
// Vercel deployment will use proper fonts
const inter = { className: 'font-sans' }

export const metadata: Metadata = {
  title: 'Siargao Moto Rental Management',
  description: 'Modern motorcycle rental management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
