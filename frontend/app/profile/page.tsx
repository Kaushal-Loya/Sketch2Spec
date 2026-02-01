"use client"

import React, { useState } from "react"
import { useUser, UserProfile, SignOutButton } from "@clerk/nextjs"
import { Shield, Mail, User as UserIcon, Calendar, ArrowLeft, Pencil, Terminal, LogOut } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const { user, isLoaded } = useUser()
    const [isEditing, setIsEditing] = useState(false)

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-primary font-mono text-xs uppercase tracking-widest">Accessing_User_Profile...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center p-8 border border-destructive/50 bg-destructive/5 rounded-sm">
                    <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-destructive mb-2 font-mono uppercase">Unauthorized_Access</h3>
                    <p className="text-muted-foreground text-sm font-mono">Please re-authenticate to view this sector.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 transition-colors duration-300">
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
                    <h1 className="text-sm font-bold text-foreground uppercase tracking-widest font-mono">User_Profile_Module</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8 md:px-12 md:py-12">
                {isEditing ? (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-mono uppercase tracking-tight flex items-center gap-3">
                                <Terminal className="w-6 h-6 text-primary" />
                                Edit_Security_Credentials
                            </h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-border hover:bg-muted text-[10px] font-bold uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground transition-all rounded-sm"
                            >
                                Back_To_View
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-sm">
                                <p className="text-[10px] font-mono text-primary flex items-center gap-2">
                                    <Shield className="w-3 h-3" />
                                    SECURITY_NOTICE: All changes are synced directly with the identity provider (Clerk).
                                </p>
                            </div>
                            <div className="bg-white dark:bg-[#111] border border-border rounded-sm custom-clerk-wrapper shadow-xl min-h-[600px] flex justify-center">
                                <UserProfile
                                    routing="hash"
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full mx-auto",
                                            card: "shadow-none w-full bg-transparent border-none",
                                            navbar: "border-r border-border",
                                            scrollBox: "rounded-none"
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="relative mb-12 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-600/20 blur-xl opacity-20"></div>
                            <div className="relative bg-card border border-border rounded-sm p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                                <div className="relative shrink-0">
                                    <div className="w-32 h-32 rounded-sm border-2 border-primary/30 p-1 group-hover:border-primary transition-colors">
                                        <img
                                            src={user.imageUrl}
                                            alt={user.fullName || "User Avatar"}
                                            className="w-full h-full object-cover rounded-sm border border-border"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-sm shadow-lg">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-foreground mb-2 uppercase tracking-tight">
                                        {user.fullName || user.username}
                                    </h2>
                                    <p className="text-primary font-mono text-sm mb-6 flex items-center justify-center md:justify-start gap-2 uppercase tracking-widest">
                                        <Terminal className="w-4 h-4" />
                                        System_User: {user.username || "unset"}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                                        <div className="flex items-center gap-3 p-3 bg-secondary/30 border border-border rounded-sm">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-mono text-muted-foreground">Network_Identity</span>
                                                <span className="text-xs font-mono truncate max-w-[180px]">{user.primaryEmailAddress?.emailAddress}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-secondary/30 border border-border rounded-sm">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-mono text-muted-foreground">Auth_Date</span>
                                                <span className="text-xs font-mono">{new Date(user.createdAt!).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all flex items-center gap-2 rounded-sm shadow-[0_0_20px_rgba(var(--primary),0.2)] w-full justify-center"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        Edit_Credentials
                                    </button>

                                    <SignOutButton redirectUrl="/">
                                        <button className="px-6 py-3 bg-red-950/20 text-red-500 border border-red-900/50 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500/10 transition-all flex items-center gap-2 rounded-sm w-full justify-center">
                                            <LogOut className="w-3 h-3" />
                                            Terminate_Session
                                        </button>
                                    </SignOutButton>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    )
}
