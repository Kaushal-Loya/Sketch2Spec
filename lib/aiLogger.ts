type ProviderLog = {
  id: string
  timestamp: number
  imageUrl?: string
  requestedModel?: string
  provider?: string
  fallbackUsed?: boolean
  success: boolean
  error?: string
}

const MAX_LOGS = 200
const logs: ProviderLog[] = []

export function logProviderEvent(entry: Omit<ProviderLog, 'timestamp' | 'id'> & { id?: string }) {
  const record: ProviderLog = {
    id: entry.id || `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    timestamp: Date.now(),
    imageUrl: entry.imageUrl,
    requestedModel: entry.requestedModel,
    provider: entry.provider,
    fallbackUsed: entry.fallbackUsed,
    success: entry.success,
    error: entry.error,
  }
  logs.unshift(record)
  if (logs.length > MAX_LOGS) logs.pop()
  return record.id
}

export function getRecentProviderLogs(count = 50) {
  return logs.slice(0, Math.min(count, logs.length))
}

export function clearLogs() {
  logs.length = 0
}

export type { ProviderLog }
