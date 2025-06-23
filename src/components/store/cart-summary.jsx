"use client";

import Link from "next/link";
import { useCartStore } from "@/utils/store/useCartStore";
import { Button } from "@/components/ui/button";

export default function CartSummary() {
  const cartItems = useCartStore((s) => s.cartItems);
  const cartCount = useCartStore((s) => s.getCartCount());

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = cartItems.length > 0 ? 0.1 * subtotal : 0;
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal - discount + shipping;

  if (!cartCount > 0) {
    return (
      <div className="bg-muted/30 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button asChild>
            <Link href="/store">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
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

      <Button className="w-full mb-3" asChild>
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>

      <Button variant="outline" className="w-full" asChild>
        <Link href="/store">Continue Shopping</Link>
      </Button>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>• Free shipping on orders above ₹500</p>
        <p>• 30-day return policy</p>
        <p>• Secure payment processing</p>
      </div>
    </div>
  );
}
