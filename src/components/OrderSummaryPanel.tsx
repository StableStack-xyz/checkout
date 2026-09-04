import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShieldCheck, ChevronDown, ChevronUp, Package, FileText, Copy, Check } from 'lucide-react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import type { CheckoutSessionPublic, Currency, NetworkCode } from '../lib/types'
import { NETWORK_LABELS } from '../lib/types'
import { formatAmount, copyToClipboard, formatFiat } from '../lib/format'
import { MerchantAvatar } from './Logo'
import { NetworkLogo } from './NetworkLogo'

interface OrderSummaryPanelProps {
  session: CheckoutSessionPublic
  totals: { total: string; feeAmount: string | null; discountAmount?: string | null; promoCode?: string | null }
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

  const isInvoice = !!session.invoice

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
              {session.merchant.branding?.logoUrl ? (
                <img
                  src={session.merchant.branding.logoUrl}
                  alt={session.merchant.name}
                  className="h-9 w-9 shrink-0 rounded-xl object-contain border border-[#e6e8eb] bg-white p-1"
                />
              ) : (
                <MerchantAvatar name={session.merchant.name} accent={session.merchant.accent} size="sm" />
              )}
              <span className="font-semibold text-sm text-[#1a1f36]">{session.merchant.name}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-[#1a1f36] px-2 py-0.5 text-[11px] font-medium text-white">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            {isInvoice ? 'Invoice' : 'Sandbox'}
          </span>
        </div>

        {/* Amount Heading */}
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#687385]">
            {isInvoice ? `Invoice from ${session.merchant.name}` : `Pay ${session.merchant.name}`}
          </p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1a1f36]">
              {formatAmount(totals.total)}
            </span>
            <span className="text-base sm:text-lg font-bold text-[#687385]">{currency}</span>
          </div>
          {session.fiat && isInvoice && (
            <p className="mt-1 text-xs text-[#8792a2]">
              ≈ {formatFiat(session.fiat.amount, session.fiat.currency)} · Rate: 1 {currency} = {session.fiat.rateLabel} {session.fiat.currency}
            </p>
          )}
        </div>

        {/* Invoice Document */}
        {isInvoice && session.invoice && (
          <InvoiceSheet session={session} currency={currency} />
        )}

        {/* Deposit Block */}
        <DepositBlock
          network={network}
          currency={currency}
          total={totals.total}
          address={address}
          copied={copied}
          onCopy={handleCopy}
        />

        {/* Mobile Expand Toggle — only for standard checkout */}
        {!isInvoice && (
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
        )}

        {/* Desktop: always visible line items & totals (standard checkout only) */}
        {!isInvoice && (
          <div className="hidden lg:block space-y-3.5 pt-1">
            <LineItems session={session} totals={totals} currency={currency} />
          </div>
        )}

