"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Zap, Clock, Code, Settings, ShieldCheck, Activity, LogOut, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface LogEntry {
    id: string;
    type: 'SUCCESS' | 'INFO' | 'SYSTEM' | 'DB' | 'AUTH';
    message: string;
    timestamp: string;
}

export default function ProfilePage() {
    const { data: session } = useSession()
    const [stats, setStats] = useState({
        totalProjects: 0,
        lastGen: 'N/A',
        favoriteModel: 'Gemini 1.5 Flash'
    })
    const [loading, setLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [logs, setLogs] = useState<LogEntry[]>([])
    const logEndRef = useRef<HTMLDivElement>(null)

    // Daily activity log simulator + Initial logs (Fixes hydration mismatch)
    useEffect(() => {
        // Set initial logs after mount to avoid SSR mismatch
        setLogs([
            { id: '1', type: 'SUCCESS', message: 'Successfully signed in as ' + (session?.user?.name || 'User'), timestamp: new Date().toLocaleTimeString() },
            { id: '2', type: 'SUCCESS', message: 'Secure connection to database established', timestamp: new Date().toLocaleTimeString() },
            { id: '3', type: 'INFO', message: 'Ready to create new projects', timestamp: new Date().toLocaleTimeString() }
        ])

        const potentialLogs = [
            { type: 'SUCCESS', message: 'Successfully saved project to your archives' },
            { type: 'INFO', message: 'New responsive UI generated with Gemini' },
            { type: 'SUCCESS', message: 'Exported code successfully' },
            { type: 'INFO', message: 'Preview window updated with latest changes' },
            { type: 'SYSTEM', message: 'Session data safely backed up' },
            { type: 'SUCCESS', message: 'Dashboard statistics updated' },
            { type: 'INFO', message: 'AI model optimized for your connection' }
        ]

        const interval = setInterval(() => {
            const randomLog = potentialLogs[Math.floor(Math.random() * potentialLogs.length)]
            const newLog: LogEntry = {
                id: Math.random().toString(36).substr(2, 9),
                type: randomLog.type as any,
                message: randomLog.message,
                timestamp: new Date().toLocaleTimeString()
            }
            setLogs(prev => [...prev.slice(-7), newLog]) // Keep last 8 logs
        }, 4000)

        return () => clearInterval(interval)
    }, [session?.user?.name])

    useEffect(() => {
        if (!session?.user?.email) return

        async function fetchStats() {
            try {
                const res = await fetch('/api/history')
                if (res.ok) {
                    const data = await res.json()
                    setStats(prev => ({
                        ...prev,
                        totalProjects: data.length || 0,
                        lastGen: data[0] ? new Date(data[0].created_at).toLocaleDateString() : 'N/A'
                    }))
                }
            } catch (err) {
                console.error("Failed to fetch profile stats:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [session?.user?.email])

    const handleDeleteAccount = async () => {
        const confirmed = confirm("WARNING: This will permanently delete your entire Project History and all saved data. This action CANNOT be undone. Are you sure you want to delete your account data permanently?");

        if (confirmed) {
            setIsDeleting(true);
            try {
                const res = await fetch('/api/auth/delete-account', { method: 'DELETE' });
                if (res.ok) {
                    alert("Account data deleted successfully. You will now be signed out.");
                    localStorage.clear();
                    signOut({ callbackUrl: '/' });
                } else {
                    alert("Failed to delete account data. Please try again later.");
                }
            } catch (err) {
                console.error("Deletion error:", err);
                alert("An error occurred during deletion.");
            } finally {
                setIsDeleting(false);
            }
        }
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_100%)]">
                <ShieldCheck className="w-16 h-16 text-primary mb-6 animate-pulse" />
                <h1 className="text-2xl font-bold text-foreground mb-4 font-mono uppercase tracking-[0.2em]">Authentication_Required</h1>
                <p className="text-muted-foreground font-mono text-sm mb-8 uppercase tracking-widest text-center max-w-md">Access to internal user profiles requires established session credentials.</p>
                <Link href="/" className="px-8 py-3 bg-primary text-primary-foreground font-bold font-mono text-sm uppercase tracking-widest hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all">
                    Return_To_Root
                </Link>
            </div>
        )
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-full bg-background selection:bg-primary/20 selection:text-primary transition-colors duration-300">
            {/* Header / Banner */}
            <div className="relative h-48 bg-card border-b border-border">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-16 left-12 w-32 h-32 rounded-sm bg-background border-2 border-primary/50 flex items-center justify-center text-4xl font-bold text-primary shadow-2xl z-10 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                    {session.user?.name?.charAt(0) || 'U'}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                </motion.div>
            </div>

            <div className="max-w-6xl mx-auto px-8 md:px-12 pt-20 pb-16">
                <div className="grid lg:grid-cols-[1fr,350px] gap-12">
                    {/* Main Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-12"
                    >
                        {/* Profile Info */}
                        <motion.section variants={itemVariants} className="space-y-8">
                            <div>
                                <h1 className="text-4xl font-bold text-foreground tracking-tight uppercase flex flex-wrap items-center gap-4">
                                    {session.user?.name}
                                    <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-sm text-[10px] text-primary font-mono tracking-widest mt-1">VERIFIED_USER</div>
                                </h1>
                                <p className="text-muted-foreground font-mono text-sm flex items-center gap-2 mt-2">
                                    <Mail className="w-4 h-4 text-primary/50" />
                                    {session.user?.email}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                <div className="p-6 rounded-sm bg-card border border-border group hover:border-primary/50 transition-all cursor-default relative overflow-hidden h-32 flex flex-col justify-center">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Code className="w-12 h-12" />
                                    </div>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Total_Sequences</p>
                                    <p className="text-3xl font-bold font-mono text-foreground">{loading ? '__' : stats.totalProjects}</p>
                                </div>
                                <div className="p-6 rounded-sm bg-card border border-border group hover:border-primary/50 transition-all cursor-default relative overflow-hidden h-32 flex flex-col justify-center">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Clock className="w-12 h-12" />
                                    </div>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Last_Generation</p>
                                    <p className="text-2xl font-bold font-mono text-foreground">{loading ? '__' : stats.lastGen}</p>
                                </div>
                                <div className="p-6 rounded-sm bg-card border border-border group hover:border-primary/50 transition-all cursor-default relative overflow-hidden h-32 flex flex-col justify-center">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Zap className="w-12 h-12" />
                                    </div>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1 font-bold">Primary_Engine</p>
                                    <p className="text-xl font-bold font-mono text-primary text-sm lg:text-lg">GEMINI_1.5_FLASH</p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Activity Log Simulator */}
                        <motion.section variants={itemVariants} className="space-y-4">
                            <h2 className="text-xs font-bold font-mono text-muted-foreground flex items-center gap-2 uppercase tracking-[0.3em]">
                                <Activity className="w-4 h-4" /> Recent_Activity_Logs
                                <div className="w-2 h-2 bg-primary rounded-full animate-ping ml-2"></div>
                            </h2>
                            <div className="bg-black/95 border border-primary/20 p-6 rounded-sm font-mono text-[11px] h-[240px] overflow-hidden relative shadow-2xl">
                                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black to-transparent z-10 opacity-50"></div>
                                <div className="space-y-2 relative">
                                    <AnimatePresence mode="popLayout">
                                        {logs.map((log) => (
                                            <motion.div
                                                key={log.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                className="flex gap-4 items-start"
                                            >
                                                <span className="text-muted-foreground/40 shrink-0">[{log.timestamp}]</span>
                                                <span className={cn(
                                                    "shrink-0 font-bold",
                                                    log.type === 'SUCCESS' ? 'text-green-500' :
                                                        log.type === 'SYSTEM' ? 'text-primary' :
                                                            log.type === 'AUTH' ? 'text-yellow-500' :
                                                                'text-blue-500'
                                                )}>
                                                    [{log.type === 'SYSTEM' ? 'SYNC' : log.type === 'INFO' ? 'USER' : log.type}]
                                                </span>
                                                <span className="text-primary/80">{log.message}</span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <div ref={logEndRef} />
                                </div>
                                <div className="absolute bottom-4 right-4 text-[10px] text-primary/30 uppercase tracking-[0.2em] font-bold">Live_Feed_Active</div>
                            </div>
                        </motion.section>
                    </motion.div>

                    {/* Sidebar / Settings */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card border border-border p-8 rounded-sm space-y-8 shadow-xl"
                        >
                            <h3 className="text-xs font-bold font-mono text-foreground uppercase tracking-widest border-l-2 border-primary pl-4">Account_Settings</h3>

                            <div className="space-y-6">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="w-full h-14 flex items-center justify-center gap-3 bg-red-600 border border-red-500 text-white hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all text-sm font-bold font-mono uppercase tracking-[0.2em] disabled:opacity-50 relative overflow-hidden group/delete"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/delete:translate-y-0 transition-transform duration-300"></div>
                                    <Trash2 className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10">{isDeleting ? 'Deleting...' : 'Delete_Account_Data'}</span>
                                </button>

                                <div className="p-4 border border-red-500/30 rounded-sm bg-red-500/5 animate-pulse-slow">
                                    <p className="text-[11px] font-mono text-red-500 uppercase leading-relaxed text-center font-black tracking-tight">
                                        CRITICAL: Deleting account data is permanent. All history and projects will be purged from the database.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
