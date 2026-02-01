"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, LayoutGrid, Clock, Settings, Sun, Moon, User, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
    { label: 'Workspace', icon: LayoutGrid, href: '/dashboard' },
    { label: 'Archived_Logs', icon: Clock, href: '/history' },
]

export default function Sidebar() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <motion.aside
            initial={false}
            animate={{
                width: open ? "256px" : "80px",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="h-screen bg-card border-r border-border flex flex-col sticky top-0 hidden md:flex z-40"
        >
            {/* Logo Section */}
            <div className={cn("h-16 flex items-center px-6 border-b border-border bg-background/50 backdrop-blur-md transition-all gap-3 overflow-hidden whitespace-nowrap", !open && "justify-center px-0")}>
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
                    <Zap className="w-4 h-4 text-primary" />
                </div>
                <AnimatePresence>
                    {open && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-sm font-bold tracking-[0.2em] text-foreground uppercase font-mono"
                        >
                            Terminal_01
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-sm text-xs font-mono uppercase tracking-widest transition-all group relative border border-transparent whitespace-nowrap overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                    : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                                !open && "justify-center px-0"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"
                                ></motion.div>
                            )}
                            <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                            <AnimatePresence>
                                {open && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    )
                })}
            </nav>

            {/* System Status / Footer */}
            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-md flex flex-col gap-4 whitespace-nowrap">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={cn(
                        "flex items-center justify-between px-3 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-sm group transition-all overflow-hidden",
                        !open && "justify-center px-0 w-full"
                    )}
                    title={mounted ? (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode') : 'Switch Theme'}
                >
                    <AnimatePresence>
                        {open && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="text-[10px] font-mono uppercase text-muted-foreground group-hover:text-foreground"
                            >
                                UI_Theme
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {mounted ? (
                        theme === 'dark' ? (
                            <Moon className="w-3 h-3 text-primary flex-shrink-0" />
                        ) : (
                            <Sun className="w-3 h-3 text-orange-500 flex-shrink-0" />
                        )
                    ) : (
                        <div className="w-3 h-3 bg-muted/50 rounded-full animate-pulse flex-shrink-0" />
                    )}
                </button>

                <div className={cn("relative flex items-center gap-3", !open && "justify-center")}>
                    {session && (
                        <div
                            className="flex items-center gap-3 cursor-pointer group/user"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div className="w-8 h-8 rounded-sm border border-primary/30 bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                                {session.user?.name?.charAt(0) || 'U'}
                            </div>
                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex flex-col overflow-hidden"
                                    >
                                        <span className="text-xs font-bold text-foreground font-mono truncate group-hover/user:text-primary transition-colors">
                                            {session.user?.name || "User_Session"}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Floating User Menu */}
                    <AnimatePresence>
                        {userMenuOpen && open && (
                            <>
                                {/* Click Backdrop */}
                                <div
                                    className="fixed inset-0 z-[-1]"
                                    onClick={() => setUserMenuOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full left-0 mb-2 w-48 bg-card border border-primary/30 rounded-sm shadow-2xl p-1 z-50 backdrop-blur-md"
                                >
                                    <Link
                                        href="/profile"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                                    >
                                        <User className="w-3 h-3" />
                                        Profile_ID
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-red-400 hover:bg-red-400/5 transition-all"
                                    >
                                        <LogOut className="w-3 h-3" />
                                        Sign Out
                                    </button>
                                    <div className="absolute top-0 right-0 p-1 opacity-20">
                                        <div className="w-1 h-1 bg-primary"></div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-1 opacity-20">
                                        <div className="w-1 h-1 bg-primary"></div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    )
}

