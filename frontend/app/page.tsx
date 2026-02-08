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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden font-sans transition-colors duration-300">

      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(var(--primary),0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--primary),0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>


      <main className="relative z-10 pt-0 pb-0">
        {/* Hero Section */}
        <section className="relative px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Content */}
            <div className="space-y-3 relative">
              <div className={`inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-[0.2em] transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                SYSTEM ONLINE
              </div>

              <h1 className={`text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-foreground transform transition-all duration-700 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                BUILD <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">YOUR VISION</span>
              </h1>

              <div className={`text-lg text-muted-foreground font-mono leading-relaxed max-w-xl border-l-2 border-primary/20 pl-6 transform transition-all duration-700 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Translate analogue wireframes into production-grade React components.
                <hr className="border-border my-3" />
                Powered by Gemini Vision Pro.
              </div>

              <div className={`flex flex-wrap gap-4 pt-4 transform transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <Link href="/dashboard" className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Project <Target className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: Technical Visualization */}
            <div className="relative h-[500px] w-full hidden lg:block perspective-1000">
              <div className="absolute inset-0 transform rotate-y-10 group hover:rotate-y-0 transition-transform duration-700 ease-out p-1">
                {/* Center Visual - Simplified Wireframe to Code Animation */}
                <div className="absolute inset-0 bg-card border border-border overflow-hidden flex flex-col shadow-2xl rounded-sm">
                  <div className="h-8 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <div className="ml-auto font-mono text-[10px] text-muted-foreground">Preview Mode</div>
                  </div>

                  <div className="flex-1 relative p-8 bg-background/50">
                    {/* Animated Scan Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-scan z-20"></div>

                    {/* Code blocks appearing */}
                    <div className="space-y-3 font-mono text-xs opacity-80">
                      <div className="h-4 w-3/4 bg-muted animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-muted animate-pulse delay-75"></div>
                      <div className="h-20 w-full bg-muted/50 border border-border mt-4 p-2 text-primary">
                        &lt;Component className="flex gap-4"&gt;...
                      </div>
                      <div className="h-4 w-2/3 bg-muted animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* System Specs / Features */}
        <section className="my-32 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6 text-primary" />,
                title: "Fast Compilation",
                desc: "Generate React components in < 3000ms. High-speed inference pipelines."
              },
              {
                icon: <Code2 className="w-6 h-6 text-primary" />,
                title: "Clean Syntax",
                desc: "Clean, semantic JSX. Tailwind CSS utility classes auto-mapped."
              },
              {
                icon: <Terminal className="w-6 h-6 text-primary" />,
                title: "Live Sandbox",
                desc: "Instant isolated rendering environment. Hot-reload enabled."
              }
            ].map((feature, i) => (
              <div key={i} className="group border border-border bg-card p-8 hover:border-primary/50 transition-colors relative overflow-hidden shadow-sm hover:shadow-md rounded-sm">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-mono tracking-wider">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed border-l border-primary/20 pl-4">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-background/50 backdrop-blur-sm py-12">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ScanLine className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold tracking-[0.1em] text-foreground uppercase">Sketch2Spec</span>
              </div>
              <p className="text-muted-foreground text-sm font-mono max-w-md leading-relaxed">
                Advanced computer vision algorithms dedicated to translating analogue design inputs into production-ready frontend specifications.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4 font-mono">Platform</h4>
              <ul className="space-y-2 text-xs font-mono text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">System Status</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4 font-mono">Legal</h4>
              <ul className="space-y-2 text-xs font-mono text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Database</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><span className="opacity-50">© 2026 Kaushal Loya</span></li>
              </ul>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
