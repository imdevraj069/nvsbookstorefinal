"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star, Bell, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/store/add-to-cart";
import toast from "react-hot-toast";

export default function ProductDetail({ product }) {
  const [notifying, setNotifying] = useState(false);
  const [activeImage, setActiveImage] = useState(product.images?.[0] || product.image);
  const thumbnailRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (thumbnailRef.current && !thumbnailRef.current.contains(e.target)) {
        setActiveImage(image);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [image]);

  const handleNotify = async () => {
    setNotifying(true);
    toast.success("You will be notified!");
    setTimeout(() => setNotifying(false), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 text-base">
      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden">
            <Image
              src={activeImage || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain rounded-xl"
            />
            {isDigital && (
              <Badge className="absolute top-3 right-3 text-xs">Digital</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-3 left-3 text-xs"
              >
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {images?.length > 1 && (
            <div
              ref={thumbnailRef}
              className="flex gap-3 overflow-x-auto snap-x scroll-smooth px-1 scrollbar-hide"
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`shrink-0 snap-center w-20 h-20 sm:w-24 sm:h-24 rounded border overflow-hidden ${
                    activeImage === img ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground uppercase tracking-wider">
            {category?.slug}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            {title}
          </h1>

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

          <div className="flex items-center gap-3 text-2xl font-semibold">
            ₹{price}
            {originalPrice && (
              <span className="text-base text-muted-foreground line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">{description}</p>

          {/* Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
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

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
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
                      title,
                      text: description,
                      url: window?.location?.href,
                    })
                    .catch(console.error);
                } else {
                  navigator.clipboard
                    .writeText(window?.location?.href)
                    .then(() => alert("Link copied to clipboard!"))
                    .catch(() => alert("Failed to copy link."));
                }
              }}
            >
              <Share2 className="w-5 h-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          <p
            className={`text-sm font-medium ${
              isOutOfStock ? "text-red-600" : "text-green-600"
            }`}
          >
            {isOutOfStock ? "✗ Out of Stock" : "✓ In Stock"}
          </p>
        </div>
      </div>

      {/* Description */}
      {longDescription && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Description</h2>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: longDescription }}
          />
        </section>
      )}

      {/* Specifications */}
      {specifications && Object.keys(specifications).length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {Object.entries(specifications).map(([key, val]) => (
              <div
                key={key}
                className="flex justify-between py-2 border-b border-border"
              >
                <span className="font-medium">{key}:</span>
                <span className="text-muted-foreground">{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Reviews</h2>
        {reviews?.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="border-b border-border pb-4 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.user}</span>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < r.rating ? "fill-current" : "fill-none"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review!
          </p>
        )}
      </section>

      {/* Additional Content */}
      {content && (
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Additional Info</h2>
          <div className="prose dark:prose-invert max-w-none" />
        </section>
      )}
    </div>
  );
}
