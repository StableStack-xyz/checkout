import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { CheckoutSessionPublic } from './types'
import { USE_MOCK, mockSession, mockExpiredSession, mockPaidSession, mockInvoiceSession } from './mock'

const client = axios.create({ baseURL: '/api/checkout' })

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

export async function getSession(token: string): Promise<CheckoutSessionPublic> {
  if (USE_MOCK) return mockByToken(token)
  const { data } = await client.get<CheckoutSessionPublic>(`/public/sessions/${token}`)
  return data
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