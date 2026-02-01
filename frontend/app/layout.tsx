import '@/app/globals.css'
import React from 'react'
import { Rajdhani, Share_Tech_Mono } from 'next/font/google'
import RootLayoutClient from "@/components/RootLayoutClient"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body>
        <RootLayoutClient 
          session={session}
          rajdhaniVariable={rajdhani.variable}
          shareTechMonoVariable={shareTechMono.variable}
        >
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}


