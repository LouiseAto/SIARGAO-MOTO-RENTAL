import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

// This version uses Google Fonts and will work on Vercel
// Replace layout.tsx with this file before deploying to Vercel
const inter = Inter({ subsets: ['latin'] })

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
