import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({} as any));
    const { imageUrl, model, allowFallback = true } = body || {};

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    try {
      // Use Gemini only for image-to-code generation (no fallbacks)
      const { logProviderEvent } = await import('@/lib/aiLogger')
      const requestId = logProviderEvent({ imageUrl, requestedModel: model, success: false })

      try {
        const { generateWithGemini } = await import('@/lib/aiProviders')
        const text = await generateWithGemini(imageUrl)
        logProviderEvent({ id: requestId, provider: 'Gemini', fallbackUsed: false, success: true })


        return NextResponse.json({ code: text, provider: 'Gemini', fallbackUsed: false })
      } catch (pErr: any) {
        console.error('Provider Gemini failed:', pErr)
        logProviderEvent({ id: requestId, provider: 'Gemini', fallbackUsed: false, success: false, error: String(pErr?.message ?? pErr) })
        throw pErr
      }
    } catch (err: any) {
      console.error('Provider error', err)
      return NextResponse.json({ error: (err?.message ?? String(err)) }, { status: 502 })
    }

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

