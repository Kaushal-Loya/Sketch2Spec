import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userEmail = session.user.email;

        // Permanent deletion from database:
        // 1. Delete all generated code associated with this email
        const { error: deleteHistoryError } = await supabaseAdmin
            .from('generated_code')
            .delete()
            .eq('user_id', userEmail);

        if (deleteHistoryError) {
            console.error("ACCOUNT_DELETE: History Purge Failed:", deleteHistoryError);
            return NextResponse.json({ error: "Failed to purge sequence history" }, { status: 500 });
        }

        // Note: Since we are using an external OAuth provider (Google),
        // we cannot "delete" their Google account. 
        // We are deleting all of their footprint in OUR system.

        console.log(`ACCOUNT_DELETE: Data purged for ${userEmail}`);

        return NextResponse.json({ success: true, message: "All system data purged successfully" });
    } catch (err: any) {
        console.error("Account Deletion API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
