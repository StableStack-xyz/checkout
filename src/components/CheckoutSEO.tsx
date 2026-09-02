import { Helmet } from 'react-helmet-async'
import type { CheckoutSessionPublic } from '../lib/types'
import { formatAmount } from '../lib/format'

interface CheckoutSEOProps {
  session?: CheckoutSessionPublic
  status?: string
}

export function CheckoutSEO({ session, status }: CheckoutSEOProps) {
  const merchant = session?.merchant.name ?? 'StableStack'
  const amount = session ? `${formatAmount(session.total)} ${session.currency}` : ''
  const product = session?.product?.name ?? (session?.invoiceNumber ? `Invoice ${session.invoiceNumber}` : 'Payment')

  const titleMap: Record<string, string> = {
    paid: `Payment Received · ${merchant}`,
    expired: `Session Expired · ${merchant}`,
    cancelled: `Payment Cancelled · ${merchant}`,
    awaiting_confirmation: `Awaiting Confirmation · ${merchant}`,
    idle: `Pay ${amount ? `${amount} · ` : ''}${merchant}`,
  }

  const descriptionMap: Record<string, string> = {
    paid: `Your payment of ${amount} to ${merchant} has been confirmed on-chain.`,
    expired: `This payment link to ${merchant} has expired. Please request a new one.`,
    cancelled: `This payment link to ${merchant} has been cancelled.`,
    awaiting_confirmation: `Waiting for your ${amount} deposit to be confirmed on the blockchain.`,
    idle: `Complete your ${product} payment of ${amount} to ${merchant} securely via StableStack.`,
  }

  const key = status ?? 'idle'
  const title = titleMap[key] ?? titleMap.idle
  const description = descriptionMap[key] ?? descriptionMap.idle

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Prevent search engine indexing of checkout pages */}
      <meta name="robots" content="noindex, nofollow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="StableStack" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Theme color for mobile browser chrome */}
      <meta name="theme-color" content="#2C1047" />
    </Helmet>
  )
}
