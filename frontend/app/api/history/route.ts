import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('generated_code')
            .select('id, title, image_url, created_at, model')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase History Fetch Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error("History API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, current_code, original_code, image_url, model } = await req.json();

        const { data, error } = await supabaseAdmin
            .from('generated_code')
            .insert([{
                user_id: userId,
                title: title || "Untitled Project",
                current_code,
                original_code: original_code || current_code,
                image_url,
                model: model || "gemini-flash-latest"
            }])
            .select()
            .single();

        if (error) {
            console.error("Supabase Project Create Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error("Project Create API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
