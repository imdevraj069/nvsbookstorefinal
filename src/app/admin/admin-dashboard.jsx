"use client";

// Core React imports
import { useState, useEffect } from "react";
import OverviewTab from "@/components/admin/overview"
import NotificationsTab from "@/components/admin/notificationTab"
import ProductTab from "@/components/admin/productTab"
import OrdersAdmin from "../../components/admin/order-admin";

export default function AdminDashboard() {
  // Common state
  const [activeTab, setActiveTab] = useState("overview");

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "notifications", label: "Notifications" },
    { id: "products", label: "Products" },
    { id: "users", label: "Users" },
    { id: "orders", label: "Orders" },
  ];

  // ==================== OVERVIEW TAB ====================
  // Overview constants

  // Overview stats (depends on notifications and products)


  // ==================== NOTIFICATIONS TAB ====================

  // ==================== NOTIFICATIONS TAB ====================
  // Notifications state

  // Notifications handlers
  

  // ============================================================= PRODUCTS TAB =============================================================
  // Products handlers (to be implemented)
  // Add product-related handlers here when needed

  // ==================== USERS TAB ====================
  // Users handlers (to be implemented)
  // Add user-related handlers here when needed

  // ==================== ANALYTICS TAB ====================
  // Analytics handlers (to be implemented)
  // Add analytics-related handlers here when needed

  // ==================== RENDER ====================
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {/* Commented out as in original - can be uncommented when needed */}
      {activeTab === "overview" && <OverviewTab />}

      {/* Notifications Tab */}
      {activeTab === "notifications" && <NotificationsTab />}


      {/* Products Tab */}
      {activeTab === "products" && <ProductTab />}



      {/* Users Tab */}
      {/* Commented out as in original - can be uncommented when needed */}
      {/* {activeTab === "users" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-muted-foreground">User management features will be implemented here.</p>
          </div>
        </div>
      )} */}

      {/* Analytics Tab */}
      {/* Commented out as in original - can be uncommented when needed */}
      {activeTab === "orders" && (
        <OrdersAdmin />
      )}
    </div>
  );
}
