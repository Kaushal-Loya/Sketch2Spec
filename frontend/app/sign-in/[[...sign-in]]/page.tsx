import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <SignIn appearance={{
                elements: {
                    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
                    card: 'bg-slate-900 border border-slate-800',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-slate-400',
                    socialButtonsBlockButton: 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white',
                    socialButtonsBlockButtonText: 'text-white',
                    dividerText: 'text-slate-500',
                    formFieldLabel: 'text-slate-300',
                    formFieldInput: 'bg-slate-800 border-slate-700 text-white',
                    footerActionText: 'text-slate-400',
                    footerActionLink: 'text-blue-400 hover:text-blue-300'
                }
            }} />
        </div>
    );
}
