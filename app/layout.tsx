import '@/app/globals.css'
import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sketch2Spec | Vision AI Design-to-Code',
  description: 'Transform your hand-drawn sketches and wireframes into production-ready React components using state-of-the-art vision AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
