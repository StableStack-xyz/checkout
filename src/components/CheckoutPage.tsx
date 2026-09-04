import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Loader2, Clock, CircleCheck, ExternalLink, Sparkles, ShieldCheck, Check, ArrowRight, RotateCcw, Copy, Radio, ArrowUpRight, AlertTriangle } from 'lucide-react'
import { useCheckoutSession, selectNetwork } from '../lib/api'
import { USE_MOCK, getMockAddress } from '../lib/mock'
import { useMerchantBranding } from '../lib/branding'
import { copyToClipboard, formatAmount } from '../lib/format'
import type { CheckoutSessionPublic, Currency, NetworkCode } from '../lib/types'
import { CustomerInfo } from './CustomerInfo'
import { PayPanel } from './PayPanel'
import { OrderSummaryPanel } from './OrderSummaryPanel'
import { StableStackWordmark } from './Logo'
import { NetworkLogo } from './NetworkLogo'
import { CheckoutSEO } from './CheckoutSEO'
import { CheckoutSkeleton } from './CheckoutSkeleton'

type PaymentFlowState = 'idle' | 'awaiting_confirmation' | 'paid'

function useCountdown(expiresAt?: string): number {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  if (!expiresAt) return 0
  return new Date(expiresAt).getTime() - now
}

function totalFor(session: CheckoutSessionPublic): { total: string; feeAmount: string | null } {
  const amount = Number(session.amount.replace(/,/g, ''))
  if (session.fee && session.fee.bearer === 'customer') {
    const feeAmount = (amount * Number(session.fee.percent)) / 100
    return { total: (amount + feeAmount).toFixed(2), feeAmount: feeAmount.toFixed(2) }
  }
  return { total: amount.toFixed(2), feeAmount: null }
}

