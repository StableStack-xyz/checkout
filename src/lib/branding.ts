import { useEffect } from 'react'
import type { MerchantBranding } from './types'

export const ACCENT_FALLBACK = '#d65a84'

/**
 * Injects the merchant's branding accent as a CSS variable so the whole
 * checkout page (buttons, highlights, spinners) picks it up at runtime —
 * no per-merchant rebuilds.
 */
export function useMerchantBranding(branding?: MerchantBranding) {
  useEffect(() => {
    const accent = branding?.accentColor || ACCENT_FALLBACK
    document.documentElement.style.setProperty('--merchant-accent', accent)
  }, [branding?.accentColor])
}