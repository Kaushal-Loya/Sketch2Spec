import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const { imageUrl, model, allowFallback = true } = body || {};

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // Prefer provider-specific adapters: Gemini, Llama, Deepseek.
    // If none of the provider configs are present, fall back to a helpful stub.

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

    // Nothing configured — return stub with helpful instructions.
    const generated = `// Generated UI code (stub)\n// Source image: ${imageUrl}\n\n// No AI provider configured for the selected model. To enable direct provider generation, set one of the following in your environment and restart:\n// Gemini: GEMINI_API_KEY (and optionally GEMINI_MODEL)\n// Llama: LLAMA_API_URL and LLAMA_API_KEY\n// Deepseek: DEEPSEEK_API_URL and DEEPSEEK_API_KEY\n\nimport React from 'react';\n\nexport default function GeneratedComponent() {\n  return (\n    <div className=\"p-6 bg-white rounded-lg shadow\">\n      <h2 className=\"text-lg font-semibold\">Generated UI (${model || 'default'})</h2>\n      <p className=\"text-sm text-gray-600 mt-2\">This component is a placeholder because no provider is configured.</p>\n    </div>\n  );\n}\n`;

    return NextResponse.json({ code: generated });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
