"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import AddToCartButton from "@/components/store/add-to-cart";
import Link from "next/link";

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

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
    inStock,
    isDigital,
    author,
    publisher,
    pages,
    language,
    isbn,
  } = product;

  // Calculate discount percentage if there's an original price
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
          <Image
            src={
              images?.[0] || image || "/placeholder.svg?height=400&width=600"
            }
            alt={title}
            fill
            className="object-contain"
          />
          {isDigital && (
            <Badge variant="secondary" className="absolute top-4 right-4">
              Digital
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-4 left-4">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="text-sm text-muted-foreground mb-2">
            {category.slug}
          </div>
          <h1 className="text-3xl font-bold mb-4">{title}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating) ? "fill-current" : "fill-none"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              ({rating}) {reviews?.length || 0} reviews
            </span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold">₹{price}</span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through ml-3">
                ₹{originalPrice}
              </span>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{description}</p>

          {/* Product Meta */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {author && (
              <div>
                <span className="text-sm font-semibold">Author:</span>
                <p className="text-sm">{author}</p>
              </div>
            )}

            {publisher && (
              <div>
                <span className="text-sm font-semibold">Publisher:</span>
                <p className="text-sm">{publisher}</p>
              </div>
            )}

            {pages && (
              <div>
                <span className="text-sm font-semibold">Pages:</span>
                <p className="text-sm">{pages}</p>
              </div>
            )}

            {language && (
              <div>
                <span className="text-sm font-semibold">Language:</span>
                <p className="text-sm">{language}</p>
              </div>
            )}

            {isbn && (
              <div>
                <span className="text-sm font-semibold">ISBN:</span>
                <p className="text-sm">{isbn}</p>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          {!isDigital && (
            <div className="flex items-center mb-6">
              <span className="text-sm font-semibold mr-4">Quantity:</span>
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-8 w-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button asChild className="w-full mt-3">
              <Link href={`/checkout?productId=${product._id}`}>Buy Now</Link>
            </Button>

            <div className=" border-2 border-red-500 rounded-md flex justify-center items-center">
              {/* <AddToCartButton product={product} /> */}
            </div>

            <Button size="lg" variant="outline" className="sm:w-auto">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {inStock ? (
              <span className="text-green-600 text-sm font-medium">
                ✓ In Stock
              </span>
            ) : (
              <span className="text-red-600 text-sm font-medium">
                ✗ Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose dark:prose-invert max-w-none">
              <p>{longDescription || description}</p>
            </div>
          )}

          {activeTab === "specifications" && specifications && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-b border-border pb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">{review.user}</span>
                      <div className="flex items-center text-yellow-500">
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
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
