import { useState } from 'react'
import clsx from 'clsx'
import { ArrowLeft, ShieldCheck, ChevronDown, ChevronUp, Package, FileText } from 'lucide-react'
import type { CheckoutSessionPublic, Currency } from '../lib/types'
import { formatAmount } from '../lib/format'
import { MerchantAvatar } from './Logo'

interface OrderSummaryPanelProps {
  session: CheckoutSessionPublic
  totals: { total: string; feeAmount: string | null }
  currency: Currency
}

export function OrderSummaryPanel({
  session,
  totals,
  currency,
}: OrderSummaryPanelProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false)

  return (
    <aside className="flex flex-1 flex-col justify-between bg-[#f8f9fa] p-6 sm:p-10 lg:p-14 h-full min-h-full">
      <div className="space-y-8">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          <p className="text-sm font-medium text-[#687385]">Pay {session.merchant.name}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold tracking-tight text-[#1a1f36]">
              {formatAmount(totals.total)}
            </span>
            <span className="text-lg font-bold text-[#687385]">{currency}</span>
          </div>
        </div>

        {/* Mobile Expand Toggle */}
        <div className="flex items-center justify-between border-t border-[#e6e8eb] pt-4 lg:hidden">
          <span className="text-xs font-medium text-[#687385]">Order details</span>
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-[#635bff]"
          >
            {mobileExpanded ? 'Hide' : 'Show breakdown'}
            {mobileExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Product / Line Item Row (Shown Always on Desktop, Expandable on Mobile) */}
        <div className={clsx('space-y-4 pt-2 lg:block', mobileExpanded ? 'block' : 'hidden lg:block')}>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#e6e8eb] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3.5 min-w-0">
              {session.product?.imageUrl ? (
                <img
                  src={session.product.imageUrl}
                  alt={session.product.name}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover border border-[#e6e8eb]"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f2f5] text-[#1a1f36]">
                  {session.invoiceNumber ? <FileText className="h-6 w-6" /> : <Package className="h-6 w-6" />}
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

          {/* Itemized Breakdown Table */}
          <div className="space-y-2.5 rounded-2xl border border-[#e6e8eb] bg-white p-4 text-xs">
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
            <div className="border-t border-[#e6e8eb] my-2" />
            <div className="flex justify-between text-sm font-bold text-[#1a1f36]">
              <span>Total due</span>
              <span>{formatAmount(totals.total)} {currency}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
