import Link from "next/link"
import { getNotificationsByCategory } from "@/handler/notification";

export default async function RelatedNotifications({ category, currentId }) {
  const { data: relatedNotifications } = await getNotificationsByCategory(category);

  const filtered = relatedNotifications.filter(
    (notification) => notification._id.toString() !== currentId
  );

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Notifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((notification) => (
          <Link
            key={notification._id}
            href={`/notification/${notification._id}`}
            className="block group"
          >
            <div className="border border-border rounded-lg p-4 h-full hover:border-primary/50 transition-colors">
              <div className="text-sm text-muted-foreground mb-2">
                {new Date(notification.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-primary">
                {notification.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
