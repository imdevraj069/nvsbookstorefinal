import {getNotifications, getNotificationsByCategory, getNotfCatHandler} from "../../../handler/notification"
import { Notification } from "@/models/notification.js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
                            
  try {
    if (type === "category") {
      const categories = await getNotfCatHandler();
      return Response.json(categories);
    }

    if(type === "filter"){
      try {
        const departments = await Notification.distinct("department", { department: { $ne: "" } })
        const locations = await Notification.distinct("location", { location: { $ne: "" } })

        return Response.json({ departments, locations })
      } catch (error) {
        return Response.json({ error: "Error fetching departments and locations" });
      }
    }

    if(type === "bycategory"){
      const category = searchParams.get("category");
      const notifications = await getNotificationsByCategory(category);
      return Response.json(notifications);
    }

    const notifications = await getNotifications();
    return Response.json(notifications);
  } catch (error) {
    console.error(err);
    return new Response('Internal Server Error', { status: 500 });
  }
}