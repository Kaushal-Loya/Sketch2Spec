"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ScanLine, Sun, Moon } from 'lucide-react'
import { signIn, useSession, signOut } from 'next-auth/react'
import { useTheme } from "next-themes"

export default function Navbar() {
    const { data: session } = useSession()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm overflow-hidden group-hover:border-primary transition-colors">
                        <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <ScanLine className="w-5 h-5 text-primary relative z-10" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-[0.1em] text-foreground uppercase">Sketch2Spec</span>
                        <span className="text-[10px] text-primary font-mono tracking-widest leading-none">V1.2</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 hover:bg-muted/50 rounded-sm transition-colors border border-transparent hover:border-border"
                        title={mounted ? (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode') : 'Switch Theme'}
                    >
                        {mounted ? (
                            theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-orange-500" />
                            ) : (
                                <Moon className="w-4 h-4 text-primary" />
                            )
                        ) : (
                            <div className="w-4 h-4 bg-muted/50 rounded-full animate-pulse" />
                        )}
                    </button>

                    {!session ? (
                        <>
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                                className="hidden md:block text-sm font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                                className="group relative px-6 py-2 bg-primary/10 border border-primary/20 hover:border-primary transition-all overflow-hidden rounded-sm"
                            >
                                <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                                <span className="relative z-10 text-primary font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                                    Register <ArrowRight className="w-3 h-3" />
                                </span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="px-6 py-2 bg-primary/10 border border-primary/50 text-primary font-mono text-xs hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-widest">
                                Go to Dashboard
                            </Link>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-mono">{session.user?.name}</span>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                                >
                                    Log Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
