"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, LayoutGrid, Clock, Settings, FileText, LogOut, Cpu, Shield, Sun, Moon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from "next-themes"

const navItems = [
    { label: 'Workspace', icon: LayoutGrid, href: '/dashboard', active: true },
    { label: 'Archived_Logs', icon: Clock, href: '/history', active: false },
    { label: 'Configuration', icon: Settings, href: '#', active: false },
]

export default function Sidebar() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <aside className="w-64 h-screen bg-card border-r border-border flex flex-col sticky top-0 md:flex hidden z-40 transition-colors duration-300">
            {/* Logo Section */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-border bg-background/50 backdrop-blur-md">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm overflow-hidden">
                    <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-bold tracking-[0.2em] text-foreground uppercase font-mono">Terminal_01</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-mono uppercase tracking-widest transition-all group relative border border-transparent ${isActive
                                ? "bg-primary/10 text-primary border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary animate-pulse"></div>
                            )}
                            <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* System Status / Footer */}
            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-md flex flex-col gap-4">

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-sm group transition-all"
                >
                    <span className="text-[10px] font-mono uppercase text-muted-foreground group-hover:text-foreground">
                        UI_Theme: {mounted ? (theme === 'dark' ? 'Dark_Mode' : 'Light_Mode') : '...'}
                    </span>
                    {mounted ? (
                        theme === 'dark' ? (
                            <Moon className="w-3 h-3 text-primary" />
                        ) : (
                            <Sun className="w-3 h-3 text-orange-500" />
                        )
                    ) : (
                        <div className="w-3 h-3 bg-muted/50 rounded-full animate-pulse" />
                    )}
                </button>

                <div className="flex items-center gap-3 px-2">
                    {session?.user && (
                        <>
                            <div className="w-8 h-8 rounded-sm border border-primary/50 bg-primary/10 flex items-center justify-center text-xs font-bold">
                                {session.user.name?.charAt(0) || '?'}
                            </div>
                            <Link href="/profile" className="flex flex-col hover:opacity-80 transition-opacity">
                                <span className="text-xs font-bold text-foreground font-mono">
                                    {session.user.name || "User_Session"}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="text-[10px] text-cyan-500 font-mono hover:text-cyan-400"
                                >
                                    Sign Out
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}
