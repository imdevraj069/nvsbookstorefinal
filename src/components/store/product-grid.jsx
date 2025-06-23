"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductStrip from "@/components/store/product-strip"
import axios from "axios";

export default function ProductGrid({
  category = "all",
  showPagination = false,
  itemsPerPage = 12,
  filters = null,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local search utility
  const searchMatch = (text, query) =>
    typeof text === "string" && typeof query === "string"
      ? text.toLowerCase().includes(query.toLowerCase())
      : false;

  // Local filter logic
  const applyFilterLogic = (products, {
    category = "all",
    priceRange = [0, 5000],
    format = "all",
    searchQuery = "",
    sortBy = "latest",
  }) => {
    let filtered = [...products];

    if (category !== "all") {
      filtered = filtered.filter(
        (p) => p.category.slug?.toLowerCase() === category.toLowerCase()
      );
    }

    if (Array.isArray(priceRange) && priceRange.length === 2) {
      filtered = filtered.filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
      );
    }

    if (format !== "all") {
      filtered = filtered.filter((p) =>
        format === "digital" ? p.isDigital : !p.isDigital
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          searchMatch(p.title.toLowerCase() || "", searchQuery) ||
          searchMatch(p.description.toLowerCase() || "", searchQuery) ||
          searchMatch(p.category.slug || "", searchQuery) ||
          searchMatch(p.author || "", searchQuery) ||
          searchMatch(p.publisher || "", searchQuery)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.createdAt?.localeCompare(a.createdAt || "") || 0;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/product');
        const data = await res.data.data
        setAllProducts(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (filters && allProducts.length > 0) {
      setFilteredProducts(applyFilterLogic(allProducts, filters));
    } else {
      setFilteredProducts(allProducts);
    }
  }, [filters, allProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-red-500">Error: {error}</div>
    );
  }

  return (
    <div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 lg:border lg:border-dashed lg:border-border lg:rounded-lg">
          <p className="text-muted-foreground">
            No products found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6">
          {paginatedProducts.map((product) => (
            <div key={product._id}>
              <div className="block md:hidden">
                <ProductStrip product={product} />
              </div>
              <div className="hidden md:block">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            </span>{" "}
            of <span className="font-medium">{filteredProducts.length}</span>{" "}
            products
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={i}
                    variant={
                      currentPage === pageNum ? "default" : "outline"
                    }
                    size="icon"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
