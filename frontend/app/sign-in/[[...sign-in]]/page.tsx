'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <button 
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-sm hover:bg-primary/90 transition-all"
            >
                Sign In with Google
            </button>
        </div>
    );
}
