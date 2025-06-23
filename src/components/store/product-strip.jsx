// components/store/product-strip.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/store/add-to-cart";
import { Button } from "@/components/ui/button";

export default function ProductStrip({ product }) {
  const {
    _id,
    title,
    description,
    price,
    originalPrice,
    image,
    rating,
    category,
    isDigital,
    stock,
  } = product;

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const isOutOfStock = stock === 0;

  return (
    <div className="flex w-full border border-border lg:rounded-lg overflow-hidden hover:border-primary/50 transition-colors bg-amber-50 dark:bg-secondary">
      {/* Image */}
      <Link
        href={`/store/${_id}`}
        className="w-24 sm:w-40 overflow-clip h-auto relative flex-shrink-0 bg-muted"
      >
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="150px"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/placeholder.svg"
        />
        {isDigital && (
          <div variant="outline" className="absolute h-5 text-primary-foreground text-center w-full bg-gradient-to-b from-gray-500 to-gray-900 bottom-0 text-xs rounded-none">
            Digital
          </div>
        )}
        {discountPercentage > 0 && (
          <Badge
            variant="destructive"
            className="absolute top-0 right-0 text-xs rounded-none rounded-bl-md"
          >
            {discountPercentage}% OFF
          </Badge>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col justify-between flex-1 p-3">
        <div>
          <Link href={`/store/${_id}`}>
            <h3 className="text-sm font-semibold text-primary hover:underline line-clamp-1">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2">
            {description}
          </p>
        </div>
        {/* Price + Cart */}
        <div className="flex justify-between items-center mt-2 w-full">
          {isOutOfStock ? (
            <div className="mt-auto pt-4">
              <span className="text-sm font-semibold text-red-600">
                Out of Stock
              </span>
            </div>
          ) : (
            <div className="mt-auto pt-1 w-full">
              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-sm font-bold text-primary">₹{price}</span>
                {originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{originalPrice}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <AddToCartButton product={product} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
