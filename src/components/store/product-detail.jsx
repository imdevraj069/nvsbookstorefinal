"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Bell, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/store/add-to-cart";
import toast from "react-hot-toast";

export default function ProductDetail({ product }) {
  const [notifying, setNotifying] = useState(false);

  const {
    title,
    price,
    originalPrice,
    description,
    longDescription,
    specifications,
    images,
    image,
    rating,
    reviews,
    category,
    stock,
    isDigital,
    author,
    publisher,
    pages,
    language,
    isbn,
    content,
  } = product;

  const isOutOfStock = stock === 0;
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleNotify = async () => {
    setNotifying(true);
    toast.success("You will be notified!");
    setTimeout(() => setNotifying(false), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative bg-muted rounded-2xl p-6 shadow-md min-h-[400px] sm:min-h-[450px]">
          <Image
            src={images?.[0] || image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain rounded-xl"
          />
          {isDigital && (
            <Badge className="absolute top-4 right-4">Digital</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-4 left-4">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            {category?.slug}
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
            {title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating) ? "fill-current" : "fill-none"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({rating}) • {reviews?.length || 0} Reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 text-3xl font-bold">
            ₹{price}
            {originalPrice && (
              <span className="text-base text-muted-foreground line-through font-medium">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-base">{description}</p>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {author && (
              <div>
                <span className="font-semibold">Author:</span> {author}
              </div>
            )}
            {publisher && (
              <div>
                <span className="font-semibold">Publisher:</span> {publisher}
              </div>
            )}
            {pages && (
              <div>
                <span className="font-semibold">Pages:</span> {pages}
              </div>
            )}
            {language && (
              <div>
                <span className="font-semibold">Language:</span> {language}
              </div>
            )}
            {isbn && (
              <div>
                <span className="font-semibold">ISBN:</span> {isbn}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {!isOutOfStock ? (
              <AddToCartButton product={product} />
            ) : (
              <Button
                size="lg"
                onClick={handleNotify}
                disabled={notifying}
                className="w-full sm:w-auto"
              >
                <Bell className="w-4 h-4 mr-2" />
                {notifying ? "Subscribing..." : "Notify Me"}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: product.title,
                      text: product.description || "Check this out!",
                      url:
                        typeof window !== "undefined"
                          ? window.location.href
                          : "",
                    })
                    .then(() => console.log("Shared successfully"))
                    .catch((err) => console.error("Share failed:", err));
                } else {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => alert("Link copied to clipboard!"))
                    .catch(() => alert("Failed to copy link."));
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          {/* Stock Status */}
          <p
            className={`text-sm font-medium ${
              isOutOfStock ? "text-red-600" : "text-green-600"
            }`}
          >
            {isOutOfStock ? "✗ Out of Stock" : "✓ In Stock"}
          </p>
        </div>
      </div>

      {/* Description Section */}
      {longDescription && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <div
            className="prose dark:prose-invert max-w-none" 
          
            dangerouslySetInnerHTML={{ __html: longDescription }}
          />
        </section>
      )}

      {/* Specifications */}
      {specifications && Object.keys(specifications).length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between py-2 border-b border-border"
              >
                <span className="font-medium">{key}:</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {reviews?.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-border pb-4 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.user}</span>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-current" : "fill-none"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review!
          </p>
        )}
      </section>

      {/* Rich Content (Tiptap HTML) */}
      {content && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Additional Info</h2>
          <div
            className="prose dark:prose-invert max-w-none"
          />
        </section>
      )}
    </div>
  );
}
