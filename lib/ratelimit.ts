const store = new Map<string, { count: number; first: number }>()
const WINDOW = 5 * 60 * 60 * 1000
const MAX = 2

export function checkRateLimit(ip: string): { allowed: boolean; resetIn: number } {
  const now = Date.now()
  const rec = store.get(ip)

  if (!rec || now - rec.first >= WINDOW) {
    store.set(ip, { count: 1, first: now })
    return { allowed: true, resetIn: 0 }
  }

  if (rec.count >= MAX) {
    return { allowed: false, resetIn: WINDOW - (now - rec.first) }
  }

  rec.count++
  return { allowed: true, resetIn: 0 }
}
