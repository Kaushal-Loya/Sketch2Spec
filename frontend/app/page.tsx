"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Target, Cpu, Code2, ScanLine, Terminal } from 'lucide-react'
export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans">

      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#00f0ff05_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>


      <main className="relative z-10 pt-0 pb-20">
        {/* Hero Section */}
        <section className="relative px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Content */}
            <div className="space-y-3 relative">
              <div className={`inline-flex items-center gap-2 px-3 py-1 border border-cyan-900/50 bg-cyan-950/30 text-cyan-400 text-[10px] font-mono tracking-[0.2em] transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                SYSTEM ONLINE
              </div>

              <h1 className={`text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-white transform transition-all duration-700 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                BUILD <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">YOUR VISION</span>
              </h1>

              <div className={`text-lg text-slate-400 font-mono leading-relaxed max-w-xl border-l-2 border-cyan-900 pl-6 transform transition-all duration-700 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Translate analogue wireframes into production-grade React components.
                <hr className="border-cyan-900/30 my-3" />
                Powered by Gemini Vision Pro.
              </div>

              <div className={`flex flex-wrap gap-4 pt-4 transform transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <Link href="/dashboard" className="group relative px-8 py-4 bg-cyan-500 text-black font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Project <Target className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: Technical Visualization */}
            <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent border border-cyan-900/30 rounded-sm transform rotate-y-10 group hover:rotate-y-0 transition-transform duration-700 ease-out p-1">
                {/* Decorative HUD Elements */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-500"></div>

                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-900/50"></div>
                <div className="absolute left-1/2 top-0 w-[1px] h-full bg-cyan-900/50"></div>

                {/* Center Visual - Simplified Wireframe to Code Animation */}
                <div className="absolute inset-10 bg-[#050b1a] border border-cyan-900/50 overflow-hidden flex flex-col">
                  <div className="h-8 bg-cyan-950/50 border-b border-cyan-900/30 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <div className="ml-auto font-mono text-[10px] text-cyan-600">Preview Mode</div>
                  </div>

                  <div className="flex-1 relative p-8">
                    {/* Animated Scan Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-scan z-20"></div>

                    {/* Code blocks appearing */}
                    <div className="space-y-3 font-mono text-xs opacity-80">
                      <div className="h-4 w-3/4 bg-cyan-900/30 animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-cyan-900/30 animate-pulse delay-75"></div>
                      <div className="h-20 w-full bg-cyan-900/20 border border-cyan-900/30 mt-4 p-2 text-cyan-700">
                        &lt;Component className="flex gap-4"&gt;...
                      </div>
                      <div className="h-4 w-2/3 bg-cyan-900/30 animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* System Specs / Features */}
        <section className="mt-32 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6 text-cyan-400" />,
                title: "Fast Compilation",
                desc: "Generate React components in < 3000ms. High-speed inference pipelines."
              },
              {
                icon: <Code2 className="w-6 h-6 text-cyan-400" />,
                title: "Clean Syntax",
                desc: "Clean, semantic JSX. Tailwind CSS utility classes auto-mapped."
              },
              {
                icon: <Terminal className="w-6 h-6 text-cyan-400" />,
                title: "Live Sandbox",
                desc: "Instant isolated rendering environment. Hot-reload enabled."
              }
            ].map((feature, i) => (
              <div key={i} className="group border border-cyan-900/30 bg-[#050b1a] p-8 hover:border-cyan-500/50 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-mono tracking-wider">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed border-l border-cyan-900/50 pl-4">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
