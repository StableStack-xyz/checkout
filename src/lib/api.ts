import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { CheckoutSessionPublic } from './types'
import { USE_MOCK, mockSession, mockExpiredSession, mockPaidSession, mockInvoiceSession } from './mock'

const client = axios.create({ baseURL: import.meta.env.VITE_CHECKOUT_API_URL || '/api/checkout' })

function mockByToken(token: string): CheckoutSessionPublic {
  switch (token) {
    case 'expired':
      return mockExpiredSession()
    case 'paid':
      return mockPaidSession()
    case 'invoice':
      return mockInvoiceSession()
    default:
      return { ...mockSession, token }
  }
}

const unwrap = (payload: unknown): CheckoutSessionPublic =>
  (payload as { data?: CheckoutSessionPublic }).data ?? (payload as CheckoutSessionPublic);

export async function getSession(token: string): Promise<CheckoutSessionPublic> {
  if (USE_MOCK) return mockByToken(token)
  // Sessions resolve directly by token. Slugs and invoice ids resolve
  // server-side into a freshly minted session first.
  try {
    const { data } = await client.get(`/public/sessions/${token}`)
    return unwrap(data)
  } catch (err) {
    if (!axios.isAxiosError(err) || err.response?.status !== 404) throw err
  }
  try {
    const { data } = await client.get(`/public/links/${token}`)
    return unwrap(data)
  } catch (err) {
    if (!axios.isAxiosError(err) || err.response?.status !== 404) throw err
  }
  const { data } = await client.get(`/public/invoices/${token}`)
  return unwrap(data)
}

export async function selectNetwork(token: string, currency: string, network: string): Promise<void> {
  if (USE_MOCK) return
  await client.post(`/public/sessions/${token}/select-network`, { currency, network })
}

export function useCheckoutSession(token: string) {
  return useQuery({
    queryKey: ['checkout-session', token],
    queryFn: () => getSession(token),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'open' || status === 'partially_paid' ? 3000 : false
    },
  })
}