/**
 * 404.tsx — This file exists so TanStack Router's file-based routing
 * can register the /404 path. The actual NotFoundPage component used
 * for unmatched routes is defined in __root.tsx (notFoundComponent).
 *
 * This route simply renders the same 404 UI when /404 is visited directly.
 */
import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { Home, ArrowLeft } from 'lucide-react'
import { StableStackWordmark } from '../components/Logo'

export const Route = createFileRoute('/404')({
  component: NotFoundPage,
})

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found · StableStack</title>
        <meta name="description" content="The payment link you're looking for doesn't exist or has been removed." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] px-4 py-16 text-center">

        {/* Icon bubble */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white border border-[#e6e8eb] shadow-sm">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C1047" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
            <path d="M8 11h6"/>
          </svg>
        </div>

        {/* Error badge */}
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#e6e8eb] bg-white px-3.5 py-1 text-[11px] font-semibold text-[#687385]">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 inline-block" />
          Error 404
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#1a1f36]">
          Page Not Found
        </h1>
        <p className="mt-2.5 max-w-sm text-sm text-[#687385] leading-relaxed">
          This payment link doesn't exist, may have expired, or has already been used.
          Check the URL and try again, or contact the merchant.
        </p>

        <div className="mt-7 flex w-full max-w-xs flex-col gap-2.5">
          <a
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2C1047] py-3.5 px-6 text-sm font-bold text-white shadow-md btn-press hover:bg-[#3e1e68] transition-all"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </a>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#d8dee4] bg-white py-3.5 px-6 text-sm font-semibold text-[#1a1f36] btn-press hover:border-[#a3acb9] hover:bg-[#f8f9fa] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-[#8792a2]">
          <span>Powered by</span>
          <StableStackWordmark className="text-xs" />
        </div>
      </div>
    </>
  )
}
