import { getNotificationById } from "@/handler/notification"
import NotificationDetail from "@/components/notifications/notification-detail"
import RelatedNotifications from "@/components/notifications/related-notifications"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }) {
  const param = await params
  const res = await getNotificationById(param.id)
  const notification = await res.json()

  if (!notification) {
    return {
      title: "Notification Not Found",
    }
  }

  return {
    title: `${notification.title} - Nvs Book Store`,
    description: notification.description,
  }
}

export default async function NotificationPage({ params }) {
  const param = await params
  const res = await getNotificationById(param.id)
  const notification = await res.json()

  if (!notification) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NotificationDetail notification={notification} />
      <RelatedNotifications category={notification.category.slug} currentId={notification._id} />
    </div>
  )
}
