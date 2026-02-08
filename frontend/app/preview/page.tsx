"use client"

import React, { useEffect, useState, useRef, Suspense } from "react"
import { buildPreviewSrcDoc } from "@/lib/buildPreviewSrcDoc"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Copy, ArrowLeft, Code2, Eye, Smartphone, Tablet, Monitor, CheckCircle, ChevronLeft, Zap, Box, X, Terminal, Maximize2, Minimize2, Cpu, Save, RotateCcw, Loader2, Pencil } from "lucide-react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import { linter, lintGutter } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Real-time Syntax Linter based on Parser Errors (STABLE IDENTITY)
const syntaxLinter = linter((view) => {
  const diagnostics: any[] = [];
  syntaxTree(view.state).iterate({
    enter: (node) => {
      if (node.type.isError) {
        // Attempt to extract contextual information for the user
        const text = view.state.doc.sliceString(node.from, Math.min(node.to, node.from + 20));
        const message = text.trim()
          ? `Unexpected Token: '${text}...' - Please check your JSX structure or syntax.`
          : "Syntax Error: Likely an unclosed tag, brace, or quote.";

        diagnostics.push({
          from: node.from,
          to: node.to,
          severity: "error",
          message: message,
        });
      }
    },
  });
  // Limit diagnostics to keep the UI from "exploding" with red markers
  return diagnostics.slice(0, 5);
});

