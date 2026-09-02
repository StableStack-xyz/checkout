import type { Currency } from '../lib/types'

export function CurrencyLogo({ currency, className = 'h-5 w-5' }: { currency: Currency; className?: string }) {
  if (currency === 'USDC') {
    return (
      <svg viewBox="0 0 2000 2000" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="USDC">
        <circle cx="1000" cy="1000" r="1000" fill="#2775CA" />
        <path
          d="M1275 1150c0-100-60-140-185-165l-65-15c-70-15-95-30-95-65s30-55 80-55c45 0 75 15 95 45l90-70c-35-50-85-75-150-85V640h-90v100c-115 10-170 80-170 160 0 95 60 135 175 160l65 15c70 15 95 35 95 70s-40 65-90 65c-65 0-105-25-130-65l-95 65c40 70 100 100 185 110v100h90v-100c115-10 175-80 175-170z"
          fill="#FFFFFF"
        />
        <path
          d="M710 1440c-240-80-360-335-280-575 50-155 185-265 345-285v-95c-290 25-500 275-475 565 20 220 180 395 400 440v-105c-15-5-25-10-35-15z"
          fill="#FFFFFF"
        />
        <path
          d="M1290 560c240 80 360 335 280 575-50 155-185 265-345 285v95c290-25 500-275 475-565-20-220-180-395-400-440v105c15 5 25 10 35 15z"
          fill="#FFFFFF"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 2000 2000" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="USDT">
      <circle cx="1000" cy="1000" r="1000" fill="#26A17B" />
      <path
        d="M1270 760h-190v-90h380V520H540v150h380v90H730c-260 0-460 40-460 140s200 140 460 140c60 0 120-10 170-20v360h200V1040c50 10 110 20 170 20 260 0 460-40 460-140s-200-140-460-140zm-270 210c-200 0-350-25-350-65s150-65 350-65 350 25 350 65-150 65-350 65z"
        fill="#FFFFFF"
      />
    </svg>
  )
}
