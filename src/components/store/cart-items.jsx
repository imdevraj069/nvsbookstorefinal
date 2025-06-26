import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/utils/store/useCartStore";

export default function CartItems() {
  const cartItems = useCartStore((s) => s.cartItems);
  const increase = useCartStore((s) => s.addToCart);
  const decrease = useCartStore((s) => s.decreaseFromCart);
  const remove = useCartStore((s) => s.removeFromCart);

  const [loadingMap, setLoadingMap] = useState({});

  const setLoading = (id, state) => {
    setLoadingMap((prev) => ({ ...prev, [id]: state }));
  };

  const handleUpdate = async (product, newQty) => {
    const id = product._id;
    setLoading(id, true);
    if (newQty > product.quantity) {
      increase(product);
    } else {
      decrease(product._id);
    }
    setLoading(id, false);
  };

  const handleRemove = async (productId) => {
    setLoading(productId, true);
    remove(productId);
    setLoading(productId, false);
  };

  if (!cartItems.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button asChild>
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item, index) => {
        const id = item._id;
        const isLoading = loadingMap[id];

        return (
          <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              width={80}
              height={80}
              className="rounded-md"
            />

            <div className="flex-grow">
              <Link
                href={`/store/${id}`}
                className="font-semibold hover:text-primary"
              >
                {item.title}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold">₹{item.price}</span>
                {item.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{item.originalPrice}
                  </span>
                )}
                {item.isDigital && (
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    Digital
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!item.isDigital && (
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleUpdate(item, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minus className="h-3 w-3" />}
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleUpdate(item, item.quantity + 1)}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-3 w-3" />}
                  </Button>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleRemove(id)}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