function PreviewContent() {
  const { data: session } = useSession()
  const userId = session?.user?.email
  const searchParams = useSearchParams()
  const historyId = searchParams.get('id')

  const [code, setCode] = useState<string>("")
  const [originalCode, setOriginalCode] = useState<string>("")
  const [lastSavedCode, setLastSavedCode] = useState<string>("")
  const [srcDoc, setSrcDoc] = useState<string>("")

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const { theme, systemTheme } = useTheme()
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const currentTheme = theme === 'system' ? systemTheme : theme
  const editorTheme = currentTheme === 'dark' ? vscodeDark : xcodeLight
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [projectName, setProjectName] = useState<string>("New Project")
  const [isEditingName, setIsEditingName] = useState(false)
  const [showProjectNaming, setShowProjectNaming] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [isArchiving, setIsArchiving] = useState(false)

  // Memoize extensions to prevent flickering and marker persistence issues
  const editorExtensions = React.useMemo(() => [
    javascript({ jsx: true, typescript: true }),
    syntaxLinter,
    lintGutter()
  ], []);

  // Unified Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'warning' | 'error' | 'info';
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
  } | null>(null);

  const [pendingPath, setPendingPath] = useState<string | null>(null)

  const router = useRouter()

  // Load Code (from Supabase if ID exists, else from SessionStorage)
  useEffect(() => {
    async function loadContent() {
      setLoading(true)

      if (historyId && userId) {
        // Load from API (Secure)
        try {
          const res = await fetch(`/api/history/${historyId}`)
          const data = await res.json()

          if (res.ok && data) {
            setCode(data.current_code)
            setOriginalCode(data.original_code)
            setLastSavedCode(data.current_code)
            setProjectName(data.title || `Generation_${new Date(data.created_at).toLocaleDateString()}`)
            setSrcDoc(buildPreviewSrcDoc(data.current_code))
          } else {
            console.error("Error loading project:", data.error || "Unknown error")
          }
        } catch (error) {
          console.error("Error fetching project:", error)
        }
      } else {
        // Fallback: Load from Session Storage (New Generation)
        try {
          const stored = sessionStorage.getItem("generatedPreviewCode")
          if (stored) {
            setCode(stored)
            setOriginalCode(stored)
            setLastSavedCode(stored)
            setSrcDoc(buildPreviewSrcDoc(stored))

            // Trigger naming modal for new generation (if not already archived)
            if (!historyId && !sessionStorage.getItem("namingModalShown")) {
              setShowProjectNaming(true)
            }
          }
        } catch (err) {
          console.error(err)
        }
      }
      setLoading(false)
    }

    loadContent()
  }, [historyId, userId])

  // Update Preview when Code Changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setSrcDoc(buildPreviewSrcDoc(code))
    }, 800) // Debounce preview updates
    return () => clearTimeout(timer)
  }, [code])

  // Determine if there are unsaved changes
  const hasUnsavedChanges = historyId ? (code !== "") && (code !== lastSavedCode) : false // Only checking in persistent mode

  // Intercept Navigation (Link clicks)
  const handleExitClick = (e: React.MouseEvent, path: string) => {
    if (hasUnsavedChanges) {
      e.preventDefault()
      setPendingPath(path)
      setModal({
        isOpen: true,
        title: "Unsaved Changes",
        type: "warning",
        message: "Modification to source code detected in buffer. Navigating away will result in permanent data loss of current session.",
        confirmLabel: "Discard Changes",
        cancelLabel: "Return to Editor",
        onConfirm: () => {
          if (path) router.push(path);
          setModal(null);
        }
      });
    }
  }

  // Intercept Browser Back Button / Reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = '' // Standard requirement for Chrome/Firefox
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])


  const handleCopy = () => {
    navigator.clipboard.writeText(code || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!historyId || !userId) {
      alert("Cannot save temporary session. Please generate a new project to save.")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/history/${historyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_code: code })
      });

      if (!res.ok) throw new Error("Sync failure");
      setLastSavedCode(code) // Update last saved as we've saved
    } catch (err) {
      console.error("Save Error:", err);
      // If we don't have a historyId, we should trigger the naming modal instead of just failing
      if (!historyId) {
        setShowProjectNaming(true)
        return
      }
      setModal({
        isOpen: true,
        title: "Sync Error",
        type: "error",
        message: "Failed to sync changes with central archives. Please check network connection.",
        confirmLabel: "Ok"
      });
    }
    setIsSaving(false)
  }

  const handleRename = async (newName: string) => {
    const sanitized = newName.trim().substring(0, 50) || "Untitled_Project"
    setProjectName(sanitized)
    if (historyId) {
      try {
        await fetch(`/api/history/${historyId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: sanitized })
        });
      } catch (err) {
        console.error("Rename Error:", err);
      }
    }
    setIsEditingName(false)
  }

  const handleInitialSave = async (providedName?: string) => {
    const sanitized = (providedName || newProjectName).trim().substring(0, 50) || `Generation_${new Date().toLocaleDateString()}`
    const imageUrl = sessionStorage.getItem("lastUploadedImageUrl")
    const model = sessionStorage.getItem("lastSelectedModel") || "gemini-flash-latest"

    setIsArchiving(true)
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sanitized,
          current_code: code,
          original_code: code,
          image_url: imageUrl,
          model: model
        })
      })
      const data = await res.json()
      if (res.ok && data.id) {
        setLastSavedCode(code)
        sessionStorage.setItem("namingModalShown", "true")
        router.replace(`/preview?id=${data.id}`)
        setShowProjectNaming(false)
      } else {
        throw new Error(data.error || "Persistence failure")
      }
    } catch (err) {
      console.error(err)
      setIsArchiving(false)
    }
  }

  const handleReset = async () => {
    setModal({
      isOpen: true,
      title: "Reset Confirmation",
      type: "warning",
      message: "This will discard all current buffer modifications and revert the environment to the original AI seed generation. This cannot be undone.",
      confirmLabel: "Reset",
      cancelLabel: "Cancel",
      onConfirm: async () => {
        setCode(originalCode)
        setLastSavedCode(originalCode)
        if (historyId) {
          setIsSaving(true)
          await supabase.from('generated_code').update({ current_code: originalCode }).eq('id', historyId)
          setIsSaving(false)
        }
        setModal(null);
      }
    });
  }

  const handleRegenerate = async () => {
    const imageUrl = sessionStorage.getItem("lastUploadedImageUrl")
    if (!imageUrl) {
      setModal({
        isOpen: true,
        title: "Session Expired",
        type: "error",
        message: "Source image buffer has been cleared. Please re-upload the original wireframe to regenerate.",
        confirmLabel: "Ok"
      });
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
        // Note: We don't overwrite 'originalCode' here unless we want to treat this re-roll as the new 'truth'. 
        // For now, let's treat it as a fresh start.
        if (!historyId) {
          sessionStorage.setItem("generatedPreviewCode", data.code)
        }
      }
    } catch (err) {
      console.error("Regeneration failed", err)
    } finally {
      setIsRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!code && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="bg-card p-10 rounded-lg border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4 font-mono uppercase">No Code Found</h2>
          <Link href="/history" className="text-primary hover:text-primary/80 underline font-mono">Return to History</Link>
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
    <div className="h-screen flex flex-col font-sans selection:bg-primary/20 selection:text-primary overflow-hidden relative transition-colors duration-300">

      {/* Header */}
      <header className="bg-background border-b border-border flex-shrink-0 z-20">
        <div className="w-full px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href={historyId ? "/history" : "/dashboard"}
              onClick={(e) => handleExitClick(e, historyId ? "/history" : "/dashboard")}
              className="flex items-center gap-2 group text-muted-foreground hover:text-primary transition-all font-bold text-xs uppercase tracking-widest font-mono"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              <span>{historyId ? "Back" : "Exit"}</span>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              {isEditingName ? (
                <input
                  autoFocus
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onBlur={(e) => handleRename(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(e.currentTarget.value)
                    if (e.key === 'Escape') setIsEditingName(false)
                  }}
                  className="bg-muted border border-primary/30 text-xs font-bold text-foreground px-2 py-1 rounded-sm outline-none focus:border-primary transition-all font-mono uppercase tracking-widest min-w-[200px]"
                />
              ) : (
                <h1
                  onClick={() => setIsEditingName(true)}
                  className="text-xs font-bold text-foreground uppercase tracking-widest font-mono cursor-pointer hover:text-primary transition-colors flex items-center gap-2 group relative pr-6"
                >
                  <span className="truncate max-w-[300px]">{projectName || "New Project"}</span>
                  <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute right-0" />
                  <span className="text-[10px] text-muted-foreground ml-2 hidden lg:inline border-l border-border pl-2 font-normal lowercase tracking-normal">
                    {historyId ? "// Saved" : "// Draft"}
                  </span>
                </h1>
              )}
            </div>
          </div>

          {session && (
            <div className="w-7 h-7 rounded-sm border-2 border-primary/50 bg-primary/10 flex items-center justify-center text-[10px] font-bold">
              {session.user?.name?.charAt(0) || '?'}
            </div>
          )}
        </div>
      </header>

      {/* Main Content: CODE EDITOR */}
      <main className="flex-1 relative z-10 overflow-hidden flex flex-col bg-card">
        <div className={`flex-1 overflow-hidden ${currentTheme === 'light' ? 'bg-secondary/30' : ''}`}>
          <CodeMirror
            value={code}
            height="100%"
            theme={editorTheme}
            extensions={editorExtensions}
            onChange={(value) => setCode(value)}
            className="h-full text-sm font-mono custom-cm-editor"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
            }}
          />
        </div>
      </main>

      {/* Footer Taskbar */}
      <footer className="h-16 bg-background border-t border-border flex-shrink-0 z-30 flex items-center px-6 justify-between gap-4 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <div className="flex items-center gap-4">
          {/* Contextual Actions (Save/Reset) */}
          {historyId && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 hover:bg-secondary border border-border rounded-sm text-[10px] uppercase font-bold text-primary tracking-widest transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                {isSaving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-destructive/10 border border-transparent hover:border-destructive/30 rounded-sm text-[10px] uppercase font-bold text-muted-foreground hover:text-destructive tracking-widest transition-all"
                title="Revert to Original Generation"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          {!historyId && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="group flex items-center gap-2 px-4 py-2 hover:bg-destructive/10 text-primary hover:text-destructive font-bold text-[10px] uppercase tracking-widest font-mono transition-all disabled:opacity-50"
            >
              <Zap className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? "Processing..." : "Regenerate"}
            </button>
          )}

          <button
            onClick={handleCopy}
            className={`group flex items-center gap-2 px-4 py-2 font-bold text-[10px] uppercase tracking-widest font-mono transition-all ${copied ? "text-green-500" : "text-primary hover:text-foreground"}`}
          >
            {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3 group-hover:scale-110" />}
            {copied ? "Copied" : "Copy"}
          </button>

          <div className="h-8 w-px bg-border mx-2"></div>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest font-mono text-xs shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] active:scale-95 transition-all skew-x-[-10deg]"
          >
            <div className="skew-x-[10deg] flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <div className="text-[10px] text-muted-foreground font-mono text-right hidden sm:block">
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
              <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest">Live Preview - Fullscreen</span>
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
              title="Close Fullscreen View"
            >
              Close
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
      {/* Unified Technical Modal */}
      {modal?.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`bg-card border ${modal.type === 'error' ? 'border-destructive/50 shadow-[0_0_50px_rgba(var(--destructive),0.2)]' : 'border-primary/30 shadow-[0_0_50px_rgba(var(--primary),0.2)]'} max-w-md w-full rounded-sm overflow-hidden animate-in zoom-in-95 duration-200`}>
            <div className={`${modal.type === 'error' ? 'bg-destructive/10 border-destructive/20' : 'bg-primary/5 border-primary/10'} border-b p-4 flex items-center gap-3`}>
              <div className={`w-8 h-8 rounded-full ${modal.type === 'error' ? 'bg-destructive/20' : 'bg-primary/20'} flex items-center justify-center`}>
                <div className={`w-2 h-2 rounded-full ${modal.type === 'error' ? 'bg-destructive' : 'bg-primary'} animate-pulse`}></div>
              </div>
              <h3 className={`text-sm font-bold ${modal.type === 'error' ? 'text-destructive' : 'text-primary'} uppercase tracking-widest font-mono`}>{modal.title}</h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-foreground font-mono leading-relaxed">
                {modal.type === 'error' && <span className="text-destructive font-bold">Error: </span>}
                {modal.type === 'warning' && <span className="text-yellow-500 font-bold">Warning: </span>}
                {modal.message}
              </p>
            </div>

            <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-end gap-3">
              {modal.cancelLabel && (
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 border border-border hover:bg-muted text-[10px] font-bold uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground transition-all rounded-sm"
                >
                  {modal.cancelLabel}
                </button>
              )}
              <button
                onClick={() => {
                  if (modal.onConfirm) {
                    modal.onConfirm();
                  } else {
                    setModal(null);
                  }
                }}
                className={`px-4 py-2 ${modal.type === 'error' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'} text-[10px] font-bold uppercase tracking-widest font-mono shadow-md hover:shadow-lg transition-all rounded-sm flex items-center gap-2`}
              >
                {modal.confirmLabel || "Acknowledge"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Initial Project Naming Modal */}
      {showProjectNaming && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card border border-primary/30 shadow-[0_0_80px_rgba(var(--primary),0.15)] max-w-lg w-full rounded-sm overflow-hidden animate-in zoom-in-95 duration-300 relative">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none"></div>

            <div className="bg-primary/5 border-b border-primary/20 p-6 relative">
              <div className="flex items-center gap-3">
                <Box className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-foreground uppercase tracking-[0.2em] font-mono">Name Project</h3>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">// Status: Ready to Save</p>
                </div>
              </div>
            </div>

            <div className="p-8 relative">
              <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-3 font-mono">
                Project Name
              </label>
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="E.g. Nexus_Dashboard_v1"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newProjectName.trim() && !isArchiving) {
                      handleInitialSave()
                    }
                  }}
                  className="w-full bg-muted/30 border border-primary/20 text-foreground px-4 py-4 rounded-sm outline-none focus:border-primary focus:bg-primary/5 transition-all font-mono text-sm uppercase tracking-wide placeholder:text-muted-foreground/30"
                />
                <div className="absolute top-0 right-0 h-full flex items-center pr-4">
                  <Terminal className="w-4 h-4 text-primary/30" />
                </div>
              </div>
              <p className="mt-4 text-[10px] text-muted-foreground font-mono uppercase tracking-widest leading-loose opacity-70">
                // System will index this generation under the specified identifier.<br />
                // All future revisions will be persisted to this history.
              </p>
            </div>

            <div className="p-6 bg-muted/20 border-t border-border flex items-center justify-end gap-3 relative">
              <button
                onClick={() => {
                  handleInitialSave(`Generation_${new Date().toLocaleDateString()}`);
                }}
                className="px-6 py-2 border border-border hover:bg-muted text-[10px] font-bold uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground transition-all rounded-sm flex items-center gap-2"
              >
                {isArchiving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Skip"}
              </button>
              <button
                disabled={!newProjectName.trim() || isArchiving}
                onClick={() => handleInitialSave()}
                className="px-8 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-[10px] font-bold uppercase tracking-widest font-mono shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all rounded-sm flex items-center gap-3 group"
              >
                {isArchiving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Committing...
                  </>
                ) : (
                  <>
                    Save Project
                    <Zap className="w-3 h-3 group-hover:fill-current transition-all" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.3)]"></div>
          <p className="text-cyan-500 text-xs animate-pulse tracking-[0.2em] uppercase">Loading Editor...</p>
        </div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
