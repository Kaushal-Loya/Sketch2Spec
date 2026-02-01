import React from 'react'
import Link from 'next/link'
import { Zap, ChevronLeft, Terminal, Cpu } from 'lucide-react'
import ImageUpload from './_components/ImageUpload'
import { UserButton } from '@clerk/nextjs'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-cyan-900/50 selection:text-cyan-50 overflow-x-hidden font-sans">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b205_1px,transparent_1px),linear-gradient(to_bottom,#0891b205_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#030712]/80 to-[#030712]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-cyan-900/30 bg-[#030712]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center bg-cyan-950/50 border border-cyan-900 overflow-hidden">
              <Zap className="w-4 h-4 text-cyan-500" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-cyan-50 uppercase font-mono">Terminal_01</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-cyan-950/20 border border-cyan-900/50 rounded-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
              <p className="text-[10px] font-bold text-cyan-600 font-mono uppercase tracking-wider">System_Ready</p>
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "border-2 border-cyan-900 rounded-sm w-8 h-8"
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 border-l-2 border-cyan-900/50 pl-6 relative">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-cyan-700 hover:text-cyan-400 transition-colors mb-4 group uppercase tracking-widest font-mono">
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Disconnect
            </Link>

            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                Neural_Workspace
              </h1>
              <Cpu className="w-6 h-6 text-cyan-800 animate-pulse" />
            </div>

            <p className="text-sm text-slate-400 font-mono max-w-2xl">
              // Initialize generation sequence. Upload source material.<br />
              // Protocol: Vision-to-JSX. Latency: Minimal.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-xl opacity-20"></div>
            <ImageUpload />
          </div>

          {/* Footer Stats - Decorational */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-cyan-900/30 pt-8 opacity-50">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-cyan-800 font-mono uppercase tracking-widest">Memory_Alloc</span>
              <div className="h-1 bg-cyan-900/30 w-full overflow-hidden">
                <div className="h-full bg-cyan-600 w-[45%]"></div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-cyan-800 font-mono uppercase tracking-widest">Network_Lat</span>
              <span className="text-xs text-cyan-600 font-mono">12ms</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[10px] text-cyan-800 font-mono uppercase tracking-widest">Secure_Conn</span>
              <span className="text-xs text-green-600 font-mono">ENCRYPTED</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
