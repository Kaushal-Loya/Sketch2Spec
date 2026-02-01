import { NextResponse } from 'next/server'
import { getRecentProviderLogs } from '@/lib/aiLogger'

export async function GET(req: Request) {
  const adminKey = req.headers.get('x-admin-key')
  const expected = process.env.ADMIN_API_KEY
  if (!expected) {
    return NextResponse.json({ error: 'Admin key not configured on server' }, { status: 503 })
  }
  if (!adminKey || adminKey !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const q = new URL(req.url).searchParams.get('count')
  const count = q ? Math.min(Number(q), 200) : 50
  const logs = getRecentProviderLogs(count)
  return NextResponse.json({ logs })
}