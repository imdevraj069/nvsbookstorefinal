"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import CategoryHeader from "@/components/ui/category-header";
import FilterBar from "@/components/ui/filter-bar";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import axios from "axios";

export default function NotificationCategoryPage() {
  const { category } = useParams();
  const router = useRouter();

  const getBadgeVariant = (category) => {
    switch (category.toLowerCase()) {
      case "jobs":
        return "default";
      case "results":
        return "success";
      case "admit-cards":
        return "warning";
      case "admissions":
        return "info";
      case "other":
        return "secondary";
      default:
        return "secondary";
    }
  };
  const getHeaderColor = (category) => {
    switch (category.toLowerCase()) {
      case "jobs":
        return "bg-gradient-to-r from-blue-600 to-blue-800";
      case "results":
        return "bg-gradient-to-r from-green-500 to-green-700";
      case "admit-cards":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "admissions":
        return "bg-gradient-to-r from-sky-500 to-sky-700";
      case "other":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-700";
    }
  };

  const isNotificationNew = (date) => {
    const now = new Date();
    const postedDate = new Date(date);
    const diffInMs = now - postedDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  const [filters, setFilters] = useState({
    category,
    searchQuery: "",
    dateRange: "all",
    location: "all",
    department: "all",
    sortBy: "latest",
  });

  const [allNotifications, setAllNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 18;

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/notification?type=bycategory?category=${category}`);
        const notifications = res.data.data;
        setAllNotifications(notifications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
    setCurrentPage(1);
  }, [category]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Apply filters to notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...allNotifications];

    // Apply search filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchLower) ||
          notification.description.toLowerCase().includes(searchLower) ||
          (notification.department &&
            notification.department.toLowerCase().includes(searchLower))
      );
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case "7days":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(
        (notification) => new Date(notification.date) >= filterDate
      );
    }

    // Apply location filter
    if (filters.location !== "all") {
      filtered = filtered.filter(
        (notification) => notification.location === filters.location
      );
    }

    // Apply department filter
    if (filters.department !== "all") {
      filtered = filtered.filter(
        (notification) => notification.department === filters.department
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "latest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;
  }, [allNotifications, filters]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full gap-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary" />
        <p className="text-sm text-muted-foreground">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="px-4 py-8 container mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CategoryHeader
        title={`Notifications for ${category}`}
        description={`Latest updates for ${category.replace(/-/g, " ")}`}
      />

      <FilterBar
        categories={[]}
        onFilterChange={handleFilterChange}
        type="notifications"
      />

      <div className="mt-6">
        {/* Show filter results info */}
        {filters.searchQuery ||
        filters.dateRange !== "all" ||
        filters.location !== "all" ||
        filters.department !== "all" ? (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Showing {filteredNotifications.length} of{" "}
              {allNotifications.length} notifications
              {filters.searchQuery && ` matching "${filters.searchQuery}"`}
            </p>
          </div>
        ) : null}

        <div className={`p-4 rounded-t-lg ${getHeaderColor(category)}`}>
          <h2 className="text-xl font-semibold text-white">
            Latest {category} Notifications
          </h2>
        </div>

        {paginatedNotifications.length > 0 ? (
          <div className="divide-y divide-border/50">
            {paginatedNotifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="p-4 hover:bg-gray-100 dark:hover:bg-black/10 transition-colors bg-gray-50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={getBadgeVariant(category)}>
                        {category}
                      </Badge>
                      {isNotificationNew(notification.date) && (
                        <Badge variant="destructive" className="animate-pulse">
                          NEW
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(notification.date).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/notification/${notification._id}`}
                      className="hover:underline"
                    >
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                        {notification.title}
                      </h3>
                    </Link>

                    {/* <p className="text-muted-foreground mb-4 line-clamp-2">
                      {notification.description}
                    </p> */}

                    {/* <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {notification.department && (
                          <span className="text-muted-foreground mr-3">
                            <strong>Department:</strong>{" "}
                            {notification.department}
                          </span>
                        )}
                        {notification.location && (
                          <span className="text-muted-foreground">
                            <strong>Location:</strong> {notification.location}
                          </span>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/notification/${notification._id}`}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div> */}
                    
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">
              {allNotifications.length === 0
                ? "No notifications found in this category."
                : "No notifications match your current filters."}
            </p>
            {filteredNotifications.length === 0 &&
              allNotifications.length > 0 && (
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    setFilters({
                      category,
                      searchQuery: "",
                      dateRange: "all",
                      location: "all",
                      department: "all",
                      sortBy: "latest",
                    })
                  }
                >
                  Clear Filters
                </Button>
              )}
            <Button
              variant="link"
              onClick={() => router.push("/notifications")}
            >
              Back to All Notifications
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredNotifications.length > itemsPerPage && (
          <div className="mt-6 flex flex-col items-center">
            <div className="join flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show first 2, current page, and last 2 pages
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
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">
              Showing page {currentPage} of {totalPages} (
              {filteredNotifications.length} total results)
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
