"use client"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import { cn } from "@/lib/utils"

import Navbar from "@/components/Navbar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLandingPage = pathname === "/"
    const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")
    const isPublicPage = isLandingPage || isAuthPage

    return (
        <div className={cn(
            "flex min-h-screen w-full",
            !isPublicPage && "h-screen overflow-hidden"
        )}>
            {isLandingPage && <Navbar />}
            {!isPublicPage && <Sidebar />}

            <main className={cn(
                "flex-1 relative w-full",
                !isPublicPage && "overflow-auto h-full",
                isLandingPage && "pt-20" // Space only for landing navbar
            )}>
                {isAuthPage && (
                    <div className="absolute top-8 left-8 z-[60]">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-all font-mono uppercase tracking-[0.2em] group"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>
                )}
                {children}
            </main>
        </div>
    )
}
