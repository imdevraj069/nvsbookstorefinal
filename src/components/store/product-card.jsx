import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/store/add-to-cart";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }) {
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
    <div className="group h-full flex flex-col border border-border rounded-lg overflow-hidden transition-colors bg-amber-50 dark:bg-secondary">
      {/* Image */}
      <Link href={`/store/${_id}`} className="block">
        <div className="relative aspect-[5/3] bg-muted">
          <Image
            src={image || "/placeholder.svg?height=200&width=300"}
            alt={title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            // sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy" // 👈 Optional (default is lazy)
            placeholder="blur" // Optional: blur while loading
            blurDataURL="/placeholder.svg" // Optional low-res placeholder
          />
          {isDigital && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Digital
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 relative">
        {/* Category Badge */}
        <div className="absolute top-2 right-2 z-10 text-xs text-white bg-blue-800 px-2 py-1 rounded">
          <Link href={`/notifications/${category?.slug}`}>
            {category?.name}
          </Link>
        </div>

        {/* Rating */}
        {/* <div className="flex items-center mt-1">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) ? "fill-current" : "fill-none"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-2">({rating})</span>
        </div> */}

        {/* Title */}
        <Link href={`/store/${_id}`} className="mt-2">
          <h3 className="text-base font-semibold line-clamp-1 group-hover:text-primary">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {description}
        </p>

        {isOutOfStock ? (
          <div className="mt-auto pt-4">
            <span className="text-sm font-semibold text-red-600">
              Out of Stock
            </span>
          </div>
        ) : (
          <div className="mt-auto pt-4">
            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-lg font-bold text-primary">₹{price}</span>
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
  );
}
