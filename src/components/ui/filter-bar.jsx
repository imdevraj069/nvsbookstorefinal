"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { getUniqueDepartments, getUniqueLocations } from "@/lib/data"

export default function FilterBar({
  categories = [],
  onFilterChange,
  type = "notifications",
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || "All");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [location, setLocation] = useState("All India");
  const [department, setDepartment] = useState("All Departments");
  const [priceRange, setPriceRange] = useState("all");
  const [format, setFormat] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Get unique departments and locations for notifications
  const [departments, setDepartments] = useState(["All Departments"]);
  const [locations, setLocations] = useState(["All India"]);

  useEffect(() => {
    async function fetchFilters() {
      if (type !== "notifications") return;

      try {
        const res = await fetch("/api/notification?type=filter", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (res.ok) {
          const uniqueDepartments = Array.from(
            new Set(["All Departments", ...data.departments])
          );
          const uniqueLocations = Array.from(
            new Set(["All India", ...data.locations])
          );

          setDepartments(uniqueDepartments);
          setLocations(uniqueLocations);
        } else {
          console.error("Failed to fetch filters", data.error);
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    }

    fetchFilters();
  }, [type]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    applyFilters({
      category: category === "All" ? "all" : category.toLowerCase(),
      searchQuery,
      dateRange,
      location: location === "All India" ? "all" : location,
      department: department === "All Departments" ? "all" : department,
      priceRange,
      format,
      sortBy,
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Apply search immediately as user types
    applyFilters({
      category: activeCategory === "All" ? "all" : activeCategory.toLowerCase(),
      searchQuery: value,
      dateRange,
      location: location === "All India" ? "all" : location,
      department: department === "All Departments" ? "all" : department,
      priceRange,
      format,
      sortBy,
    });
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({
      category: activeCategory === "All" ? "all" : activeCategory.toLowerCase(),
      searchQuery,
      dateRange,
      location: location === "All India" ? "all" : location,
      department: department === "All Departments" ? "all" : department,
      priceRange,
      format,
      sortBy,
    });
  };

  // Apply filters function
  const applyFilters = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      category: activeCategory === "All" ? "all" : activeCategory.toLowerCase(),
      searchQuery,
      dateRange,
      location: location === "All India" ? "all" : location,
      department: department === "All Departments" ? "all" : department,
      priceRange,
      format,
      sortBy,
    };

    switch (filterType) {
      case "dateRange":
        setDateRange(value);
        newFilters.dateRange = value;
        break;
      case "location":
        setLocation(value);
        newFilters.location = value === "All India" ? "all" : value;
        break;
      case "department":
        setDepartment(value);
        newFilters.department = value === "All Departments" ? "all" : value;
        break;
      case "priceRange":
        setPriceRange(value);
        newFilters.priceRange = value;
        break;
      case "format":
        setFormat(value);
        newFilters.format = value;
        break;
      case "sortBy":
        setSortBy(value);
        newFilters.sortBy = value;
        break;
    }

    applyFilters(newFilters);
  };

  // Apply initial filters when component mounts
  useEffect(() => {
    applyFilters({
      category: activeCategory === "All" ? "all" : activeCategory.toLowerCase(),
      searchQuery,
      dateRange,
      location: location === "All India" ? "all" : location,
      department: department === "All Departments" ? "all" : department,
      priceRange,
      format,
      sortBy,
    });
  }, []);

  return (
    <div className="mb-8 space-y-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button type="submit" className="sm:w-auto">
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          className="sm:w-auto w-full flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </form>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Additional filters - shown when showFilters is true */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t">
          {/* Date filter - only for notifications */}
          {type === "notifications" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Date Range
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="3months">Last 3 months</option>
              </select>
            </div>
          )}

          {/* Location filter - only for notifications */}
          {type === "notifications" && (
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Department filter - only for notifications */}
          {type === "notifications" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price range filter - only for products */}
          {type === "products" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Price Range
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={priceRange}
                onChange={(e) =>
                  handleFilterChange("priceRange", e.target.value)
                }
              >
                <option value="all">All Prices</option>
                <option value="under500">Under ₹500</option>
                <option value="500to1000">₹500 - ₹1000</option>
                <option value="1000to2000">₹1000 - ₹2000</option>
                <option value="above2000">Above ₹2000</option>
              </select>
            </div>
          )}

          {/* Format filter - only for products */}
          {type === "products" && (
            <div>
              <label className="block text-sm font-medium mb-1">Format</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={format}
                onChange={(e) => handleFilterChange("format", e.target.value)}
              >
                <option value="all">All Formats</option>
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
              </select>
            </div>
          )}

          {/* Sort by filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">Alphabetical (A-Z)</option>
              <option value="za">Alphabetical (Z-A)</option>
              {type === "products" && (
                <>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </>
              )}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
