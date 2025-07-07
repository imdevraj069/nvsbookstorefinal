import CheckoutForm from "@/components/store/checkout-form"
import OrderSummary from "@/components/store/order-summary"

export const metadata = {
  title: "Checkout - Nvs Book Store",
  description: "Complete your purchase",
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
