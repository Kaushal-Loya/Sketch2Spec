"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Image as ImageIcon, Code2, Sparkles, Layers, Cpu } from 'lucide-react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-blue-100 overflow-x-hidden font-sans">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <Zap className="w-4 h-4 text-white fill-white/20" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Sketch2Spec</span>
          </Link>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="text-sm font-bold text-slate-700 px-4 py-2 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md shadow-slate-200">
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm font-bold bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-100 mr-2">
                User Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-48 pb-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-8">
              <Sparkles className="w-3 h-3" />
              <span>AI Vision Core v1.1 Active</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold text-slate-900 mb-10 tracking-tight leading-[1.05]">
              Hand-drawn sketches <br />
              <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-[12px]">to functional code.</span>
            </h1>

            <p className="text-xl text-slate-500 mb-14 leading-relaxed max-w-2xl mx-auto font-medium">
              Convert your UI wireframes into production-ready React and Tailwind CSS components instantly using high-performance vision models.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95 text-lg">
                Enter Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-24 flex flex-wrap items-center justify-center gap-12 grayscale opacity-40">
              <div className="flex items-center gap-2"><Cpu className="w-5 h-5" /> <span className="text-sm font-bold tracking-tighter italic">Vite</span></div>
              <div className="flex items-center gap-2"><Layers className="w-5 h-5" /> <span className="text-sm font-bold tracking-tighter italic">Tailwind</span></div>
              <div className="flex items-center gap-2"><Code2 className="w-5 h-5" /> <span className="text-sm font-bold tracking-tighter italic">React</span></div>
            </div>
          </div>
        </section>

        {/* Simplified Features Area */}
        <section id="features" className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: <ImageIcon className="w-6 h-6 text-blue-600" />,
                  title: "Vision Pipeline",
                  desc: "Deep analysis of your wireframes to extract layout hierarchies and component structures."
                },
                {
                  icon: <Code2 className="w-6 h-6 text-indigo-600" />,
                  title: "Synthesized Output",
                  desc: "Clean, professional JSX that matches your design intent with high fidelity."
                },
                {
                  icon: <Zap className="w-6 h-6 text-purple-600" />,
                  title: "Live Instances",
                  desc: "Immediate rendering in a sandboxed environment to verify interactivity and styling."
                }
              ].map((feature, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-900">Sketch2Spec</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Sketch2Spec. Clean functional deployment.
          </p>
        </div>
      </footer>
    </div>
  )
}
