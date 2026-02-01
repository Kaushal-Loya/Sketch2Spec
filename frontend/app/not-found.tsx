import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_100%)]">
            <ShieldAlert className="w-16 h-16 text-primary mb-6 animate-pulse" />
            <h1 className="text-2xl font-bold text-foreground mb-4 font-mono uppercase tracking-[0.2em]">404_NOT_FOUND</h1>
            <p className="text-muted-foreground font-mono text-sm mb-8 uppercase tracking-widest text-center max-w-md">
                The requested sequence could not be located in the central database.
            </p>
            <Link href="/" className="px-8 py-3 bg-primary text-primary-foreground font-bold font-mono text-sm uppercase tracking-widest hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all">
                Return_To_Root
            </Link>
        </div>
    )
}
