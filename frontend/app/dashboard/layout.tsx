import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "./_components/Sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
