// /app/store/store-page-client.jsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import ProductGrid from "@/components/store/product-grid";
import CategoryHeader from "@/components/ui/category-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  SlidersHorizontal,
  X,
  Tag,
  Star,
  ArrowUpDown,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function StorePageClient() {
  const [filters, setFilters] = useState({
    category: "all",
    searchQuery: "",
    priceRange: [0, 500000],
    format: "all",
    sortBy: "latest",
    rating: 0,
    inStock: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/product?type=category");
        const cats = await response.data.data;
        setCategories(cats);
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    const q = searchParams.get("q");
    if (q) {
      setFilters((prev) => ({ ...prev, searchQuery: q }));
    }

    fetchCategories();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    handleFilterChange(
      "category",
      category === "All" ? "all" : category.toLowerCase()
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is already updated via handleFilterChange
  };

  const resetFilters = () => {
    setFilters({
      category: "all",
      searchQuery: "",
      priceRange: [0, 5000],
      format: "all",
      sortBy: "latest",
      rating: 0,
      inStock: true,
    });
    setActiveCategory("All");
  };

  const handleFormatChange = (format) => {
    handleFilterChange("format", format);
  };

  const handleSortChange = (sortBy) => {
    handleFilterChange("sortBy", sortBy);
  };

  return (
    <div className="w-screen px-1 lg:px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CategoryHeader
          title="Our Store"
          description="Books, study materials, Photo Frame, Laptops and many more"
        />
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Search Bar + Buttons */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row sm:items-center gap-3 dark:bg-secondary p-4 rounded-lg shadow-sm"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for books, test series, and more..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              value={filters.searchQuery}
              onChange={(e) =>
                handleFilterChange("searchQuery", e.target.value)
              }
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant={showFilters ? "default" : "outline"}
              className="flex items-center gap-2 flex-1 sm:flex-none"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <X className="h-4 w-4" />
              ) : (
                <SlidersHorizontal className="h-4 w-4" />
              )}
              {showFilters ? "Hide" : "Filters"}
            </Button>
          </div>
        </form>

        {/* Category Buttons */}
        <div className="flex overflow-x-auto lg:flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            size="xs"
            className={`rounded-sm px-4 py-1 text-sm mb-4 ${
              activeCategory === "all"
                ? "bg-red-600 text-white"
                : "text-black"
            }`}
            onClick={() => handleCategoryChange("all")}
          >
            All
          </Button>

          {categories.map((category) => (
            <Button
              key={category._id}
              variant="outline"
              size="xs"
              className={`rounded-sm px-4 py-1 text-sm mb-4 ${
                activeCategory === category.slug
                  ? "bg-red-600 text-white"
                  : "text-black"
              }`}
              onClick={() => handleCategoryChange(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            className="bg-card mt-6 border border-border rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <Label className="block mb-2 text-sm font-medium">
                  Price Range
                </Label>
                <Slider
                  defaultValue={[0, 5000]}
                  max={5000}
                  step={100}
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    handleFilterChange("priceRange", value)
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
              </div>

              {/* Format */}
              <div>
                <Label className="block mb-2 text-sm font-medium">Format</Label>
                <div className="space-y-2">
                  {["all", "digital", "physical"].map((format) => (
                    <div key={format} className="flex items-center space-x-2">
                      <Checkbox
                        id={`format-${format}`}
                        checked={filters.format === format}
                        onCheckedChange={() => handleFormatChange(format)}
                      />
                      <label
                        htmlFor={`format-${format}`}
                        className="text-sm capitalize cursor-pointer"
                      >
                        {format === "all" ? "All Formats" : `${format} Only`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <Label className="block mb-2 text-sm font-medium">
                  Sort By
                </Label>
                <div className="space-y-2">
                  {[
                    { key: "latest", label: "Latest", icon: ArrowUpDown },
                    {
                      key: "price-low",
                      label: "Price: Low to High",
                      icon: Tag,
                    },
                    {
                      key: "price-high",
                      label: "Price: High to Low",
                      icon: Tag,
                    },
                    { key: "rating", label: "Highest Rated", icon: Star },
                  ].map(({ key, label, icon: Icon }) => (
                    <Button
                      key={key}
                      variant={filters.sortBy === key ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleSortChange(key)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-6 pt-4 border-t border-border">
              <Button
                className="w-full sm:w-auto"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Featured Products Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-2 lg:p-4 rounded-t-lg lg:bg-gradient-to-r lg:from-amber-500 lg:to-orange-600">
          <h2 className="text-xl font-semibold text-foreground lg:text-white">
            Our Products
          </h2>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 lg:border lg:border-border lg:rounded-b-lg lg:p-6">
          <ProductGrid
            showPagination={true}
            itemsPerPage={200}
            filters={filters}
          />
        </div>
      </motion.div>
    </div>
  );
}
