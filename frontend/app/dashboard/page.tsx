import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Cpu } from 'lucide-react'
import ImageUpload from './_components/ImageUpload'

export default function DashboardPage() {
  // Mobile Header for small screens (Sidebar hidden)
  // Since Sidebar is now global and responds to md:flex hidden, we might need to adjust mobile visibility globally.
  // But for now, let's keep the internal mobile header or move it too?
  // The global sidebar is `md:flex hidden`. So on mobile, it's gone.
  // We need a mobile trigger. The new Sidebar component has `md:flex hidden`.
  // So we probably still need a mobile header here OR put a mobile trigger in layout.
  // For this step, I will keep the mobile header here as per existing pattern, but remove the Sidebar component.

  const MobileHeader = () => (
    <header className="md:hidden sticky top-0 bg-background/90 backdrop-blur-md border-b border-border px-6 h-16 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
          <span className="text-primary font-bold text-xs">T_01</span>
        </div>
        <span className="text-sm font-bold tracking-[0.2em] text-foreground uppercase font-mono">Terminal_01</span>
      </div>
      <Link href="/history" className="text-[10px] font-bold text-primary border border-primary/50 px-3 py-1 rounded-sm uppercase bg-primary/5">
        Archives
      </Link>
    </header>
  )

  return (
    <div className="min-h-full text-foreground selection:bg-primary/20 selection:text-primary font-sans flex flex-col transition-colors duration-300">

      <MobileHeader />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-8 lg:py-16">

          <div className="mb-12 border-l-2 border-primary/50 pl-6 relative">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors mb-4 group uppercase tracking-widest font-mono">
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Disconnect
            </Link>

            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                Workspace
              </h1>
              <Cpu className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-600/20 blur-xl opacity-20"></div>
            <ImageUpload />
          </div>
        </div>
      </main>
    </div>
  )
}

