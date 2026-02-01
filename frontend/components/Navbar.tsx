"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight, ScanLine } from 'lucide-react'
import { signIn, useSession, signOut } from 'next-auth/react'

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-cyan-900/30 bg-[#030712]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-cyan-950 border border-cyan-800 rounded-sm overflow-hidden group-hover:border-cyan-500 transition-colors">
                        <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <ScanLine className="w-5 h-5 text-cyan-400 relative z-10" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-[0.1em] text-cyan-50 uppercase text-white">Sketch2Spec</span>
                        <span className="text-[10px] text-cyan-600 font-mono tracking-widest leading-none">SYSTEM.V1.2</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    {!session ? (
                        <>
                            <button
                                onClick={() => signIn('google')}
                                className="hidden md:block text-sm font-mono text-cyan-600 hover:text-cyan-400 transition-colors uppercase tracking-widest"
                            >
                                [ Sign_In ]
                            </button>
                            <button
                                onClick={() => signIn('google')}
                                className="group relative px-6 py-2 bg-cyan-950 border border-cyan-800 hover:border-cyan-500 transition-all overflow-hidden rounded-sm"
                            >
                                <div className="absolute inset-0 bg-cyan-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                                <span className="relative z-10 text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                                    Sign_Up <ArrowRight className="w-3 h-3" />
                                </span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="px-6 py-2 bg-cyan-600/10 border border-cyan-500 text-cyan-400 font-mono text-xs hover:bg-cyan-600 hover:text-white transition-all uppercase tracking-widest">
                                ENTER_CONSOLE
                            </Link>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-cyan-400 font-mono">{session.user?.name}</span>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="text-xs font-mono text-cyan-600 hover:text-cyan-400 transition-colors uppercase tracking-widest"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