        {/* Mobile: animated expand/collapse */}
        <AnimatePresence initial={false}>
          {mobileExpanded && !isInvoice && (
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

// ─── Invoice Document Sheet ───────────────────────────────────────────────────

function InvoiceSheet({ session, currency }: { session: CheckoutSessionPublic; currency: Currency }) {
  const inv = session.invoice!
  const fmt = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  return (
    <div className="rounded-2xl border border-[#e0e4ea] bg-white overflow-hidden shadow-sm">
      {/* Header: invoice number + dates */}
      <div className="px-4 py-3 border-b border-[#f0f2f5] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 shrink-0 text-(--merchant-accent)" />
          <span className="text-xs font-bold text-[#1a1f36] tracking-wide font-mono">{inv.number}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#8792a2]">
          {inv.issuedAt && (
            <span>Issued <strong className="text-[#687385] font-semibold">{fmt(inv.issuedAt)}</strong></span>
          )}
          {inv.dueDate && (
            <span>Due <strong className="text-[#1a1f36] font-semibold">{fmt(inv.dueDate)}</strong></span>
          )}
          {inv.terms && (
            <span className="rounded bg-[#f5f0fb] border border-[#e2d5f2] px-1.5 py-0.5 text-[10px] font-semibold text-[#5D2F77]">
              {inv.terms}
            </span>
          )}
        </div>
      </div>

      {/* From / Bill To */}
      {(inv.from || inv.to) && (
        <div className="grid grid-cols-2 border-b border-[#f0f2f5]">
          {inv.from && (
            <div className="px-4 py-3.5 border-r border-[#f0f2f5]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3acb9] mb-1.5">From</p>
              <p className="text-xs font-bold text-[#1a1f36] leading-snug">{inv.from.name}</p>
              {inv.from.email && <p className="mt-0.5 text-[11px] text-[#687385]">{inv.from.email}</p>}
              {inv.from.address && (
                <p className="mt-0.5 text-[11px] text-[#8792a2] leading-relaxed">{inv.from.address}</p>
              )}
              {inv.from.taxId && (
                <p className="mt-1 text-[10px] font-mono text-[#a3acb9]">{inv.from.taxId}</p>
              )}
            </div>
          )}
          {inv.to && (
            <div className="px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3acb9] mb-1.5">Bill to</p>
              <p className="text-xs font-bold text-[#1a1f36] leading-snug">{inv.to.name}</p>
              {inv.to.email && <p className="mt-0.5 text-[11px] text-[#687385]">{inv.to.email}</p>}
              {inv.to.address && (
                <p className="mt-0.5 text-[11px] text-[#8792a2] leading-relaxed">{inv.to.address}</p>
              )}
              {inv.to.taxId && (
                <p className="mt-1 text-[10px] font-mono text-[#a3acb9]">{inv.to.taxId}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Line Items Table */}
      {inv.lineItems.length > 0 && (
        <div className="border-b border-[#f0f2f5]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2 bg-[#fafbfc] border-b border-[#f0f2f5]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3acb9]">Description</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3acb9] text-right">Qty</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3acb9] text-right">Amount</span>
          </div>
          {inv.lineItems.map((item, i) => {
            const lineTotal = Number(item.amount) * item.quantity
            return (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-3 border-b border-[#f0f2f5] last:border-0"
              >
                <p className="text-xs font-semibold text-[#1a1f36] leading-snug">{item.description}</p>
                <p className="text-xs text-[#8792a2] text-right tabular-nums">{item.quantity}</p>
                <p className="text-xs font-bold text-[#1a1f36] text-right tabular-nums shrink-0">
                  {formatFiat(String(lineTotal), session.fiat?.currency)}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Totals */}
      <div className="px-4 py-3 space-y-1.5">
        {session.fiat && (
          <div className="flex items-center justify-between text-xs text-[#687385]">
            <span>Subtotal</span>
            <span className="font-semibold text-[#1a1f36] tabular-nums">
              {formatFiat(session.fiat.amount, session.fiat.currency)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-[#687385]">
          <span>Crypto equivalent</span>
          <span className="font-semibold text-[#1a1f36] tabular-nums">
            {formatAmount(session.amount)} {currency}
          </span>
        </div>
        <div className="pt-2 border-t border-[#f0f2f5] flex items-center justify-between">
          <span className="text-xs font-bold text-[#1a1f36]">Total due</span>
          <span className="text-sm font-extrabold text-[#1a1f36] tabular-nums">
            {formatAmount(session.total ?? session.amount)} {currency}
          </span>
        </div>
      </div>

      {/* Note */}
      {inv.note && (
        <div className="px-4 py-3 border-t border-[#f0f2f5] bg-[#fafbfc]">
          <p className="text-[11px] italic leading-relaxed text-[#8792a2]">{inv.note}</p>
        </div>
      )}
    </div>
  )
}

// ─── Standard Product Line Items ──────────────────────────────────────────────

function LineItems({
  session,
  totals,
  currency,
}: {
  session: CheckoutSessionPublic
  totals: { total: string; feeAmount: string | null; discountAmount?: string | null; promoCode?: string | null }
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
              <Package className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1a1f36] truncate">{session.product?.name ?? 'Payment Item'}</p>
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
        {totals.discountAmount && Number(totals.discountAmount) > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span className="font-semibold">Discount{totals.promoCode ? ` (${totals.promoCode})` : ''}</span>
            <span className="font-semibold">
              - {formatAmount(totals.discountAmount)} {currency}
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
