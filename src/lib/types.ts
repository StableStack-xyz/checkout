export type Currency = 'USDC' | 'USDT'
export type NetworkCode = 'ethereum' | 'polygon' | 'bsc' | 'base' | 'tron'
export type SessionStatus = 'open' | 'paid' | 'expired' | 'cancelled' | 'partially_paid'
export type FiatCurrency = 'NGN' | 'KES' | 'ZAR'

export interface NetworkOption {
  code: NetworkCode
  label: string
}

export interface InvoiceLineItem {
  description: string
  quantity: number
  amount: string
}

export interface MerchantBranding {
  logoUrl?: string
  accentColor?: string
  supportEmail?: string
  receiptMessage?: string
}

export interface FiatQuote {
  amount: string
  currency: FiatCurrency
  rate: string
  rateLabel: string
}

export interface InvoiceParty {
  name: string
  email?: string
  address?: string
  taxId?: string
}

export interface InvoiceDetail {
  number: string
  lineItems: InvoiceLineItem[]
  issuedAt?: string
  dueDate?: string
  from?: InvoiceParty
  to?: InvoiceParty
  note?: string
  terms?: string
}

export interface CheckoutSessionPublic {
  token: string
  merchant: {
    name: string
    logoUrl?: string
    accent?: string
    branding?: MerchantBranding
  }
  product?: {
    name: string
    description?: string
    imageUrl?: string
    requiresShipping?: boolean
  }
  invoiceNumber?: string
  invoice?: InvoiceDetail
  fiat?: FiatQuote
  collectShipping?: boolean
  amount: string
  currency: Currency
  fee: { percent: string; bearer: 'merchant' | 'customer' } | null
  total: string
  customerEmail?: string
  expiresAt: string
  status: SessionStatus
  networks: { currency: Currency; networks: NetworkOption[] }[]
  payment?: {
    txHash: string
    network: NetworkCode
    confirmedAt: string
  }
}

export interface PaymentAddress {
  currency: Currency
  network: NetworkCode
  address: string
}

export const NETWORK_LABELS: Record<NetworkCode, string> = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  bsc: 'BNB Chain',
  base: 'Base',
  tron: 'TRON',
}