export function CheckoutPage({ token }: { token: string }) {
  const { data: session, isLoading, error } = useCheckoutSession(token)
  useMerchantBranding(session?.merchant.branding)
  const [currency, setCurrency] = useState<Currency>('USDC')
  const [network, setNetwork] = useState<NetworkCode>('ethereum')
  const [flowState, setFlowState] = useState<PaymentFlowState>('idle')
  const [customerEmail, setCustomerEmail] = useState(session?.customerEmail ?? '')
  const [emailTouched, setEmailTouched] = useState(false)
  const [simulatedTx, setSimulatedTx] = useState<{ txHash: string; network: NetworkCode; confirmedAt: string } | null>(null)

  const initialized = useRef(false)

  // Reset initialization when token changes
  useEffect(() => {
    initialized.current = false
  }, [token])

  // Hydrate initial currency, network, and email from session only ONCE
  useEffect(() => {
    if (!session || initialized.current) return
    initialized.current = true
    setCurrency(session.currency)
    if (session.customerEmail) setCustomerEmail(session.customerEmail)
    const first = session.networks.find((n) => n.currency === session.currency)?.networks[0]
    if (first) setNetwork(first.code)
  }, [session])

  // React to on-chain paid status from server without resetting user selections
  useEffect(() => {
    if (session?.status === 'paid' && session.payment) {
      setFlowState('paid')
      setSimulatedTx(session.payment)
    }
  }, [session?.status, session?.payment])

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
  const showEmailError = emailTouched && !emailValid

  const countdownMs = useCountdown(session?.expiresAt)
  const countdownExpired = session?.status === 'open' && countdownMs <= 0

  const status = flowState === 'paid' ? 'paid' : session?.status === 'open' && countdownExpired ? 'expired' : session?.status
  const totals = useMemo(() => (session ? totalFor(session) : { total: '0.00', feeAmount: null }), [session])

  if (isLoading) {
    return (
      <>
        <CheckoutSEO />
        <CheckoutSkeleton />
      </>
    )
  }

  if (error || !session) {
    return (
      <StateShell>
        <CheckoutSEO />
        <StateCard icon={<Clock className="h-7 w-7 text-[#687385]" />} title="Checkout not found" caption="This payment link is invalid or has been removed." />
      </StateShell>
    )
  }

  const handleCurrency = (c: Currency) => {
    setCurrency(c)
    const first = session.networks.find((n) => n.currency === c)?.networks[0]
    if (first) {
      setNetwork(first.code)
      selectNetwork(token, c, first.code).catch(() => {})
    }
  }

  const handleNetwork = (n: NetworkCode) => {
    setNetwork(n)
    selectNetwork(token, currency, n).catch(() => {})
  }

  const handleInitiatePayment = () => {
    setFlowState('awaiting_confirmation')
    toast.info('Payment initiated. Listening for on-chain deposit…')
  }

  const handleConfirmPayment = () => {
    const tx = {
      txHash: `0x${[...Array(64)].map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
      network,
      confirmedAt: new Date().toISOString(),
    }
    setSimulatedTx(tx)
    setFlowState('paid')
    toast.success('Payment confirmed on-chain!')
  }

  const address = getMockAddress(currency, network)
  const activeTx = simulatedTx ?? session.payment ?? { txHash: `0x${'ab'.repeat(32)}`, network, confirmedAt: new Date().toISOString() }

  // Determine SEO status key
  const seoStatus = status === 'paid' ? 'paid'
    : status === 'expired' ? 'expired'
    : status === 'cancelled' ? 'cancelled'
    : flowState === 'awaiting_confirmation' ? 'awaiting_confirmation'
    : 'idle'

  return (
    <div className="min-h-screen bg-white text-[#1a1f36] font-body antialiased">
      <CheckoutSEO session={session} status={seoStatus} />
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-screen lg:items-stretch overflow-hidden">
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-6 flex flex-col bg-[#f8f9fa]">
          <OrderSummaryPanel
            session={session}
            totals={totals}
            currency={currency}
            network={network}
            address={address}
          />
        </div>

        {/* Right Column: Framer Motion Step Container */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-white px-5 py-6 sm:px-12 lg:px-16 lg:py-14 lg:min-h-full relative z-10 shadow-[-6px_0_25px_-5px_rgba(0,0,0,0.05)] border-t border-[#e6e8eb] lg:border-t-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={status === 'paid' ? 'paid' : flowState === 'awaiting_confirmation' ? 'awaiting' : status}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-md space-y-6 sm:space-y-7"
            >
              {status === 'paid' ? (
                <>
                  <SuccessCard session={session} tx={activeTx} customerEmail={customerEmail} />
                  {USE_MOCK && (
                    <button
                      type="button"
                      onClick={() => {
                        setFlowState('idle')
                        setSimulatedTx(null)
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#d8dee4] bg-[#f8f9fa] py-2 text-xs font-semibold text-[#687385] btn-press hover:bg-white hover:text-[#1a1f36]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset demo checkout
                    </button>
                  )}
                </>
              ) : flowState === 'awaiting_confirmation' ? (
                <AwaitingConfirmationCard
                  session={session}
                  totals={totals}
                  currency={currency}
                  network={network}
                  address={address}
                  onConfirm={handleConfirmPayment}
                  onCancel={() => setFlowState('idle')}
                />
              ) : status === 'expired' ? (
                <ExpiredCard session={session} />
              ) : status === 'cancelled' ? (
                <CancelledCard session={session} />
              ) : (
                <>
                  <CustomerInfo
                    session={session}
                    email={customerEmail}
                    setEmail={setCustomerEmail}
                    touched={emailTouched}
                    setTouched={setEmailTouched}
                    showError={showEmailError}
                  />

                  <PayPanel
                    session={session}
                    currency={currency}
                    network={network}
                    countdownMs={countdownMs}
                    onCurrency={handleCurrency}
                    onNetwork={handleNetwork}
                  />

                  <div className="space-y-3 pt-2">
                    <PayActionButton
                      amount={formatAmount(totals.total)}
                      currency={currency}
                      emailValid={emailValid}
                      onInitiate={handleInitiatePayment}
                      onInvalidEmail={() => {
                        setEmailTouched(true)
                        const el = document.getElementById('checkout-email')
                        if (el) {
                          el.focus()
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                        toast.error('Please enter a valid email address')
                      }}
                    />

                    {/* One-time address disclaimer */}
                    <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 p-3 text-left">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <p className="text-xs leading-relaxed text-amber-900/90">
                        <strong className="font-semibold text-amber-950">One-time deposit address.</strong> Send the exact amount in a single transaction. Any payment that does not match the amount or is sent after expiry will be lost and cannot be reversed.
                      </p>
                    </div>

                    {USE_MOCK && (
                      <button
                        type="button"
                        onClick={handleInitiatePayment}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#d8dee4] bg-[#f8f9fa] py-2.5 text-xs font-semibold text-[#687385] btn-press hover:bg-white hover:text-[#1a1f36] hover:border-[#a3acb9] transition-all"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-(--merchant-accent)" />
                        Simulate payment flow (Demo)
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <FooterBranding supportEmail={session.merchant.branding?.supportEmail} />
        </div>
      </div>
    </div>
  )
}

function AwaitingConfirmationCard({
  session,
  totals,
  currency,
  network,
  address,
  onConfirm,
  onCancel,
}: {
  session: CheckoutSessionPublic
  totals: { total: string; feeAmount: string | null }
  currency: Currency
  network: NetworkCode
  address: string
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm()
    }, 5500)
    return () => clearTimeout(timer)
  }, [onConfirm])

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="qr-pulse flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f0fb] border border-[#e2d5f2] text-[#2C1047]">
          <Loader2 className="h-8 w-8 animate-spin text-[#2C1047]" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#1a1f36]">Awaiting Confirmation</h1>
          <p className="text-xs font-medium text-[#687385] mt-1">Listening for transaction on the {network.toUpperCase()} network</p>
        </div>
      </div>

      {/* Live Stepper Status */}
      <div className="rounded-2xl border border-[#e6e8eb] bg-[#f8f9fa] p-5 space-y-4 shadow-xs">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1f36]">1. Payment Initiated</p>
              <p className="text-[11px] text-[#687385]">Deposit address generated for {currency}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2C1047] text-white text-xs font-bold animate-pulse">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1f36]">2. Awaiting On-Chain Deposit</p>
              <p className="text-[11px] text-[#687385]">Send {formatAmount(totals.total)} {currency} to deposit address</p>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-50">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#a3acb9] text-[#8792a2] text-xs font-bold">
              3
            </div>
            <div>
              <p className="text-xs font-semibold text-[#687385]">3. Confirmation & Receipt</p>
              <p className="text-[11px] text-[#8792a2]">Instant email receipt dispatch</p>
            </div>
          </div>
        </div>

        {/* Deposit Box Details */}
        <div className="border-t border-[#e6e8eb] pt-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#687385]">
            <span className="flex items-center gap-1.5 font-semibold text-[#1a1f36]">
              <NetworkLogo network={network} className="h-4 w-4" />
              {network.toUpperCase()} Address
            </span>
            <span className="font-mono text-xs text-[#1a1f36] font-bold">{formatAmount(totals.total)} {currency}</span>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (await copyToClipboard(address)) {
                toast.success('Deposit address copied')
              }
            }}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#d8dee4] bg-white px-3 py-2 text-left text-xs font-mono font-medium text-[#1a1f36] hover:border-[#2C1047]"
          >
            <code className="truncate">{address}</code>
            <Copy className="h-3.5 w-3.5 shrink-0 text-[#687385]" />
          </button>
        </div>
      </div>

      {/* Manual Simulation Button */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C1047] py-3.5 px-6 font-display text-sm font-bold text-white shadow-md btn-press hover:bg-[#3e1e68] transition-all"
        >
          <Sparkles className="h-4 w-4 text-(--merchant-accent)" />
          <span>Simulate Instant Confirmation (Demo)</span>
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full text-center text-xs font-medium text-[#687385] hover:text-[#1a1f36] py-1"
        >
          Cancel and return to payment options
        </button>
      </div>
    </div>
  )
}

function SuccessCard({
  session,
  tx,
  customerEmail,
}: {
  session: CheckoutSessionPublic
  tx: { txHash: string; network: NetworkCode; confirmedAt: string }
  customerEmail?: string
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="animate-spring-pop flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
          <CircleCheck className="h-9 w-9" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#1a1f36]">Payment Received</h1>
        <p className="text-sm text-[#687385] max-w-sm">
          {session.merchant.name} has received{' '}
          <strong className="font-bold text-[#1a1f36]">
            {formatAmount(session.total)} {session.currency}
          </strong>
          {session.product && <> for {session.product.name}</>}.
        </p>
      </div>

      {/* Transaction Receipt Table */}
      <div className="rounded-2xl border border-[#e6e8eb] bg-[#f8f9fa] p-5 space-y-3.5 text-xs shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#687385]">Amount Paid</span>
          <span className="font-bold text-[#1a1f36] text-sm">{formatAmount(session.total)} {session.currency}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-[#687385]">Network</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#1a1f36]">
            <NetworkLogo network={tx.network} className="h-4 w-4" />
            <span className="capitalize">{tx.network}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-[#e6e8eb] pt-3">
          <span className="text-[#687385]">Transaction Hash</span>
          <button
            type="button"
            onClick={async () => {
              if (await copyToClipboard(tx.txHash)) {
                toast.success('Transaction hash copied')
              }
            }}
            className="inline-flex max-w-[65%] items-center gap-1.5 font-mono font-medium text-[#5D2F77] hover:underline btn-press"
          >
            <code className="truncate">{tx.txHash.slice(0, 10)}…{tx.txHash.slice(-6)}</code>
            <Copy className="h-3.5 w-3.5 shrink-0 text-[#8792a2]" />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-[#e6e8eb] pt-3 text-[11px] text-[#8792a2]">
          <span>Status</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
            <Check className="h-3.5 w-3.5" /> Confirmed on-chain
          </span>
        </div>
      </div>

      <p className="text-center text-xs text-[#8792a2]">
        A receipt confirmation has been sent to <strong className="text-[#4f5666]">{customerEmail || session.customerEmail || 'your email'}</strong>.
      </p>

      {session.merchant.branding?.receiptMessage && (
        <p className="rounded-xl border border-[#e6e8eb] bg-[#f8f9fa] px-4 py-3 text-center text-xs text-[#687385] leading-relaxed">
          {session.merchant.branding.receiptMessage}
        </p>
      )}

      <button
        type="button"
        onClick={() => toast.info('Returning to merchant website')}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C1047] py-3.5 px-6 font-display text-sm font-bold text-white shadow-md btn-press hover:bg-[#3e1e68] transition-all"
      >
        <span>Return to {session.merchant.name}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function ExpiredCard({ session }: { session: CheckoutSessionPublic }) {
  const supportEmail = session.merchant.branding?.supportEmail
  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spring-pop flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border border-amber-200 text-amber-600 shadow-sm">
          <Clock className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#1a1f36]">Session Expired</h1>
        <p className="text-sm text-[#687385] max-w-sm leading-relaxed">
          This payment session link has expired. Contact <strong className="text-[#1a1f36]">{session.merchant.name}</strong> to request a new payment link.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          if (supportEmail) window.location.href = `mailto:${supportEmail}`
          else toast.info('Contact merchant to request new payment link')
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C1047] py-3.5 px-6 font-display text-sm font-bold text-white shadow-md btn-press hover:bg-[#3e1e68] transition-all"
      >
        <span>Contact {session.merchant.name}</span>
      </button>
    </div>
  )
}

function CancelledCard({ session }: { session: CheckoutSessionPublic }) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spring-pop flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 border border-rose-200 text-rose-600 shadow-sm">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#1a1f36]">Payment Cancelled</h1>
        <p className="text-sm text-[#687385] max-w-sm leading-relaxed">
          This payment link was cancelled by <strong className="text-[#1a1f36]">{session.merchant.name}</strong>.
        </p>
      </div>

      <button
        type="button"
        onClick={() => toast.info('Returning to merchant website')}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C1047] py-3.5 px-6 font-display text-sm font-bold text-white shadow-md btn-press hover:bg-[#3e1e68] transition-all"
      >
        <span>Return to {session.merchant.name}</span>
      </button>
    </div>
  )
}

function StateCard({ icon, title, caption }: { icon: React.ReactNode; title: string; caption: string }) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#d8dee4] bg-white shadow-xl-3">
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f9fa]">{icon}</div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-[#1a1f36]">{title}</h1>
        <p className="mt-2 max-w-[320px] text-sm text-[#687385]">{caption}</p>
      </div>
    </div>
  )
}

function StateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#f8f9fa] px-4 py-10">
      {children}
    </div>
  )
}

function FooterBranding({ supportEmail }: { supportEmail?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-[#8792a2] pt-4">
      <span className="text-[#687385]">Powered by</span>
      <StableStackWordmark className="text-xs" />
      <span className="mx-1 text-[#d8dee4]">|</span>
      <a href="#" className="hover:text-[#1a1f36] transition-colors">Terms</a>
      <a href="#" className="hover:text-[#1a1f36] transition-colors">Privacy</a>
      {supportEmail && (
        <>
          <span className="mx-1 text-[#d8dee4]">|</span>
          <a href={`mailto:${supportEmail}`} className="hover:text-[#1a1f36] transition-colors">
            Support
          </a>
        </>
      )}
    </div>
  )
}

function PayActionButton({
  amount,
  currency,
  emailValid,
  onInitiate,
  onInvalidEmail,
}: {
  amount: string
  currency: Currency
  emailValid: boolean
  onInitiate: () => void
  onInvalidEmail: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!emailValid) {
      onInvalidEmail()
      return
    }
    if (loading) return
    setLoading(true)

    await new Promise((r) => setTimeout(r, 450))
    setLoading(false)
    onInitiate()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#2C1047] py-3.5 px-6 font-display text-sm font-bold text-white shadow-md btn-press hover:bg-[#3e1e68] hover:shadow-lg transition-all duration-200 disabled:opacity-90 cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-(--merchant-accent)" />
          <span>Processing Payment…</span>
        </>
      ) : (
        <>
          <ShieldCheck className="h-4 w-4 text-(--merchant-accent) transition-transform duration-200 group-hover:scale-110" />
          <span>Pay {amount} {currency}</span>
        </>
      )}
    </button>
  )
}