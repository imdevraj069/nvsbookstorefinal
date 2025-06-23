"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Bell,
  ShoppingBag,
  Bookmark,
  Settings,
  User,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Replace this with your own profile logic
  const [profileData, setProfileData] = useState({ name: "" });

  useEffect(() => {
    if (status !== "loading" && !session?.user) {
      router.push("/");
    }

    if (session?.user) {
      // Fetch your actual profile data here
      setProfileData({ name: session.user.name || "User" });
    }
  }, [session, status]);

  if (status === "loading") {
    return <div className="text-center py-10">Checking authentication...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-xl lg:text-3xl font-bold">Welcome back, {profileData.name}</h1>
        <p className="text-xs lg:text-lg text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar / Navigation */}
        <div className="lg:col-span-1">
          {/* Mobile tab bar */}
          <div className="lg:hidden overflow-x-auto pb-4">
            <div className="flex space-x-2 w-max min-w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap border transition-colors text-sm ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop sidebar */}
          <nav className="hidden lg:block space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="text-center text-muted-foreground">
                <p>This is your dashboard overview. You can show stats or quick actions here.</p>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">My Notifications</h2>
              <div className="text-muted-foreground">
                {/* Render notifications here */}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">My Orders</h2>
              <div className="text-muted-foreground">
                {/* Render orders here */}
              </div>
            </div>
          )}

          {activeTab === "bookmarks" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Bookmarks</h2>
              <div className="text-muted-foreground">
                {/* Render bookmarks here */}
              </div>
            </div>
          )}

          {activeTab === "downloads" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Downloads</h2>
              <div className="text-muted-foreground">
                {/* Render downloads here */}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  // { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "downloads", label: "Downloads", icon: Download },
];
