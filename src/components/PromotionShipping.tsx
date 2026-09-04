import { useState } from 'react'
import { Tag, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { validateMockCoupon } from '../lib/mock'
import { formatAmount } from '../lib/format'
import type { Currency } from '../lib/types'

interface PromotionCodeProps {
  subtotal: number
  currency: Currency
  appliedCode: string | null
  onApply: (code: string, discount: number) => void
  onRemove: () => void
}

export function PromotionCode({ subtotal, currency, appliedCode, onApply, onRemove }: PromotionCodeProps) {
  const [code, setCode] = useState('')
  const [expanded, setExpanded] = useState(false)

  const apply = () => {
    const result = validateMockCoupon(code, subtotal)
    if (!result) {
      toast.error('That code is not valid for this checkout')
      return
    }
    onApply(result.coupon.code, result.discount)
    toast.success(`Code ${result.coupon.code} applied: -${formatAmount(result.discount.toFixed(2))} ${currency}`)
  }

  if (appliedCode) {
    const result = validateMockCoupon(appliedCode, subtotal)
    return (
      <div className="flex items-center justify-between rounded-xl border border-[#e2d5f2] bg-[#f5f0fb] px-3.5 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2C1047]">
          <Tag className="h-3.5 w-3.5 text-(--merchant-accent)" />
          {appliedCode}
          {result && (
            <span className="font-semibold text-[#5D2F77]">−{formatAmount(result.discount.toFixed(2))} {currency}</span>
          )}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-md text-[#5D2F77] hover:bg-[#e2d5f2] transition-colors"
          aria-label="Remove promo code"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-xs font-semibold text-[#5D2F77] hover:text-[#2C1047] transition-colors"
      >
        + Add promotion code
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => { setExpanded(false); setCode('') }}
        className="shrink-0 rounded-md p-1.5 text-[#8792a2] hover:text-[#1a1f36] hover:bg-[#f0f2f5] transition-colors"
        aria-label="Cancel promo code"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => {
          if (e.key === 'Enter') apply()
          if (e.key === 'Escape') { setExpanded(false); setCode('') }
        }}
        placeholder="SAVE10"
        autoFocus
        className="flex-1 rounded-lg border border-[#d8dee4] bg-white px-3 py-2 text-xs font-mono font-semibold text-[#1a1f36] uppercase placeholder:text-[#8792a2] focus:border-[#2C1047] focus:ring-2 focus:ring-[#2C1047]/15 focus:outline-none"
      />
      <button
        type="button"
        onClick={apply}
        className="shrink-0 rounded-lg bg-[#2C1047] px-4 py-2 text-xs font-bold text-white hover:bg-[#3e1e68] transition-colors btn-press"
      >
        Apply
      </button>
    </div>
  )
}

export function ShippingInfo({
  onChange,
}: {
  onChange: (address: Record<string, string>) => void
}) {
  const [form, setForm] = useState({ line1: '', line2: '', city: '', state: '', postalCode: '', country: '' })

  const set = (key: string, value: string) => {
    const next = { ...form, [key]: value }
    setForm(next)
    onChange(next)
  }

  const field = 'w-full rounded-lg border border-[#d8dee4] bg-white px-3 py-2 text-sm text-[#1a1f36] placeholder:text-[#8792a2] focus:border-[#2C1047] focus:ring-2 focus:ring-[#2C1047]/15 focus:outline-none'

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-[#1a1f36]">Shipping address</h2>
      <div className="space-y-2.5">
        <input value={form.line1} onChange={(e) => set('line1', e.target.value)} placeholder="Street address" className={field} />
        <input value={form.line2} onChange={(e) => set('line2', e.target.value)} placeholder="Apt, suite (optional)" className={field} />
        <div className="grid grid-cols-2 gap-2.5">
          <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="City" className={field} />
          <input value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="State" className={field} />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <input value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} placeholder="Postal code" className={field} />
          <input value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Country" className={field} />
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-[#687385]">
        <Check className="h-3.5 w-3.5 text-emerald-600" />
        Your order will be shipped to this address after payment confirms
      </p>
    </div>
  )
}