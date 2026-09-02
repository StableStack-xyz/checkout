/**
 * CheckoutSkeleton — 2-column Stripe-style loading skeleton
 * Mirrors the exact layout of the live checkout so there's no layout shift.
 */
export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-white text-[#1a1f36] antialiased">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12 items-stretch overflow-hidden">

        {/* Left: Order Summary skeleton */}
        <div className="lg:col-span-6 flex flex-col bg-[#f8f9fa] min-h-full px-6 py-10 sm:px-12 lg:px-16 lg:py-14 space-y-8">
          {/* Back + merchant */}
          <div className="space-y-4">
            <Bone className="h-4 w-16" />
            <div className="flex items-center gap-3">
              <Bone className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Bone className="h-4 w-32" />
                <Bone className="h-3 w-20" />
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Bone className="h-9 w-40" />
            <Bone className="h-3 w-24" />
          </div>

          {/* Product card */}
          <div className="rounded-2xl border border-[#e6e8eb] bg-white p-5 space-y-3">
            <div className="flex gap-4">
              <Bone className="h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-2/3" />
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-4/5" />
              </div>
            </div>
          </div>

          {/* Subtotal rows */}
          <div className="space-y-3 pt-2 border-t border-[#e6e8eb]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <Bone className="h-3 w-20" />
                <Bone className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Payment form skeleton */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-white px-6 py-10 sm:px-12 lg:px-16 lg:py-14 min-h-full relative z-10 shadow-[-6px_0_25px_-5px_rgba(0,0,0,0.05)]">
          <div className="mx-auto w-full max-w-md space-y-7">
            {/* Contact info */}
            <div className="space-y-3">
              <Bone className="h-4 w-36" />
              <Bone className="h-10 w-full rounded-lg" />
            </div>

            {/* Payment method box */}
            <div className="space-y-3">
              <Bone className="h-4 w-32" />
              <div className="rounded-xl border border-[#e6e8eb] overflow-hidden">
                <div className="p-4 space-y-4 border-b border-[#e6e8eb]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Bone className="h-4 w-4 rounded-full" />
                      <Bone className="h-4 w-32" />
                    </div>
                    <div className="flex gap-1.5">
                      <Bone className="h-5 w-5 rounded-full" />
                      <Bone className="h-5 w-5 rounded-full" />
                    </div>
                  </div>
                  {/* Currency pills */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <Bone className="h-10 rounded-xl" />
                    <Bone className="h-10 rounded-xl" />
                  </div>
                  {/* Network pills */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <Bone className="h-10 rounded-xl" />
                    <Bone className="h-10 rounded-xl" />
                    <Bone className="h-10 rounded-xl" />
                  </div>
                  {/* QR block */}
                  <div className="rounded-xl border border-[#e6e8eb] bg-[#f8f9fa] p-4">
                    <div className="flex gap-4">
                      <Bone className="h-28 w-28 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2.5 pt-1">
                        <Bone className="h-3 w-full" />
                        <Bone className="h-3 w-4/5" />
                        <Bone className="h-8 w-full rounded-lg mt-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <Bone className="h-4 w-4 rounded-full" />
                    <Bone className="h-4 w-48" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pay button */}
            <Bone className="h-12 w-full rounded-xl" />
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-2 pt-4">
            <Bone className="h-3 w-24" />
            <Bone className="h-3 w-12" />
            <Bone className="h-3 w-12" />
          </div>
        </div>

      </div>
    </div>
  )
}

function Bone({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-[#e8eaed] rounded-md animate-pulse ${className}`}
      style={{ animationDuration: '1.6s' }}
    />
  )
}
