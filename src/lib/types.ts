export type Currency = 'USDC' | 'USDT'
export type NetworkCode = 'ethereum' | 'polygon' | 'bsc' | 'base' | 'tron'
export type SessionStatus = 'open' | 'paid' | 'expired' | 'cancelled' | 'partially_paid'

export interface NetworkOption {
  code: NetworkCode
  label: string
}

export interface CheckoutSessionPublic {
  token: string
  merchant: {
    name: string
    logoUrl?: string
    accent?: string
  }
  product?: {
    name: string
    description?: string
    imageUrl?: string
  }
  invoiceNumber?: string
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