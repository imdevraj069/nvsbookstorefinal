"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import ProductCard from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function ProductHero() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/product");
        const data = await res.data;
        const products = data.data;
        setProducts(products.slice(0, 12));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    <div className="flex flex-col items-center justify-center h-64 w-full gap-2">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary" />
      <p className="text-sm text-muted-foreground">Loading Products...</p>
    </div>;
  }

  return (
    <div className="py-12 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold pl-6">Our Products</h2>
      </div>

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

      <div className="mt-10 flex justify-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/store">View All Products</Link>
        </Button>
      </div>
    </div>
  );
}
