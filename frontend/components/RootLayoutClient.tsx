'use client'

import AppShell from "@/components/AppShell"
import AuthProvider from "@/components/AuthProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { Session } from "next-auth"

export default function RootLayoutClient({ 
  children,
  session,
  rajdhaniVariable,
  shareTechMonoVariable
}: { 
  children: React.ReactNode
  session: Session | null
  rajdhaniVariable: string
  shareTechMonoVariable: string
}) {
  return (
    <div className={`${rajdhaniVariable} ${shareTechMonoVariable} font-sans bg-background text-foreground antialiased`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider session={session}>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </ThemeProvider>
    </div>
  )
}
