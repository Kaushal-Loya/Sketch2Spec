// lib/aiProviders.ts

// ---------------------------------------------
// Retry helper with exponential backoff + jitter
// ---------------------------------------------
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseMs = 400
) {
  let lastErr: any

  for (let i = 0; i < attempts; i++) {
    try {
      console.log(`Attempt ${i + 1}/${attempts}`)
      return await fn()
    } catch (err: any) {
      lastErr = err
      console.error(`Attempt ${i + 1} failed:`, err.message)

      // If it's the last attempt, don't wait
      if (i === attempts - 1) {
        break
      }

      const backoff = baseMs * Math.pow(2, i)
      const jitter = Math.floor(Math.random() * 100)
      const delay = backoff + jitter

      console.log(`Retrying in ${delay}ms...`)
      await new Promise((r) => setTimeout(r, delay))
    }
  }

  console.error('All attempts failed')
  throw lastErr
}

// ---------------------------------------------
// Validation + sanitization helpers
// ---------------------------------------------

function removeMarkdownFences(code: string): string {
  // Try to extract code from within fences first
  const fenceMatch = code.match(/```(?:tsx|typescript|jsx|javascript|react)?\s*\n([\s\S]*?)\n?```/m)
  if (fenceMatch) {
    code = fenceMatch[1]
  }

  // Remove any remaining fences
  code = code.replace(/^```(?:tsx|typescript|jsx|javascript|react)?\s*\n?/gm, '')
  code = code.replace(/\n?```\s*$/gm, '')
  code = code.replace(/```/g, '')

  return code.trim()
}

function looksIncomplete(code: string) {
  const trimmed = code.trim()

  // Must have some basic React/component structure
  // After sanitization, it should have React global or import
  if (!trimmed.includes("React") && !trimmed.includes("react")) {
    return true
  }

  // Must have export default (before sanitization converts it)
  if (!trimmed.includes("export default") && !trimmed.includes("function") && !trimmed.includes("const")) {
    return true
  }

  // Check for balanced braces
  const openBraces = (code.match(/{/g)?.length ?? 0)
  const closeBraces = (code.match(/}/g)?.length ?? 0)

  if (openBraces !== closeBraces) {
    return true
  }

  // Check if code ends abruptly (common incomplete patterns)
  const endsWithIncomplete = /[,{(\[]$/.test(trimmed)
  if (endsWithIncomplete) {
    return true
  }

  // If it has JSX opening tags without closing tags, it's incomplete
  const jsxOpenTags = (code.match(/<[A-Z][A-Za-z0-9]*[^/>]*>/g)?.length ?? 0)
  const jsxCloseTags = (code.match(/<\/[A-Z][A-Za-z0-9]*>/g)?.length ?? 0)
  const jsxSelfClosing = (code.match(/<[A-Z][A-Za-z0-9]*[^>]*\/>/g)?.length ?? 0)

  // Allow some tolerance for nested components
  if (jsxOpenTags > jsxCloseTags + jsxSelfClosing + 3) {
    return true
  }

  return false
}

function sanitizeGeneratedCode(code: string) {
  // Ensure markdown is completely removed
  code = removeMarkdownFences(code)

  // Remove TypeScript syntax that Babel in browser can't handle
  // Remove React.FC, React.FunctionComponent type annotations
  code = code.replace(/:\s*React\.FC\b/g, '')
  code = code.replace(/:\s*React\.FunctionComponent\b/g, '')

  // Remove type annotations from function parameters
  code = code.replace(/\(\s*{\s*([^}]+)\s*}:\s*\{[^}]+\}\s*\)/g, '({ $1 })')

  // Remove 'as const' assertions
  code = code.replace(/\s+as\s+const\b/g, '')

  // Remove ONLY complex preview assignments (conditional/try-catch blocks)
  code = code.replace(
    /if\s*\(\s*typeof\s+window\s*!==\s*["']undefined["']\s*\)\s*\{[\s\S]*?window\.__PREVIEW_COMPONENT__[\s\S]*?\}/g,
    ""
  )

  // Remove stray component name expressions
  code = code.replace(/^[A-Z][A-Za-z0-9_]*;\s*$/gm, "")

  // Remove module system hallucinations
  code = code.replace(/exports\.[\s\S]*$/g, "")
  code = code.replace(/module\.exports[\s\S]*$/g, "")

  // Remove standalone window.__PREVIEW_COMPONENT__ assignments (we'll add it properly)
  code = code.replace(/^window\.__PREVIEW_COMPONENT__\s*=\s*[A-Za-z0-9_]+;\s*$/gm, "")

  // CRITICAL: Replace ES6 imports with UMD globals for browser compatibility
  code = replaceImportsWithGlobals(code)

  return code.trim()
}

function replaceImportsWithGlobals(code: string): string {
  // 1. Extract what's being imported from React
  const reactImports = new Set<string>()
  const reactImportRegex = /import\s+(?:React\s*,?\s*)?(?:\{([^}]+)\})?\s+from\s+['"]react['"]/g

  let match
  while ((match = reactImportRegex.exec(code)) !== null) {
    if (match[1]) {
      match[1].split(',').forEach(s => reactImports.add(s.trim()))
    }
  }

  // 2. Extract what's being imported from Lucide
  const lucideImports = new Set<string>()
  const lucideImportRegex = /import\s+(?:\{([^}]+)\})?\s+from\s+['"]lucide-react['"]/g

  while ((match = lucideImportRegex.exec(code)) !== null) {
    if (match[1]) {
      match[1].split(',').forEach(s => lucideImports.add(s.trim()))
    }
  }

  // 3. UNIVERSAL SCAN: Find any potential Lucide icons used in JSX but not imported
  // Looks for <IconName ... /> pattern
  const jsxIconRegex = /<([A-Z][a-zA-Z0-9]+)/g

  // Also identify what's defined in the code to avoid redeclaring it
  const definedInCode = new Set<string>()
  const definitionRegex = /(?:const|function|class)\s+([A-Z][a-zA-Z0-9]+)/g
  let dMatch
  while ((dMatch = definitionRegex.exec(code)) !== null) {
    definedInCode.add(dMatch[1])
  }

  while ((match = jsxIconRegex.exec(code)) !== null) {
    const tagName = match[1]
    // Filter out:
    // 1. Common React names
    // 2. Things already defined in the generated code itself (to avoid "Identifier already defined")
    if (!['React', 'Fragment', 'Component'].includes(tagName) && !definedInCode.has(tagName)) {
      lucideImports.add(tagName)
    }
  }

  // Final cleanup of lucideImports to remove any empty strings or invalid tokens
  const cleanLucideImports = Array.from(lucideImports)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.includes(' '))

  // 3. Remove ALL import statements (including multi-line)
  // This is critical to prevent Babel from generating 'require' calls
  code = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*/g, '')

  // 4. Add global declarations at the top
  let globals = 'const React = window.React;\n'

  if (reactImports.size > 0) {
    const reactDestructuring = Array.from(reactImports)
      .map(s => s.replace(/\s+as\s+/g, ': '))
      .join(', ')
    globals += `const { ${reactDestructuring} } = React;\n`
  }

  if (cleanLucideImports.length > 0) {
    const lucideDestructuring = cleanLucideImports
      .map(s => s.replace(/\s+as\s+/g, ': '))
      .join(', ')
    // Lucide is typically available as window.Lucide or window.lucide or window.lucideReact in UMD builds
    globals += 'const Lucide = window.Lucide || window.lucide || window.lucideReact || {};\n'
    globals += `const { ${lucideDestructuring} } = Lucide;\n`
  }

  globals += '\n'

  return globals + code
}

function ensurePreviewAssignment(code: string): string {
  // Extract the default export name
  const defaultExportMatch = code.match(/export\s+default\s+(?:function\s+)?([A-Z][A-Za-z0-9_]*)/m)

  if (!defaultExportMatch) {
    throw new Error("No default export found in generated code")
  }

  const componentName = defaultExportMatch[1]

  // Remove the export default statement since we're using globals
  code = code.replace(/export\s+default\s+[A-Z][A-Za-z0-9_]*;?\s*/g, '')

  // Add preview assignment at the end
  const previewAssignment = `\n\nif (typeof window !== 'undefined') {\n  window.__PREVIEW_COMPONENT__ = ${componentName};\n}\n`

  return code + previewAssignment
}

// ----------------------------------------------------
// Gemini (vision-enabled): Image → React UI generation
// ----------------------------------------------------
export async function generateWithGemini(imageUrl: string, model?: string) {
  const API_KEY = process.env.GEMINI_API_KEY
  // Use Gemini 1.5 Flash for best speed/performance balance
  const MODEL = (model && model.startsWith('gemini-')) ? model : (process.env.GEMINI_MODEL || 'gemini-1.5-flash')

  if (!API_KEY) {
    throw new Error(
      'Gemini not configured. Set GEMINI_API_KEY in your environment.'
    )
  }

  const prompt = `You are an expert frontend React developer.

You will be given a screenshot of a web UI. Your task is to recreate it exactly as shown.

ANALYSIS (think step-by-step, but DO NOT output reasoning):
1. Identify all UI elements (headers, sidebars, navigation, content, grids, cards, buttons, inputs)
2. Note layout structure and spacing
3. Observe colors, typography, alignment
4. Determine interactivity requirements

DESIGN GUIDELINES:
- If wireframe: Add professional colors and styling
- If real UI: Match colors and structure precisely
- Use exact visible text from screenshot
- Repeat elements as shown (lists, grids, cards)
- For images/icons: Use simple SVG placeholders or emoji (🏠, 📧, ⚙️, etc.)
- NO external image imports

TECHNICAL REQUIREMENTS:
✓ React with JSX (use regular JavaScript, NOT TypeScript)
✓ NO TypeScript syntax: no 'React.FC', no type annotations, no 'as', no interfaces
✓ Use plain function components: const ComponentName = () => { }
✓ Tailwind CSS (standard classes only - NO arbitrary values like [#hexcode])
✓ Semantic HTML
✓ Complete, valid JSX (all tags closed)
✓ React hooks (useState, useEffect) imported explicitly if needed
✓ Target 150-200 lines total - simplify UI if needed to stay within limit
✓ CRITICAL: Always complete the component - never stop mid-code

INTERACTIVITY:
- Add hover effects where appropriate
- Implement state for forms, toggles, tabs
- Make buttons and links functional within the component

OUTPUT FORMAT (CRITICAL):
1. Start directly with imports (NO markdown fences like typescript or, NO explanations, NO preamble)
2. Write complete component code
3. Export main component as default at the END: export default ComponentName
4. DO NOT add any window.__PREVIEW_COMPONENT__ assignment
5. DO NOT include comments like "// add more items"
6. DO NOT stop early - complete the entire component
7. NEVER wrap your code in markdown code blocks (\''') - output raw code only

EXAMPLE STRUCTURE:
import React, { useState } from 'react'

const Dashboard = () => {
  const [active, setActive] = useState(0)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your UI here */}
    </div>
  )
}

export default Dashboard

Now, recreate the UI from the screenshot following all requirements above.`

  const doFetch = async () => {
    // 1️⃣ Fetch image bytes from Cloudinary
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) {
      throw new Error(
        `Failed to fetch image: ${imgRes.status} ${imgRes.statusText}`
      )
    }

    const mimeType = imgRes.headers.get('content-type') || 'image/png'
    const buffer = Buffer.from(await imgRes.arrayBuffer())
    const base64Image = buffer.toString('base64')

    // 2️⃣ Call Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 16000, // Increased to allow longer components
          topP: 0.95,
          topK: 40,
        },
      }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(
        `Gemini API error: ${res.status} ${res.statusText} - ${body}`
      )
    }

    const json = await res.json()

    let text =
      json?.candidates?.[0]?.content?.parts?.find(
        (p: any) => typeof p.text === 'string'
      )?.text || ''

    return removeMarkdownFences(text)
  }

  return retryWithBackoff(async () => {
    let code = await doFetch()

    // Log the raw output for debugging
    console.log('=== RAW AI OUTPUT ===')
    console.log('Length:', code.length, 'chars')
    console.log('First 800 chars:', code.substring(0, 800))
    console.log('Last 200 chars:', code.slice(-200))
    console.log('Has markdown fences?', code.includes('```'))

    if (looksIncomplete(code)) {
      console.error('Code looks incomplete. Details:')
      console.error('- Has React?', code.includes('React'))
      console.error('- Has export default?', code.includes('export default'))
      console.error('- Open braces:', (code.match(/{/g)?.length ?? 0))
      console.error('- Close braces:', (code.match(/}/g)?.length ?? 0))
      console.error('- Ends with incomplete?', /[,{(\[]$/.test(code.trim()))
      throw new Error("AI output incomplete - retrying")
    }

    code = sanitizeGeneratedCode(code)

    console.log('=== AFTER SANITIZATION ===')
    console.log('First 500 chars:', code.substring(0, 500))

    code = ensurePreviewAssignment(code)

    console.log('=== FINAL CODE ===')
    console.log('Length:', code.length, 'chars')
    console.log('Has window.__PREVIEW_COMPONENT__?', code.includes('window.__PREVIEW_COMPONENT__'))
    console.log('Last 300 chars:', code.slice(-300))

    return code
  })
}