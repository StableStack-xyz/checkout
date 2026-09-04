export function formatAmount(value: string | number): string {
  const clean = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''))
  if (isNaN(clean)) return '0.00'
  return clean.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const FIAT_SYMBOLS: Record<string, string> = { NGN: '₦', KES: 'KSh ', ZAR: 'R ' }

export function formatFiat(value: string | number, currency?: string): string {
  const clean = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''))
  if (isNaN(clean)) return '0.00'
  const symbol = currency ? FIAT_SYMBOLS[currency] ?? `${currency} ` : ''
  return `${symbol}${clean.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

export function shortAddress(address: string, head = 6, tail = 6): string {
  if (address.length <= head + tail + 3) return address
  return `${address.slice(0, head)}…${address.slice(-tail)}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}


export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}