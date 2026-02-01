export function extractComponentName(code: string): string {
  if (!code) return ''
  const lines = code.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const last = lines.length ? lines[lines.length - 1] : ''

  const lastPatterns = [
    /export\s+default\s+function\s+([A-Za-z0-9_]+)/,
    /export\s+default\s+class\s+([A-Za-z0-9_]+)/,
    /export\s+default\s+([A-Za-z0-9_]+)\s*;?$/,
    /export\s*\{\s*([A-Za-z0-9_]+)\s*as\s*default\s*\}/,
  ]

  for (const re of lastPatterns) {
    const m = last.match(re)
    if (m && m[1]) return m[1]
  }

  // Fallback: scan whole file for typical named declarations
  const scanPatterns = [
    /export\s+default\s+function\s+([A-Za-z0-9_]+)/,
    /export\s+default\s+class\s+([A-Za-z0-9_]+)/,
    /export\s*\{\s*([A-Za-z0-9_]+)\s*as\s*default\s*\}/,
    /function\s+([A-Za-z0-9_]+)\s*\(/,
    /class\s+([A-Za-z0-9_]+)\s*/,
    /const\s+([A-Za-z0-9_]+)\s*=\s*\([^)]*\)\s*=>/,
    /const\s+([A-Za-z0-9_]+)\s*=\s*\(/,
    /const\s+([A-Za-z0-9_]+)\s*=\s*function\s*\(/,
  ]

  for (const re of scanPatterns) {
    const m = code.match(re)
    if (m && m[1]) return m[1]
  }
  return ''
}
