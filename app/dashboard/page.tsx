import React from 'react'
import Link from 'next/link'
import { Zap, ChevronLeft } from 'lucide-react'
import ImageUpload from './_components/ImageUpload'
import { UserButton } from '@clerk/nextjs'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-blue-100 overflow-x-hidden font-sans">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-50/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-indigo-50/40 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-white fill-white/20" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Sketch2Spec</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-600">Pro Pipeline Active</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mb-6 group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Neural Workspace
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Upload your UI design image below. Our synthesis engine will analyze the layout and generate functional React code.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-10 transition duration-1000"></div>
            <div className="relative shadow-2xl rounded-[2.5rem]">
              <ImageUpload />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
