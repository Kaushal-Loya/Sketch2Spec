"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { ArrowLeft, Clock, Code2, Calendar, Pencil, Trash2, ShieldAlert } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

// Initialize Supabase Client (Client-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type HistoryItem = {
    id: string
    title: string
    image_url: string
    created_at: string
    model: string
}

export default function HistoryPage() {
    const { userId } = useAuth()
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        // Optimistic update
        setHistory(prev => prev.filter(item => item.id !== id))
        setDeletingId(null)

        try {
            const res = await fetch(`/api/history/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Delete failed")
        } catch (error) {
            console.error("Delete Error:", error)
            // Rollback could be implemented here if needed
        }
    }

    const handleUpdateTitle = async (id: string, newTitle: string) => {
        const sanitized = newTitle.trim().substring(0, 50) || "Untitled_Project"

        // Optimistic update
        setHistory(prev => prev.map(item => item.id === id ? { ...item, title: sanitized } : item))
        setEditingId(null)

        try {
            const res = await fetch(`/api/history/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: sanitized })
            });

            if (!res.ok) throw new Error('Failed to update title');
        } catch (error) {
            console.error("Failed to update title:", error)
            // Rollback if needed, but optimistic update is usually fine for titles
        }
    }

    useEffect(() => {
        if (!userId) return

        async function fetchHistory() {
            try {
                const res = await fetch('/api/history')
                if (!res.ok) throw new Error('Failed to fetch history')
                const data = await res.json()
                setHistory(data || [])
            } catch (error) {
                console.error("Error fetching history:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [userId])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-primary font-mono text-xs uppercase tracking-widest">Loading_Archives...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen font-sans selection:bg-primary/20 selection:text-primary text-foreground transition-colors duration-300">

            <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 group text-muted-foreground hover:text-primary transition-all font-bold text-xs uppercase tracking-widest font-mono"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        <span>Dashboard</span>
                    </Link>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <h1 className="text-sm font-bold text-foreground uppercase tracking-widest font-mono">Project_Archives</h1>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:px-12 md:py-12">
                {history.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border rounded-lg bg-card/50">
                        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-muted-foreground mb-2 font-mono uppercase">Log_Empty</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">No generations found in the archive. Return to the dashboard to initiate a new sequence.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item) => (
                            <div key={item.id} className="group relative block bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] flex flex-col">
                                <Link href={`/preview?id=${item.id}`} className="aspect-video bg-muted relative overflow-hidden border-b border-border">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80"></div>
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <span className="px-2 py-1 bg-background/80 border border-border text-[10px] font-mono text-primary uppercase tracking-widest rounded-sm backdrop-blur-sm">
                                            {item.model}
                                        </span>
                                    </div>
                                </Link>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="mb-2 relative min-h-[1.25rem]">
                                        {editingId === item.id ? (
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onBlur={() => handleUpdateTitle(item.id, editTitle)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleUpdateTitle(item.id, editTitle)
                                                    if (e.key === 'Escape') setEditingId(null)
                                                }}
                                                className="w-full bg-muted border border-primary/30 text-sm font-bold text-foreground px-2 py-1 rounded-sm outline-none focus:border-primary transition-all font-mono uppercase tracking-wide"
                                            />
                                        ) : (
                                            <div
                                                onClick={() => {
                                                    setEditingId(item.id)
                                                    setEditTitle(item.title || "")
                                                }}
                                                className="flex items-center gap-2 group/title cursor-pointer hover:text-primary transition-colors"
                                            >
                                                <h3 className="text-sm font-bold text-foreground truncate font-mono uppercase tracking-wide group-hover/title:text-primary transition-colors">
                                                    {item.title || `Generation_${new Date(item.created_at).toLocaleDateString()}`}
                                                </h3>
                                                <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover/title:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeletingId(item.id);
                                            }}
                                            className="absolute top-0 right-0 p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete_Project"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <Link href={`/preview?id=${item.id}`} className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-auto">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                {new Date(item.created_at).toLocaleDateString()}
                                                <span className="ml-2 text-primary/60">
                                                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Code2 className="w-3 h-3" />
                                            <span>React.js</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border border-destructive/30 shadow-[0_0_50px_rgba(var(--destructive),0.1)] max-w-sm w-full rounded-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-destructive/10 border-b border-destructive/20 p-4 flex items-center gap-3">
                            <ShieldAlert className="w-5 h-5 text-destructive" />
                            <h3 className="text-xs font-bold text-destructive uppercase tracking-widest font-mono">Protocol: Delete_Confirmation</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-mono text-foreground leading-relaxed">
                                Warning: This will permanently purge the project from the archives. This action cannot be undone.
                            </p>
                        </div>
                        <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-end gap-3">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-4 py-2 border border-border hover:bg-muted text-[10px] font-bold uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground transition-all rounded-sm"
                            >
                                Cancel_Action
                            </button>
                            <button
                                onClick={() => handleDelete(deletingId)}
                                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-[10px] font-bold uppercase tracking-widest font-mono shadow-md hover:shadow-lg transition-all rounded-sm"
                            >
                                Execute_Purge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
