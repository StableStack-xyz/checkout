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
    branding: {
      logoUrl: '/logo.svg',
      accentColor: '#d65a84',
      supportEmail: 'support@aurorastudio.io',
      receiptMessage: 'Thanks for supporting Aurora Studio! Your access is being provisioned now.',
    },
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
    invoice: {
      number: 'INV-2026-0142',
      lineItems: [
        { description: 'Enterprise implementation — Q3', quantity: 1, amount: '500000' },
        { description: 'Dedicated support (3 months)', quantity: 1, amount: '150000' },
      ],
      issuedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      from: {
        name: 'Aurora Studio Ltd.',
        email: 'billing@aurorastudio.io',
        address: '14 Marine Parade, Victoria Island, Lagos, NG',
        taxId: 'RC 1234567',
      },
      to: {
        name: 'Ada Lovelace',
        email: 'ada@lovelace.dev',
        address: '221B Baker Street, Marylebone, London, GB',
      },
      note: 'Please reference INV-2026-0142 in your payment. Thank you for your business!',
      terms: 'Net 14',
    },
    fiat: {
      amount: '650000',
      currency: 'NGN',
      rate: '1529.41',
      rateLabel: '₦1,529.41',
    },
    merchant: {
      name: 'Aurora Studio',
      accent: '#5D2F77',
      branding: {
        logoUrl: '/logo.svg',
        accentColor: '#5D2F77',
        supportEmail: 'billing@aurorastudio.io',
        receiptMessage: 'Thank you — your invoice is now settled. A formal receipt follows by email.',
      },
    },
    product: undefined,
    amount: '425.00',
    currency: 'USDT',
    fee: { percent: '1.00', bearer: 'merchant' },
    total: '425.00',
    customerEmail: 'ada@lovelace.dev',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    networks: [
      { currency: 'USDC', networks: [{ code: 'ethereum', label: 'Ethereum' }, { code: 'polygon', label: 'Polygon' }, { code: 'base', label: 'Base' }] },
      { currency: 'USDT', networks: [{ code: 'ethereum', label: 'Ethereum' }, { code: 'polygon', label: 'Polygon' }, { code: 'bsc', label: 'BNB Chain' }, { code: 'base', label: 'Base' }, { code: 'tron', label: 'TRON' }] },
    ],
  }
}