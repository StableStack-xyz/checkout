import { useState } from 'react'
import clsx from 'clsx'
import { CreditCard, Wallet } from 'lucide-react'
import type { CheckoutSessionPublic, Currency, NetworkCode } from '../lib/types'
import { NetworkLogo } from './NetworkLogo'
import { CurrencyLogo } from './CurrencyLogo'

interface PayPanelProps {
  session: CheckoutSessionPublic
  currency: Currency
  network: NetworkCode
  countdownMs: number
  onCurrency: (c: Currency) => void
  onNetwork: (n: NetworkCode) => void
}

export function PayPanel({ session, currency, network, onCurrency, onNetwork }: PayPanelProps) {
  const [method, setMethod] = useState<'stablecoin' | 'wallet'>('stablecoin')

  const networksFor = session.networks.find((n) => n.currency === currency)?.networks ?? []

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-[#1a1f36]">Payment method</h2>

      {/* Grouped Radio Container Box */}
      <div className="overflow-hidden rounded-xl border border-[#d8dee4] bg-white shadow-xs">
        {/* Radio Option 1: Crypto / Stablecoin */}
        <div
          className={clsx(
            'border-b border-[#d8dee4] p-4 transition-colors duration-200',
            method === 'stablecoin' ? 'bg-[#fcfdfe]' : 'bg-white hover:bg-[#f8f9fa]'
          )}
        >
          <label
            onClick={() => setMethod('stablecoin')}
            className="flex cursor-pointer items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                  method === 'stablecoin'
                    ? 'border-[#2C1047] bg-[#2C1047]'
                    : 'border-[#a3acb9] bg-white group-hover:border-[#2C1047]'
                )}
              >
                {method === 'stablecoin' && <div className="h-1.5 w-1.5 rounded-full bg-white animate-spring-pop" />}
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#2C1047] transition-transform duration-200 group-hover:scale-110" />
                <span className="text-sm font-semibold text-[#1a1f36]">Pay with Stablecoin</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#687385]">
              <CurrencyLogo currency="USDC" className="h-4 w-4 transition-transform hover:scale-110" />
              <CurrencyLogo currency="USDT" className="h-4 w-4 transition-transform hover:scale-110" />
            </div>
          </label>

          {method === 'stablecoin' && (
            <div className="mt-4 space-y-4 border-t border-[#e6e8eb] pt-4 animate-slide-down">
              {/* Currency Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#4f5666]">Select Currency</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['USDC', 'USDT'] as Currency[]).map((c) => {
                    const available = session.networks.some((n) => n.currency === c)
                    const isSelected = currency === c
                    return (
                      <button
                        key={c}
                        type="button"
                        disabled={!available}
                        onClick={() => onCurrency(c)}
                        className={clsx(
                          'flex items-center justify-center gap-2.5 rounded-xl border p-2.5 text-xs font-bold btn-press tab-transition',
                          isSelected
                            ? 'border-[#2C1047] bg-[#2C1047] text-white shadow-sm ring-1 ring-[#2C1047]'
                            : 'border-[#d8dee4] bg-white text-[#1a1f36] hover:border-[#5D2F77] hover:bg-[#f8f9fa]',
                          !available && 'opacity-40 cursor-not-allowed'
                        )}
                      >
                        <CurrencyLogo currency={c} className="h-5 w-5 shrink-0 transition-transform group-hover:scale-105" />
                        <span>{c}</span>
                        {c === 'USDC' && <span className="text-[10px] font-normal opacity-80">(USD Coin)</span>}
                        {c === 'USDT' && <span className="text-[10px] font-normal opacity-80">(Tether)</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Network Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#4f5666]">Select Network</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {networksFor.map((n) => {
                    const isSelected = network === n.code
                    return (
                      <button
                        key={n.code}
                        type="button"
                        onClick={() => onNetwork(n.code)}
                        className={clsx(
                          'flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-semibold btn-press tab-transition text-left',
                          isSelected
                            ? 'border-[#2C1047] bg-[#2C1047] text-white shadow-sm ring-1 ring-[#2C1047]'
                            : 'border-[#d8dee4] bg-white text-[#1a1f36] hover:border-[#5D2F77] hover:bg-[#f8f9fa]'
                        )}
                      >
                        <NetworkLogo network={n.code} className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                        <span className="truncate">{n.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Radio Option 2: Web3 Wallet */}
        <div
          className={clsx(
            'p-4 transition-colors duration-200',
            method === 'wallet' ? 'bg-[#fcfdfe]' : 'bg-white hover:bg-[#f8f9fa]'
          )}
        >
          <label
            onClick={() => setMethod('wallet')}
            className="flex cursor-pointer items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                  method === 'wallet'
                    ? 'border-[#2C1047] bg-[#2C1047]'
                    : 'border-[#a3acb9] bg-white group-hover:border-[#2C1047]'
                )}
              >
                {method === 'wallet' && <div className="h-1.5 w-1.5 rounded-full bg-white animate-spring-pop" />}
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#2C1047] transition-transform duration-200 group-hover:scale-110" />
                <span className="text-sm font-semibold text-[#1a1f36]">
                  Web3 Wallet (MetaMask / WalletConnect)
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#5D2F77]">Instant</span>
          </label>

          {method === 'wallet' && (
            <div className="mt-3 border-t border-[#e6e8eb] pt-3 text-xs text-[#687385] animate-slide-down">
              Connect your browser wallet to execute automated transaction confirmation.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}