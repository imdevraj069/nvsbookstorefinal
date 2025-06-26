"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import CartItems from "@/components/store/cart-items";
import CartSummary from "@/components/store/cart-summary";
import { useCartStore } from "@/utils/store/useCartStore";
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter()
  const isAuthenticated = !!session;

  // const cartItems = useCartStore((s) => s.cartItems);
  const loadCartFromDB = useCartStore((s) => s.loadCartFromDB);
  const clearCart = useCartStore((s) => s.clearCart);
  const loaded = useCartStore((s) => s.loaded);

  useEffect(() => {
    if (status === "loading") return; // wait for session to load

    if (status === "authenticated" && session?.user) {
      loadCartFromDB();
    } else {
      router.push('/auth');
      clearCart();
    }
  }, [status, session]);

  if (!loaded && isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItems />
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
