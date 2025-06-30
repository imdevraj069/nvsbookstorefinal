"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ExternalLink, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from 'axios';

export default function LatestUpdatesSection() {
  // Get latest notifications by category
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () =>{
      try {
        const res = await axios.get('/api/notification');
        const data = await res.data;
        setAllNotifications(data.data);
      } catch (error) {
        console.error(error)
      }finally{
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const latestResults = allNotifications
    .filter((n) => n.category.slug === "results")
    .slice(0, 15);
  const latestAdmitCards = allNotifications
    .filter((n) => n.category.slug === "admit-cards")
    .slice(0, 15);
  const latestJobs = allNotifications
    .filter((n) => n.category.slug === "jobs")
    .slice(0, 15);

  const isNotificationNew = (date) => {
    const notificationDate = new Date(date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return notificationDate >= oneWeekAgo;
  };

  const sections = [
    {
      title: "Latest Jobs",
      notifications: latestJobs,
      href: "/notifications/jobs",
      gradient: "from-red-500 to-orange-600",
      bgGradient:
        "from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950",
      icon: "💼",
    },
    {
      title: "Latest Results",
      notifications: latestResults,
      href: "/notifications/results",
      gradient: "from-green-500 to-emerald-600",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
      icon: "📊",
    },
    {
      title: "Admit Cards",
      notifications: latestAdmitCards,
      href: "/notifications/admit-cards",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
      icon: "📋",
    },
  ];

  return (
    <motion.div
      className="py-12 px-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-2">Latest Updates</h2>
        <p className="text-muted-foreground">
          Stay updated with the most recent notifications
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 px-2 sm:px-2 lg:px-4">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className={`bg-gradient-to-br ${section.bgGradient} rounded-xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + sectionIndex * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Header */}
            <div
              className={`bg-gradient-to-r ${section.gradient} px-4 py-2 text-white`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
                {/* <motion.div whileHover={{ scale: 1.1 }}>
                  <Link href={section.href}>
                    <ArrowRight className="h-5 w-5 hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div> */}
              </div>
            </div>

            {/* Content */}
            <div className="p-2">
              {section.notifications.length > 0 ? (
                <ul className="space-y-3">
                  {section.notifications.map((notification, index) => (
                    <motion.li
                      key={notification._id?? index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.5 + sectionIndex * 0.1 + index * 0.05,
                      }}
                    >
                      <Link
                        href={`/notification/${notification._id}`}
                        className="group block"
                      >
                        <div className="rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1">
                              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {notification.title}
                              </p>
                              {isNotificationNew(notification.date) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                >
                                  <Badge
                                    variant="destructive"
                                    className="text-xs px-1.5 py-0.5 animate-pulse"
                                  >
                                    NEW
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No recent updates</p>
                </div>
              )}

              {/* View All Button */}
              {section.notifications.length > 0 && (
                <motion.div
                  className="mt-4 pt-4 border-t border-border/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.8 + sectionIndex * 0.1,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href={section.href}>
                        View All {section.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      {/* <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        {[
          { label: "Total Notifications", value: allNotifications.length, icon: "📢" },
          { label: "This Week", value: allNotifications.filter((n) => isNotificationNew(n.date)).length, icon: "🆕" },
          { label: "Active Jobs", value: allNotifications.filter((n) => n.category === "jobs").length, icon: "💼" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div> */}
    </motion.div>
  );
}
