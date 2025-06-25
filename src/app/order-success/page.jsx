"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return

      try {
        const res = await axios.get(`/api/admin/orders/${orderId}`)

        console.log(res.data)
        if (res.data.success) {
          setOrder(res.data.data)
        } else {
          console.error(res.data.error)
        }
      } catch (err) {
        console.error("Error fetching order:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Loading your order...</h1>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  const { _id, createdAt, price, paymentMethod, items, customerEmail } = order

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />

        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. We’ll process it shortly.
        </p>

        <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono font-semibold">{_id}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Date:</span>
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-semibold">₹{price.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="capitalize">{paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.title || item.product?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} {item.product.isDigital ? "(Digital)" : " "}
                  </p>
                </div>
                <span className="font-semibold">₹{item.product.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard">
              <Package className="h-4 w-4 mr-2" />
              View Order Status
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/store">Continue Shopping</Link>
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            📧 A confirmation email has been sent to {customerEmail}
          </p>
        </div>
      </div>
    </div>
  )
}
