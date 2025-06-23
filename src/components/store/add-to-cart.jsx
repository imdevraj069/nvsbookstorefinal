"use client";

import { useState } from "react";
import { useCartStore } from "@/utils/store/useCartStore";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

export default function AddToCartButton({ product }) {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    cartItems,
    addToCart,
    decreaseFromCart,
    removeFromCart,
  } = useCartStore();

  const [loading, setLoading] = useState(false);
  const isDigital = product?.isDigital;

  const cartItem = cartItems.find((item) => item._id === product._id);
  const quantity = cartItem?.quantity || 0;
  const isInCart = quantity > 0;

  const handleAdd = () => {
    if (!session?.user) {
      router.push("/auth");
      return;
    }

    setLoading(true);
    try {
      addToCart(product);
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      decreaseFromCart(product._id);
    } catch (err) {
      toast.error("Failed to decrease");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      removeFromCart(product._id);
      toast.success("Removed from cart");
    } catch (err) {
      toast.error("Failed to remove");
    } finally {
      setLoading(false);
    }
  };

  // --- UI Variants ---

  const digitalInCartUI = (
    <Button
      size="sm"
      variant="destructive"
      className="w-full"
      onClick={handleRemove}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Trash2 className="h-4 w-4 mr-2" />
      )}
      Remove from Cart
    </Button>
  );

  const normalCartUI = (
    <div className="flex items-center w-full border border-border rounded-md shadow-sm bg-muted overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrease}
        disabled={loading}
        className="h-9 w-9 border-r border-border rounded-none"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <div className="flex-1 text-center text-sm font-medium">
        {loading ? (
          <Loader2 className="animate-spin h-4 w-4 mx-auto" />
        ) : (
          `${quantity} in Cart`
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleAdd}
        disabled={loading}
        className="h-9 w-9 border-l border-border rounded-none"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );

  const addButtonUI = (
    <Button
      size="sm"
      variant="default"
      className="w-full max-w-[180px] lg:max-w-full"
      onClick={handleAdd}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-2" />
      )}
      Add to Cart
    </Button>
  );

  // --- Final Render ---
  return (
    <>
      {isInCart
        ? isDigital
          ? digitalInCartUI
          : normalCartUI
        : addButtonUI}
    </>
  );
}
