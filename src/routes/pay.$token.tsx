import { createFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { CheckoutPage } from '../components/CheckoutPage'

export const Route = createFileRoute('/pay/$token')({
  component: PayRoute,
})

function PayRoute() {
  const { token } = Route.useParams()
  return (
    <>
      <CheckoutPage token={token} />
      <Toaster position="bottom-center" closeButton toastOptions={{ style: { borderRadius: '14px', background: '#2c1047', color: '#fefcf9' } }} />
    </>
  )
}