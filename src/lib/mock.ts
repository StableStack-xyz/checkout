import type { CheckoutSessionPublic, Currency, NetworkCode, PaymentAddress } from './types'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const evmAddress = (seed: number) =>
  `0x${[...Array(40)].map((_, i) => '0123456789abcdef'[(seed * 7 + i * 13) % 16]).join('')}`
const tronAddress = 'TQ8R6QnQvYYYqDqQWJkXjYh4ZQmYz9Wf6K'

export const mockAddresses: PaymentAddress[] = [
  { currency: 'USDC', network: 'ethereum', address: evmAddress(1) },
  { currency: 'USDC', network: 'polygon', address: evmAddress(2) },
  { currency: 'USDC', network: 'base', address: evmAddress(3) },
  { currency: 'USDT', network: 'ethereum', address: evmAddress(4) },
  { currency: 'USDT', network: 'polygon', address: evmAddress(5) },
  { currency: 'USDT', network: 'bsc', address: evmAddress(6) },
  { currency: 'USDT', network: 'base', address: evmAddress(7) },
  { currency: 'USDT', network: 'tron', address: tronAddress },
]

export function getMockAddress(currency: Currency, network: NetworkCode): string {
  return mockAddresses.find((a) => a.currency === currency && a.network === network)?.address ?? evmAddress(9)
}

export const mockSession: CheckoutSessionPublic = {
  token: 'demo',
  merchant: {
    name: 'Aurora Studio',
    accent: '#d65a84',
  },
  product: {
    name: 'Lumen Pro — Annual',
    description: 'Full access to the Lumen Pro workspace, analytics, and priority support for 12 months.',
  },
  amount: '120.00',
  currency: 'USDC',
  fee: { percent: '1.00', bearer: 'customer' },
  total: '121.20',
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  status: 'open',
  networks: [
    { currency: 'USDC', networks: [{ code: 'ethereum', label: 'Ethereum' }, { code: 'polygon', label: 'Polygon' }, { code: 'base', label: 'Base' }] },
    { currency: 'USDT', networks: [{ code: 'ethereum', label: 'Ethereum' }, { code: 'polygon', label: 'Polygon' }, { code: 'bsc', label: 'BNB Chain' }, { code: 'base', label: 'Base' }, { code: 'tron', label: 'TRON' }] },
  ],
}

export function mockExpiredSession(): CheckoutSessionPublic {
  return { ...mockSession, token: 'expired', status: 'expired', expiresAt: new Date(Date.now() - 60_000).toISOString() }
}

export function mockPaidSession(): CheckoutSessionPublic {
  return {
    ...mockSession,
    token: 'paid',
    status: 'paid',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    payment: { txHash: `0x${'ab'.repeat(32)}`, network: 'ethereum', confirmedAt: new Date().toISOString() },
  }
}

export function mockInvoiceSession(): CheckoutSessionPublic {
  return {
    ...mockSession,
    token: 'invoice',
    invoiceNumber: 'INV-2026-0142',
    merchant: { name: 'Aurora Studio', accent: '#d65a84' },
    product: undefined,
    amount: '4,250.00',
    currency: 'USDT',
    fee: { percent: '1.00', bearer: 'merchant' },
    total: '4,250.00',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    networks: [
      { currency: 'USDC', networks: [{ code: 'ethereum', label: 'Ethereum' }, { code: 'polygon', label: 'Polygon' }, { code: 'base', label: 'Base' }] },
      { currency: 'USDT', networks: [{ code: 'ethereum', label: 'Ethereum' }, { code: 'polygon', label: 'Polygon' }, { code: 'bsc', label: 'BNB Chain' }, { code: 'base', label: 'Base' }, { code: 'tron', label: 'TRON' }] },
    ],
  }
}