"use client";

import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

export default function OverviewTab() {
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, notificationsRes] = await Promise.all([
          axios.get("/api/product"),
          axios.get("/api/notification")
        ]);
        setProducts(productsRes.data.data);
        setNotifications(notificationsRes.data.data);
      } catch (err) {
        console.error("Error fetching overview data:", err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Notifications",
      value: notifications.length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    // {
    //   title: "Active Users",
    //   value: "1,234",
    //   icon: Users,
    //   color: "text-purple-600",
    //   bgColor: "bg-purple-100 dark:bg-purple-900",
    // },
    // {
    //   title: "Monthly Revenue",
    //   value: "₹45,678",
    //   icon: TrendingUp,
    //   color: "text-orange-600",
    //   bgColor: "bg-orange-100 dark:bg-orange-900",
    // },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {/* <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">New notification published</p>
              <p className="text-sm text-muted-foreground">
                UPSC Civil Services Results
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              2 hours ago
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">Product added to store</p>
              <p className="text-sm text-muted-foreground">
                SSC CGL Study Material
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              5 hours ago
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">User registered</p>
              <p className="text-sm text-muted-foreground">
                New user signup
              </p>
            </div>
            <span className="text-sm text-muted-foreground">1 day ago</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}