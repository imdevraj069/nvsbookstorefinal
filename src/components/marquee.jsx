"use client";
import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import { Bell } from "lucide-react";
import axios from "axios";

export default function NotMarquee() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notification");
        const data = res.data;
        setAllNotifications(data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const featuredNotifications = allNotifications.filter(
    (item) => item.isfeatured
  );

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4">
      <div className="container mx-auto flex items-center">
        <Bell className="h-4 w-4 mr-3 flex-shrink-0" />
        {loading ? (
          <span className="text-sm">Loading notifications...</span>
        ) : featuredNotifications.length > 0 ? (
          <Marquee pauseOnHover gradient={false} speed={50}>
            {featuredNotifications.map((item) => (
              <Link
                key={item._id || item.id}
                href={`notification/${item._id}`}
                className="mx-8 hover:underline text-sm"
              >
                {item.title}
              </Link>
            ))}
          </Marquee>
        ) : (
          <span className="text-sm">No featured notifications at the moment.</span>
        )}
      </div>
    </div>
  );
}
