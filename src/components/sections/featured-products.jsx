"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import ProductCard from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import axios from 'axios';

export default function FeaturedProducts() {
  // Get 4 featured products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/product')
        const data = await res.data;
        const products = data.data
        const featuredProducts = products.filter((product) =>
          product.isFeatured === true
        )
        setProducts(featuredProducts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full gap-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary" />
        <p className="text-sm text-muted-foreground">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-2 bg-gradient-to-tl from-red-600 via-red-400 to-red-800 dark:from-red-800 dark:via-red-900 dark:to-red-950">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-amber-50 lg:text-2xl font-bold px-4">
          Featured Products
        </h2>
        <Button variant="outline" size="sm" asChild className="mr-6">
          <Link href="/store">View All</Link>
        </Button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative w-screen">
        <div className=" overflow-x-auto light-scrollbar scroll-smooth px-2 sm:px-4 lg:px-6">
          <div className="flex gap-2 py-2">
            {products.map((product) => (
            <div
              key={product._id}
              className="w-[280px] sm:w-[300px] max-w-sm flex-shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
