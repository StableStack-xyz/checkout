import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { StableStackWordmark } from '../components/Logo'

export const Route = createFileRoute('/')({
  component: PreviewIndex,
})

const demos = [
  { token: 'demo', label: 'Product Checkout (USDC)', desc: 'Standard e-commerce checkout session with product item', tag: 'Live Session' },
  { token: 'invoice', label: 'Invoice Payment (₦650,000 NGN → USDT)', desc: 'Fiat B2B invoice — line items, locked rate, merchant branding', tag: 'Invoice' },
  { token: 'paid', label: 'Payment Confirmation', desc: 'Instant transaction receipt & verified payment success state', tag: 'Success' },
  { token: 'expired', label: 'Expired Checkout Session', desc: 'Expired payment link state with retry merchant prompt', tag: 'Expired' },
]

function PreviewIndex() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-4 py-12 text-[#1a1f36] antialiased">
      <div className="w-full max-w-xl space-y-8">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8dee4] bg-white px-3 py-1 text-xs font-semibold text-[#687385] shadow-xs">
            <ShieldCheck className="h-4 w-4 text-[#635bff]" />
            <span>Web3 Checkout UI</span>
          </div>
          <StableStackWordmark className="text-2xl" />
          <p className="text-sm text-[#687385] max-w-md leading-relaxed">
            Non-custodial stablecoin checkout & invoicing UI. Select a session state below to preview the responsive 2-column interface.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#d8dee4] bg-white shadow-sm divide-y divide-[#e6e8eb]">
          {demos.map((d) => (
            <Link
              key={d.token}
              to="/pay/$token"
              params={{ token: d.token }}
              className="group flex items-center justify-between gap-4 px-6 py-5 transition-all hover:bg-[#f8f9fa]"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm font-bold text-[#1a1f36] group-hover:text-[#635bff] transition-colors">
                    {d.label}
                  </p>
                  <span className="rounded-full bg-[#f0f2f5] px-2 py-0.5 text-[10px] font-semibold text-[#4f5666]">
                    {d.tag}
                  </span>
                </div>
                <p className="text-xs text-[#687385]">{d.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#a3acb9] transition-transform group-hover:translate-x-1 group-hover:text-[#635bff]" />
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#e6e8eb] bg-white p-4 text-xs text-[#687385] shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Powered by <strong>StableStack</strong> Checkout SDK</span>
          </div>
          <span className="font-mono text-[#8792a2]">/pay/:token</span>
        </div>
      </div>
    </div>
  )
}