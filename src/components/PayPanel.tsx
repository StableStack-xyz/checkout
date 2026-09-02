import { useState } from 'react'
import clsx from 'clsx'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import { Copy, Check, CreditCard, Wallet } from 'lucide-react'
import type { CheckoutSessionPublic, Currency, NetworkCode } from '../lib/types'
import { NETWORK_LABELS } from '../lib/types'
import { getMockAddress } from '../lib/mock'
import { formatAmount, copyToClipboard } from '../lib/format'
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
  const [copied, setCopied] = useState(false)
  const [method, setMethod] = useState<'stablecoin' | 'wallet'>('stablecoin')

  const networksFor = session.networks.find((n) => n.currency === currency)?.networks ?? []
  const address = getMockAddress(currency, network)

  const handleCopy = async () => {
    if (await copyToClipboard(address)) {
      setCopied(true)
      toast.success('Deposit address copied')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-[#1a1f36]">Payment method</h2>

      {/* Grouped Radio Container Box */}
      <div className="overflow-hidden rounded-xl border border-[#d8dee4] bg-white shadow-xs">
        {/* Radio Option 1: Crypto / Stablecoin (Selected) */}
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
              {/* Radio Indicator */}
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
                <span className="text-sm font-semibold text-[#1a1f36]">
                  Pay with Stablecoin
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#687385]">
              <CurrencyLogo currency="USDC" className="h-4 w-4 transition-transform hover:scale-110" />
              <CurrencyLogo currency="USDT" className="h-4 w-4 transition-transform hover:scale-110" />
            </div>
          </label>

          {/* Form Content inside Selected Payment Method */}
          {method === 'stablecoin' && (
            <div className="mt-4 space-y-4 border-t border-[#e6e8eb] pt-4 animate-slide-down">
              {/* Currency Selector (USDC vs USDT) */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#4f5666]">
                  Select Currency
                </label>
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

              {/* Network Logo Pill Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#4f5666]">
                  Select Network
                </label>
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

              {/* QR & Deposit Address Block */}
              <div className="rounded-xl border border-[#e6e8eb] bg-[#f8f9fa] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#687385]">
                  <span className="flex items-center gap-1.5 font-medium text-[#1a1f36]">
                    <NetworkLogo network={network} className="h-4 w-4 shrink-0" />
                    {NETWORK_LABELS[network]} Network Deposit
                  </span>
                  <span>Exact amount: <strong className="text-[#1a1f36] font-bold">{formatAmount(session.total)} {currency}</strong></span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-lg border border-[#e6e8eb] shadow-xs">
                  <div className="qr-pulse shrink-0 rounded-lg p-1.5 bg-white border border-[#e6e8eb]">
                    <QRCode value={address} size={110} level="M" fgColor="#2C1047" bgColor="transparent" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-2 w-full">
                    <p className="text-xs text-[#687385] leading-snug">
                      Send <strong>{formatAmount(session.total)} {currency}</strong> on <strong>{NETWORK_LABELS[network]}</strong> to:
                    </p>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#d8dee4] bg-[#f8f9fa] px-3 py-2 text-left btn-press hover:border-[#2C1047] transition-all"
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
            </div>
          )}
        </div>

        {/* Radio Option 2: Web3 Wallet / Express Connect */}
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