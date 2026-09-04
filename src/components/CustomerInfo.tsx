import { useState } from 'react'
import clsx from 'clsx'
import { Plus } from 'lucide-react'
import type { CheckoutSessionPublic } from '../lib/types'

interface CustomerInfoProps {
  session: CheckoutSessionPublic
  email: string
  setEmail: (e: string) => void
  touched: boolean
  setTouched: (t: boolean) => void
  showError: boolean
}

export function CustomerInfo({
  session,
  email,
  setEmail,
  setTouched,
  showError,
}: CustomerInfoProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showOptional, setShowOptional] = useState(false)

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#1a1f36]">Contact information</h2>
        {session.invoiceNumber && (
          <span className="text-xs text-[#687385] font-medium">Invoice recipient</span>
        )}
      </div>

      <div className="space-y-3">
        {/* Email Field (Required) */}
        <div>
          <label htmlFor="checkout-email" className="mb-1 block text-xs font-medium text-[#4f5666]">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="email@example.com"
            className={clsx(
              'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1a1f36] placeholder:text-[#8792a2] transition-all duration-200 shadow-xs focus:outline-none',
              showError
                ? 'border-rose-500 ring-2 ring-rose-500/20'
                : 'border-[#d8dee4] focus:border-[#2C1047] focus:ring-2 focus:ring-[#2C1047]/15'
            )}
          />
          {showError && (
            <p className="mt-1 text-xs font-medium text-rose-500 animate-slide-down">
              Please enter a valid email address
            </p>
          )}
        </div>

        {/* Collapsible Optional Form Fields Toggle */}
        {!showOptional && !name && !phone ? (
          <button
            type="button"
            onClick={() => setShowOptional(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D2F77] hover:text-[#2C1047] transition-colors btn-press pt-0.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add name & phone (optional)</span>
          </button>
        ) : (
          <div className="space-y-3 pt-1 border-t border-[#f0f2f5] animate-slide-down">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8792a2]">Optional Details</span>
              <button
                type="button"
                onClick={() => setShowOptional(false)}
                className="text-xs font-medium text-[#687385] hover:text-[#1a1f36] transition-colors"
              >
                Hide
              </button>
            </div>

            {/* Full Name Field (Optional) */}
            <div>
              <label htmlFor="checkout-name" className="mb-1 block text-xs font-medium text-[#4f5666]">
                Full name <span className="text-[#8792a2] font-normal">(optional)</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-[#d8dee4] bg-white px-3.5 py-2.5 text-sm text-[#1a1f36] placeholder:text-[#8792a2] transition-all duration-200 shadow-xs focus:border-[#2C1047] focus:ring-2 focus:ring-[#2C1047]/15 focus:outline-none"
              />
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="checkout-phone" className="mb-1 block text-xs font-medium text-[#4f5666]">
                Phone number <span className="text-[#8792a2] font-normal">(optional)</span>
              </label>
              <input
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-[#d8dee4] bg-white px-3.5 py-2.5 text-sm text-[#1a1f36] placeholder:text-[#8792a2] transition-all duration-200 shadow-xs focus:border-[#2C1047] focus:ring-2 focus:ring-[#2C1047]/15 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}