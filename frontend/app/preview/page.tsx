"use client"

import React, { useEffect, useState } from "react"
import { buildPreviewSrcDoc } from "@/lib/buildPreviewSrcDoc"
import Link from "next/link"
import { Copy, ArrowLeft, Code2, Eye, Smartphone, Tablet, Monitor, CheckCircle, ChevronLeft, Zap, Box, X, Terminal, Maximize2, Minimize2, Cpu } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

export default function PreviewPage() {
  const [code, setCode] = useState<string | null>(null)
  const [srcDoc, setSrcDoc] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

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

  const handleRegenerate = async () => {
    const imageUrl = sessionStorage.getItem("lastUploadedImageUrl")
    if (!imageUrl) {
      alert("Source image not found. Please re-upload from dashboard.")
      return
    }

    setIsRegenerating(true)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          model: "gemini-flash-latest",
        }),
      })

      const data = await res.json()
      if (data.code) {
        setCode(data.code)
        setSrcDoc(buildPreviewSrcDoc(data.code))
        sessionStorage.setItem("generatedPreviewCode", data.code)
      }
    } catch (err) {
      console.error("Regeneration failed", err)
    } finally {
      setIsRegenerating(false)
    }
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 text-center font-sans">
        <div className="bg-[#050b1a] p-12 md:p-16 rounded-lg max-w-lg border border-cyan-900/50 shadow-[0_0_50px_rgba(8,145,178,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b205_1px,transparent_1px),linear-gradient(to_bottom,#0891b205_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="w-20 h-20 bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.2)] relative z-10">
            <Box className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight uppercase font-mono relative z-10">No Manifest Found</h2>
          <p className="text-slate-400 font-mono text-sm mb-12 leading-relaxed relative z-10">
            // Error: Buffer empty.<br />
            // Please return to workspace and execute generation sequence.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-sm bg-cyan-600 text-black font-bold hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] active:scale-95 uppercase tracking-widest font-mono relative z-10"
          >
            <ChevronLeft className="w-4 h-4" />
            Return_Workspace
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
    <div className="h-screen bg-[#030712] flex flex-col font-sans selection:bg-cyan-900/50 selection:text-cyan-50 overflow-hidden relative">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
      </div>

      {/* Header */}
      <header className="bg-[#030712] border-b border-cyan-900/30 flex-shrink-0 z-20">
        <div className="w-full px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 group text-cyan-700 hover:text-cyan-400 transition-all font-bold text-xs uppercase tracking-widest font-mono"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              <span>Exit</span>
            </Link>
            <div className="h-4 w-px bg-cyan-900/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-500" />
              <h1 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Code_Editor_v0.9</h1>
            </div>
          </div>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "border-2 border-cyan-900 rounded-sm w-7 h-7"
              }
            }}
          />
        </div>
      </header>

      {/* Main Content: CODE ONLY */}
      <main className="flex-1 relative z-10 overflow-hidden flex flex-col">
        <div className="flex-1 bg-[#02040a] relative overflow-auto scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent">
          {/* Line Numbers Sidebar Placeholder */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#02040a] border-r border-cyan-900/20 z-10 flex flex-col items-end py-6 pr-3 text-cyan-900/50 font-mono text-xs select-none">
            {Array.from({ length: (code?.split('\n').length || 50) + 10 }).map((_, i) => <div key={i} className="leading-relaxed">{i + 1}</div>)}
          </div>

          <div className="pl-16 pr-6 py-6 min-h-full">
            <pre className="font-mono text-sm leading-relaxed text-cyan-50/80 token-stream">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </main>

      {/* Footer Taskbar */}
      <footer className="h-16 bg-[#050b1a] border-t border-cyan-900/50 flex-shrink-0 z-30 flex items-center px-6 justify-between gap-4 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/30 rounded-sm border border-cyan-900/30">
            <Cpu className="w-3 h-3 text-cyan-600" />
            <span className="text-[10px] font-mono text-cyan-600 uppercase">System: Stable</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="group flex items-center gap-2 px-4 py-2 hover:bg-red-950/20 text-cyan-600 hover:text-red-400 font-bold text-[10px] uppercase tracking-widest font-mono transition-all disabled:opacity-50"
          >
            <Zap className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? "Processing..." : "Reroll_Seed"}
          </button>

          <button
            onClick={handleCopy}
            className={`group flex items-center gap-2 px-4 py-2 font-bold text-[10px] uppercase tracking-widest font-mono transition-all ${copied ? "text-green-400" : "text-cyan-400 hover:text-white"}`}
          >
            {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3 group-hover:scale-110" />}
            {copied ? "Copied" : "Copy_Source"}
          </button>

          <div className="h-8 w-px bg-cyan-900/50 mx-2"></div>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest font-mono text-xs shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] active:scale-95 transition-all skew-x-[-10deg]"
          >
            <div className="skew-x-[10deg] flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visualise_Code
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <div className="text-[10px] text-cyan-900 font-mono text-right hidden sm:block">
            Ln {code?.split('\n').length}, Col 1<br /> UTF-8
          </div>
        </div>
      </footer>

      {/* Floating Preview Window (Modal) - FULLSCREEN */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a] animate-in fade-in zoom-in-95 duration-200 flex flex-col">
          {/* Window Top Bar */}
          <div className="h-12 bg-[#02040a] border-b border-cyan-900/50 flex items-center justify-between px-6 select-none flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5 group">
                <button onClick={() => setIsPreviewOpen(false)} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center group/close transition-all">
                  <X className="w-2.5 h-2.5 text-black opacity-0 group-hover/close:opacity-100" />
                </button>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/50"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/50"></div>
              </div>
              <div className="h-4 w-px bg-cyan-900/50"></div>
              <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest">Live_Instance_Viewer.exe // FULLSCREEN_MODE</span>
            </div>

            {/* Device Toggles in Toolbar */}
            <div className="flex bg-cyan-950/30 rounded-sm border border-cyan-900/30 p-1">
              {[
                { id: "mobile", icon: <Smartphone className="w-4 h-4" /> },
                { id: "tablet", icon: <Tablet className="w-4 h-4" /> },
                { id: "desktop", icon: <Monitor className="w-4 h-4" /> }
              ].map((device) => (
                <button
                  key={device.id}
                  onClick={() => setViewMode(device.id as any)}
                  className={`px-3 py-1.5 rounded-[1px] transition-all ${viewMode === device.id
                    ? "bg-cyan-700 text-white shadow-sm"
                    : "text-cyan-700 hover:text-cyan-400"
                    }`}
                >
                  {device.icon}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPreviewOpen(false)}
              className="px-4 py-1.5 bg-red-950/20 hover:bg-red-500/20 text-red-500 border border-red-900/50 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Close_Window
            </button>
          </div>

          {/* Window Content */}
          <div className="flex-1 bg-[#0b101b] relative overflow-hidden flex items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            <div
              style={{ width: previewWidths[viewMode] }}
              className="bg-white h-full shadow-2xl transition-all duration-300 ease-in-out origin-top border-x border-black overflow-hidden relative"
            >
              <iframe
                title="UI Preview"
                className="w-full h-full border-0 bg-white"
                srcDoc={srcDoc}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
