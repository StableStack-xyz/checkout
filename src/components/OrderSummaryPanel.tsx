import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShieldCheck, ChevronDown, ChevronUp, Package, FileText, Copy, Check } from 'lucide-react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import type { CheckoutSessionPublic, Currency, NetworkCode } from '../lib/types'
import { NETWORK_LABELS } from '../lib/types'
import { formatAmount, copyToClipboard } from '../lib/format'
import { MerchantAvatar } from './Logo'
import { NetworkLogo } from './NetworkLogo'

interface OrderSummaryPanelProps {
  session: CheckoutSessionPublic
  totals: { total: string; feeAmount: string | null }
  currency: Currency
  network: NetworkCode
  address: string
}

export function OrderSummaryPanel({
  session,
  totals,
  currency,
  network,
  address,
}: OrderSummaryPanelProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (await copyToClipboard(address)) {
      setCopied(true)
      toast.success('Deposit address copied')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <aside className="bg-[#f8f9fa] px-5 py-5 sm:p-8 lg:p-14 lg:h-full lg:flex lg:flex-col lg:justify-between">
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="text-[#687385] hover:text-[#1a1f36] transition-colors"
              title="Return to merchant"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <MerchantAvatar name={session.merchant.name} accent={session.merchant.accent} size="sm" />
              <span className="font-semibold text-sm text-[#1a1f36]">{session.merchant.name}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-[#1a1f36] px-2 py-0.5 text-[11px] font-medium text-white">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            {session.invoiceNumber ? 'Invoice' : 'Sandbox'}
          </span>
        </div>

        {/* Pay Heading */}
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#687385]">Pay {session.merchant.name}</p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1a1f36]">
              {formatAmount(totals.total)}
            </span>
            <span className="text-base sm:text-lg font-bold text-[#687385]">{currency}</span>
          </div>
        </div>

        {/* Deposit Block — always visible at a glance on both mobile and desktop */}
        <DepositBlock
          network={network}
          currency={currency}
          total={totals.total}
          address={address}
          copied={copied}
          onCopy={handleCopy}
        />

        {/* Mobile Expand Toggle for Order details breakdown */}
        <div className="flex items-center justify-between border-t border-[#e6e8eb] pt-3 lg:hidden">
          <span className="text-xs font-medium text-[#687385]">Order details</span>
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-[#635bff]"
          >
            {mobileExpanded ? 'Hide breakdown' : 'Show breakdown'}
            {mobileExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Desktop: always visible line items & totals */}
        <div className="hidden lg:block space-y-3.5 pt-1">
          <LineItems session={session} totals={totals} currency={currency} />
        </div>

        {/* Mobile: animated expand/collapse for line items & breakdown only */}
        <AnimatePresence initial={false}>
          {mobileExpanded && (
            <motion.div
              key="order-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="space-y-3.5 pt-1 pb-1">
                <LineItems session={session} totals={totals} currency={currency} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}

function LineItems({
  session,
  totals,
  currency,
}: {
  session: CheckoutSessionPublic
  totals: { total: string; feeAmount: string | null }
  currency: Currency
}) {
  return (
    <>
      {/* Product card */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#e6e8eb] bg-white p-3.5 sm:p-4 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          {session.product?.imageUrl ? (
            <img
              src={session.product.imageUrl}
              alt={session.product.name}
              className="h-11 w-11 shrink-0 rounded-xl object-cover border border-[#e6e8eb]"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f2f5] text-[#1a1f36]">
              {session.invoiceNumber ? <FileText className="h-5 w-5" /> : <Package className="h-5 w-5" />}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1a1f36] truncate">
              {session.product?.name ?? (session.invoiceNumber ? `Invoice #${session.invoiceNumber}` : 'Payment Item')}
            </p>
            {session.product?.description && (
              <p className="text-xs text-[#687385] line-clamp-1">{session.product.description}</p>
            )}
          </div>
        </div>
        <span className="text-sm font-bold text-[#1a1f36] shrink-0">
          {formatAmount(session.amount)} {currency}
        </span>
      </div>

      {/* Itemized Breakdown */}
      <div className="space-y-2 rounded-2xl border border-[#e6e8eb] bg-white p-3.5 sm:p-4 text-xs">
        <div className="flex justify-between text-[#687385]">
          <span>Subtotal</span>
          <span className="font-semibold text-[#1a1f36]">{formatAmount(session.amount)} {currency}</span>
        </div>
        {session.fee && (
          <div className="flex justify-between text-[#687385]">
            <span>Platform Fee ({session.fee.percent}%)</span>
            <span className="font-semibold text-[#1a1f36]">
              {session.fee.bearer === 'customer' ? `+ ${formatAmount(totals.feeAmount ?? '0')}` : 'Included'} {currency}
            </span>
          </div>
        )}
        <div className="border-t border-[#e6e8eb] my-1.5" />
        <div className="flex justify-between text-sm font-bold text-[#1a1f36]">
          <span>Total due</span>
          <span>{formatAmount(totals.total)} {currency}</span>
        </div>
      </div>
    </>
  )
}

function DepositBlock({
  network,
  currency,
  total,
  address,
  copied,
  onCopy,
}: {
  network: NetworkCode
  currency: Currency
  total: string
  address: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-[#687385]">
        <span className="flex items-center gap-1.5 font-medium text-[#1a1f36]">
          <NetworkLogo network={network} className="h-4 w-4 shrink-0" />
          {NETWORK_LABELS[network]} Network Deposit
        </span>
        <span>
          Exact amount:{' '}
          <strong className="text-[#1a1f36] font-bold">
            {formatAmount(total)} {currency}
          </strong>
        </span>
      </div>

      {/* QR + Address — flat, compact */}
      <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-3 sm:gap-4">
        <div className="qr-pulse shrink-0 rounded-xl p-1.5 bg-white border border-[#e6e8eb]">
          <QRCode value={address} size={102} level="M" fgColor="#2C1047" bgColor="transparent" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5 w-full">
          <p className="text-xs text-[#687385] leading-snug">
            Send <strong>{formatAmount(total)} {currency}</strong> on <strong>{NETWORK_LABELS[network]}</strong> to:
          </p>
          <button
            type="button"
            onClick={onCopy}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#d8dee4] bg-white px-3 py-2 text-left btn-press hover:border-[#2C1047] transition-all"
          >
            <code className="truncate font-mono text-xs text-[#1a1f36] font-semibold">{address}</code>
            {copied ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-600 animate-spring-pop" />
            ) : (
              <Copy className="h-4 w-4 shrink-0 text-[#687385] transition-transform hover:scale-110" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
