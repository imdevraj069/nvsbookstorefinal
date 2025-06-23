"use client"
import Image from "next/image"
import { useCartStore } from "@/utils/store/useCartStore";

export default function OrderSummary() {
  const cartItems = useCartStore((s) => s.cartItems);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = cartItems.length > 0 ? 0.1 * subtotal : 0;
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal - discount + shipping;

  return (
    <div className="bg-muted/30 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center gap-3">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              width={60}
              height={60}
              className="rounded-md"
            />
            <div className="flex-grow">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <span className="font-semibold">₹{item.price}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(0)}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{discount.toFixed(0)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
