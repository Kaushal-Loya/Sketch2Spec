"use client"

import React, { ChangeEvent, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { WandSparkles, X, Upload, Eye, CheckCircle, Info, Zap, Layers } from "lucide-react"

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
    setMessage({ text: "Initializing synthesis...", type: 'info' })

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

      setMessage({ text: "Processing design vectors...", type: 'info' })

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
      setMessage({ text: "Synthesis complete.", type: 'success' })

    } catch (err: any) {
      console.error(err)
      setMessage({ text: err?.message || "Internal error occurred", type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-0">
        {/* Left: Input Sector */}
        <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-slate-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Source Image</h2>
            </div>
            {previewUrl && (
              <button
                onClick={() => { setPreviewUrl(null); setFile(null); setGeneratedCode(null); setMessage(null); }}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Reset
              </button>
            )}
          </div>

          {!previewUrl ? (
            <div
              onClick={() => inputRef.current?.click()}
              className="group relative bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center hover:border-blue-300 hover:bg-white transition-all cursor-pointer min-h-[400px] flex items-center justify-center"
            >
              <div>
                <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Select Wireframe</h3>
                <p className="text-slate-400 font-medium mb-8 text-sm max-w-[200px] mx-auto">
                  Snap a photo of your UI sketch and upload here.
                </p>
                <div className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs">
                  Browse Files
                </div>
              </div>
              <input ref={inputRef} type="file" accept="image/*" hidden onChange={onImageSelect} />
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg aspect-video bg-slate-50 p-2 mb-6">
                <img src={previewUrl} alt="preview" className="w-full h-full object-contain rounded-2xl" />
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                className="w-full py-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-xs font-bold text-slate-600 transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" /> Change Image
              </button>
            </div>
          )}
        </div>

        {/* Right: Synthesis Sector */}
        <div className="p-8 md:p-12 bg-slate-50/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600/10" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Configure & Generate</h2>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Select Model
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'gemini-flash-latest', name: 'Optimized', desc: 'Faster' },
                    { id: 'gemini-pro-latest', name: 'Precision', desc: 'Higher Detail' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-4 rounded-xl border transition-all text-left ${selectedModel === m.id
                        ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100 text-white'
                        : 'bg-white border-slate-100 hover:border-blue-200 text-slate-900'
                        }`}
                    >
                      <p className="text-xs font-bold">{m.name}</p>
                      <p className={`text-[10px] font-medium leading-tight ${selectedModel === m.id ? 'text-blue-100' : 'text-slate-500'}`}>{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {!generatedCode ? (
                <button
                  onClick={onConvert}
                  disabled={uploading || !file}
                  className="w-full h-16 rounded-xl bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white transition-all shadow-xl hover:shadow-slate-200 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
                >
                  {uploading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="font-bold text-sm">Synthesizing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <WandSparkles className="w-5 h-5" />
                      <span className="font-bold text-sm">Generate Component</span>
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={goToPreview}
                  className="w-full h-16 rounded-xl bg-blue-600 text-white transition-all shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center animate-fade-in"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span className="font-bold text-sm">View & Copy Code</span>
                  </div>
                </button>
              )}

              {message && (
                <div className={`p-5 rounded-xl border animate-fade-in flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' :
                  message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' :
                    'bg-blue-50 border-blue-100 text-blue-600'
                  }`}>
                  {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                    message.type === 'error' ? <X className="w-4 h-4" /> :
                      <Info className="w-4 h-4" />}
                  <p className="text-[11px] font-bold uppercase tracking-widest">{message.text}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
