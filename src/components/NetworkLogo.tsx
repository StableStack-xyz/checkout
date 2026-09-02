import type { NetworkCode } from '../lib/types'

export function NetworkLogo({ network, className = 'h-5 w-5' }: { network: NetworkCode; className?: string }) {
  switch (network) {
    case 'ethereum':
      return (
        <svg viewBox="0 0 784 1277" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Ethereum">
          <path d="M392.07 0L383.5 29.11V872.82L392.07 881.4L784.13 649.77L392.07 0Z" fill="#62688F" />
          <path d="M392.07 0L0 649.77L392.07 881.4V471.43V0Z" fill="#8A92B2" />
          <path d="M392.07 955.06L387.24 960.92V1271.4L392.07 1276.48L784.37 723.63L392.07 955.06Z" fill="#62688F" />
          <path d="M392.07 1276.48V955.06L0 723.63L392.07 1276.48Z" fill="#8A92B2" />
          <path d="M392.07 881.4L784.13 649.77L392.07 471.43V881.4Z" fill="#454A75" />
          <path d="M0 649.77L392.07 881.4V471.43L0 649.77Z" fill="#62688F" />
        </svg>
      )
    case 'polygon':
      return (
        <svg viewBox="0 0 38 33" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Polygon">
          <path
            d="M29 10.2L20.6 5.3C19.6 4.7 18.4 4.7 17.4 5.3L9 10.2C8 10.8 7.4 11.8 7.4 13V22.7C7.4 23.9 8 24.9 9 25.5L17.4 30.4C18.4 31 19.6 31 20.6 30.4L29 25.5C30 24.9 30.6 23.9 30.6 22.7V13C30.6 11.8 30 10.8 29 10.2Z"
            fill="#8247E5"
          />
          <path
            d="M19 12.8L23.4 15.3V20.4L19 23L14.6 20.4V15.3L19 12.8Z"
            fill="white"
          />
        </svg>
      )
    case 'bsc':
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="BNB Chain">
          <rect width="120" height="120" rx="60" fill="#F0B90B" />
          <path d="M60 26L71.3 37.3L48.7 59.9L37.4 48.6L60 26Z" fill="white" />
          <path d="M82.6 48.6L93.9 59.9L60 93.8L48.7 82.5L82.6 48.6Z" fill="white" />
          <path d="M60 48.7L71.3 60L60 71.3L48.7 60L60 48.7Z" fill="white" />
          <path d="M37.4 71.4L26.1 60.1L37.4 48.8L48.7 60.1L37.4 71.4Z" fill="white" />
          <path d="M82.6 71.4L71.3 60.1L82.6 48.8L93.9 60.1L82.6 71.4Z" fill="white" />
        </svg>
      )
    case 'base':
      return (
        <svg viewBox="0 0 111 111" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Base">
          <circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF" />
          <path
            d="M55.5 89C74 89 89 74 89 55.5C89 37 74 22 55.5 22C37.8 22 23.3 35.7 22.1 53.1H66.2V57.9H22.1C23.3 75.3 37.8 89 55.5 89Z"
            fill="white"
          />
        </svg>
      )
    case 'tron':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="TRON">
          <circle cx="50" cy="50" r="50" fill="#FF060A" />
          <path d="M80 32L24 22L45 80L80 32Z" stroke="white" strokeWidth="6" strokeLinejoin="round" />
          <path d="M45 80L48 50L80 32" stroke="white" strokeWidth="6" strokeLinejoin="round" />
          <path d="M24 22L48 50" stroke="white" strokeWidth="6" />
        </svg>
      )
    default:
      return null
  }
}
