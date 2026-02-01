import '@/app/globals.css'
import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Rajdhani, Share_Tech_Mono } from 'next/font/google'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani'
})

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono'
})

export const metadata = {
  title: 'Sketch2Spec | Vision AI Design-to-Code',
  description: 'Transform your hand-drawn sketches and wireframes into production-ready React components using state-of-the-art vision AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={`${rajdhani.variable} ${shareTechMono.variable} font-sans bg-background text-foreground antialiased overflow-x-hidden`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
