"use client"

import React, { useEffect, useState } from "react"
import { buildPreviewSrcDoc } from "@/lib/buildPreviewSrcDoc"
import Link from "next/link"
import { Copy, ArrowLeft, Code2, Eye, Smartphone, Tablet, Monitor, CheckCircle, ChevronLeft, Zap, Box, Activity } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

export default function PreviewPage() {
  const [code, setCode] = useState<string | null>(null)
  const [srcDoc, setSrcDoc] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("generatedPreviewCode")
      if (stored) {
        setCode(stored)
        setSrcDoc(buildPreviewSrcDoc(stored))
      }
    } catch (err) {
      console.error("Failed to read preview code", err)
    }
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(code || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-12 md:p-16 rounded-[3rem] max-w-lg border border-slate-100 shadow-2xl">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-10 border border-red-100">
            <Box className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">No Manifest Found</h2>
          <p className="text-slate-500 font-medium mb-12 leading-relaxed">
            Please return to the workspace and generate your UI code first.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            Go to Workspace
          </Link>
        </div>
      </div>
    )
  }

  const previewWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px"
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 group text-slate-400 hover:text-slate-900 transition-all font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Workspace</span>
            </Link>
            <div className="h-6 w-px bg-slate-100 hidden sm:block" />
            <h1 className="text-sm font-bold text-slate-900 hidden md:block">UI Preview Instance</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Device Switcher */}
            <div className="hidden lg:flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              {[
                { id: "mobile", icon: <Smartphone className="w-4 h-4" /> },
                { id: "tablet", icon: <Tablet className="w-4 h-4" /> },
                { id: "desktop", icon: <Monitor className="w-4 h-4" /> }
              ].map((device) => (
                <button
                  key={device.id}
                  onClick={() => setViewMode(device.id as any)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${viewMode === device.id
                    ? "bg-white text-slate-900 shadow-sm border border-slate-100 font-bold"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {device.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{device.id}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${copied ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Code Copied" : "Copy JSX Code"}
              </button>

              <div className="h-10 w-px bg-slate-100 hidden sm:block mx-1" />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 lg:p-10 flex flex-col lg:flex-row gap-8 max-w-[1800px] mx-auto w-full h-[calc(100vh-80px)] overflow-hidden">
        {/* Source View - Minimal */}
        <div className="lg:w-[35%] flex flex-col bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source Buffer</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-8 font-mono text-xs leading-relaxed text-blue-100/70 scrollbar-thin">
            <pre><code>{code}</code></pre>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:w-[65%] flex flex-col bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl relative group">
          <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block">Live Instance</span>
            </div>
            <div className="text-[8px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest border border-green-100 flex items-center gap-1.5">
              <Zap className="w-2 h-2 fill-green-600" /> Active Rendering
            </div>
          </div>

          <div className="flex-1 bg-slate-50/50 flex flex-col items-center p-8 overflow-auto">
            <div
              style={{ width: previewWidths[viewMode] }}
              className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500 h-full border border-slate-200 relative"
            >
              <iframe
                title="UI Preview"
                className="w-full h-full border-0"
                srcDoc={srcDoc}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
