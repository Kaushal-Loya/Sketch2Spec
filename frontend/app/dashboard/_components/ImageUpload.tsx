"use client"

import React, { ChangeEvent, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { WandSparkles, X, Upload, Eye, CheckCircle, Info, Zap, Layers, Cpu, ScanLine } from "lucide-react"

export default function ImageUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>("gemini-flash-latest")

  const inputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const onImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setFile(files[0])
      setPreviewUrl(URL.createObjectURL(files[0]))
      setMessage(null)
      setGeneratedCode(null)
    }
  }

  const goToPreview = () => {
    if (!generatedCode) return
    router.push("/preview")
  }

  const onConvert = async () => {
    if (!file) return
    setUploading(true)
    setMessage({ text: "SYSTEM_INIT: ANALYZING INPUT...", type: 'info' })

    try {
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: `sketch_${Date.now()}` }),
      })

      const signJson = await signRes.json()
      if (!signRes.ok) throw new Error(signJson?.error || "Signature verification failed")

      const form = new FormData()
      form.append("file", file)
      form.append("api_key", signJson.api_key)
      form.append("timestamp", String(signJson.timestamp))
      form.append("signature", signJson.signature)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signJson.cloud_name}/auto/upload`,
        { method: "POST", body: form }
      )

      const uploadJson = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadJson?.error?.message || "Cloud transfer failed")

      setMessage({ text: "EXTRACTING_VECTORS: PROCESSING...", type: 'info' })

      const aiRes = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadJson.secure_url,
          model: selectedModel,
          allowFallback: false,
        }),
      })

      const aiJson = await aiRes.json()
      if (!aiRes.ok) throw new Error(aiJson?.error || "Synthesis failed")

      setGeneratedCode(aiJson.code)
      sessionStorage.setItem("generatedPreviewCode", aiJson.code)
      sessionStorage.setItem("lastUploadedImageUrl", uploadJson.secure_url)
      setMessage({ text: "COMPILATION_COMPLETE: READY", type: 'success' })

    } catch (err: any) {
      console.error(err)
      setMessage({ text: err?.message || "Internal error occurred", type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-[#030712] rounded-lg border border-cyan-900/50 overflow-hidden shadow-[0_0_40px_-10px_rgba(8,145,178,0.1)] relative group">
      {/* Tech Border Decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-lg pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500/20 rounded-br-lg pointer-events-none"></div>

      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-0">
        {/* Left: Input Sector */}
        <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-cyan-900/30 relative">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b210_1px,transparent_1px),linear-gradient(to_bottom,#0891b210_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-950/50 border border-cyan-900 rounded-sm flex items-center justify-center">
                <ScanLine className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-widest uppercase font-mono">Input_Source</h2>
                <div className="h-[2px] w-full bg-cyan-900/50 mt-1">
                  <div className="h-full w-1/3 bg-cyan-500 animate-pulse"></div>
                </div>
              </div>
            </div>
            {previewUrl && (
              <button
                onClick={() => { setPreviewUrl(null); setFile(null); setGeneratedCode(null); setMessage(null); }}
                className="text-xs font-mono text-cyan-600 hover:text-red-400 transition-colors flex items-center gap-2 uppercase tracking-widest border border-cyan-900/30 px-3 py-1 bg-cyan-950/30 hover:bg-red-950/20 hover:border-red-900/50"
              >
                <X className="w-3 h-3" /> Terminate
              </button>
            )}
          </div>

          {!previewUrl ? (
            <div
              onClick={() => inputRef.current?.click()}
              className="group/drop relative bg-[#050b1a]/80 border border-dashed border-cyan-900/50 rounded-sm p-16 text-center hover:border-cyan-500/50 hover:bg-[#050b1a] transition-all cursor-pointer min-h-[400px] flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover/drop:translate-y-0 transition-transform duration-500 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-cyan-950/30 border border-cyan-800 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(8,145,178,0.2)] group-hover/drop:scale-110 group-hover/drop:border-cyan-500 transition-all duration-300">
                  <Upload className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight font-mono">UPLOAD_WIREFRAME</h3>
                <p className="text-cyan-700 font-mono text-xs mb-8 max-w-[200px] mx-auto uppercase tracking-widest">
                  Supported: PNG, JPG, WEBP
                </p>
                <div className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 transition-colors">
                  Select_Files.exe
                </div>
              </div>
              <input ref={inputRef} type="file" accept="image/*" hidden onChange={onImageSelect} />
            </div>
          ) : (
            <div className="animate-fade-in relative">
              <div className="relative rounded-sm overflow-hidden border border-cyan-900/50 shadow-lg aspect-video bg-[#02040a] p-1 mb-6 group/preview">
                <div className="absolute inset-0 bg-cyan-500/10 z-10 hidden group-hover/preview:block pointer-events-none animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/50 z-20 animate-scan"></div>
                <img src={previewUrl} alt="preview" className="w-full h-full object-contain opacity-80" />

                {/* Tech overlay */}
                <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                  <div className="px-2 py-1 bg-black/80 border border-cyan-900 text-[10px] text-cyan-400 font-mono">RES: HIGH</div>
                  <div className="px-2 py-1 bg-black/80 border border-cyan-900 text-[10px] text-cyan-400 font-mono">FMT: IMG</div>
                </div>
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                className="w-full py-4 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-900 text-xs font-mono text-cyan-500 transition-all flex items-center justify-center gap-2 uppercase tracking-widest hover:border-cyan-500/50"
              >
                <Layers className="w-4 h-4" /> Re-Initialize_Input
              </button>
            </div>
          )}
        </div>

        {/* Right: Synthesis Sector */}
        <div className="p-8 md:p-12 bg-[#02040a] flex flex-col justify-between relative border-l border-cyan-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#02040a] to-[#02040a] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-cyan-950/30 border border-cyan-800 rounded-sm flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-widest uppercase font-mono">Processing_Unit</h2>
                <div className="flex gap-1 mt-1">
                  <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-sm bg-[#050b1a] border border-cyan-900/30">
                <label className="block text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-4 font-mono">
                  Select_Model_Architecture
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'gemini-flash-latest', name: 'TURBO_MODE', desc: 'Speed: Max' },
                    { id: 'gemini-pro-latest', name: 'PRECISION', desc: 'Detail: Max' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-4 rounded-sm border transition-all text-left relative overflow-hidden group ${selectedModel === m.id
                        ? 'bg-cyan-950/50 border-cyan-500 text-cyan-50'
                        : 'bg-transparent border-cyan-900/30 hover:border-cyan-700 text-slate-400'
                        }`}
                    >
                      {selectedModel === m.id && <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>}
                      <p className="text-xs font-bold font-mono tracking-wider relative z-10 uppercase">{m.name}</p>
                      <p className="text-[10px] text-cyan-600/80 font-mono mt-1 relative z-10">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {!generatedCode ? (
                <button
                  onClick={onConvert}
                  disabled={uploading || !file}
                  className="w-full h-16 bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold uppercase tracking-widest transition-all hover:bg-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95 flex items-center justify-center relative overflow-hidden group"
                >
                  {uploading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span className="font-mono text-sm">SYNTHESIZING...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 relative z-10">
                      <WandSparkles className="w-5 h-5" />
                      <span className="font-mono text-sm">INITIATE_SEQUENCE</span>
                    </div>
                  )}
                  {!uploading && !(!file) && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                </button>
              ) : (
                <button
                  onClick={goToPreview}
                  className="w-full h-16 bg-green-500/10 border border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black transition-all shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] active:scale-95 flex items-center justify-center animate-fade-in group"
                >
                  <div className="flex items-center gap-2 font-mono uppercase tracking-widest font-bold text-sm">
                    <Eye className="w-5 h-5" />
                    <span>ACCESS_CODE</span>
                  </div>
                </button>
              )}

              {message && (
                <div className={`p-4 border border-l-4 font-mono text-[10px] uppercase tracking-wider flex items-center gap-3 ${message.type === 'error' ? 'bg-red-950/20 border-red-900 border-l-red-500 text-red-400' :
                  message.type === 'success' ? 'bg-green-950/20 border-green-900 border-l-green-500 text-green-400' :
                    'bg-cyan-950/20 border-cyan-900 border-l-cyan-500 text-cyan-400'
                  }`}>
                  {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                    message.type === 'error' ? <X className="w-4 h-4" /> :
                      <Info className="w-4 h-4 animate-pulse" />}
                  <p>{message.text}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
