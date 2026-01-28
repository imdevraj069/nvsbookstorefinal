import {
  getNotifications,
  getNotificationsByCategory,
  getNotfCatHandler,
  createNotCatHandler,
  createNotificationHandler,
  toggleField,
  duplicateNotificationHandler
} from "@/handler/notification";
import { Notification } from "@/models/notification.js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    if (type === "category") {
      const categories = await getNotfCatHandler();
      return Response.json(categories);
    }

    if (type === "filter") {
      try {
        const departments = await Notification.distinct("department", {
          department: { $ne: "" },
        });
        const locations = await Notification.distinct("location", {
          location: { $ne: "" },
        });

        return Response.json({ departments, locations });
      } catch (error) {
        return Response.json({
          error: "Error fetching departments and locations",
        });
      }
    }

    // Search by tags or title
    if (type === "search" && search) {
      try {
        const searchQuery = {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } },
            { description: { $regex: search, $options: "i" } },
          ],
        };
        const results = await Notification.find(searchQuery)
          .sort({ date: -1 })
          .lean();
        return Response.json({ source: "mongo", data: results });
      } catch (error) {
        console.error(error);
        return Response.json(
          { error: "Error searching notifications" },
          { status: 500 }
        );
      }
    }

    if (type === "bycategory") {
      const result = await getNotificationsByCategory(category);
      return Response.json(result);
    }
    const result = await getNotifications();
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  try {
    const body = await req.json();
    const { data } = body;

    if(type === "category"){
      const newCategory = await createNotCatHandler(data);
      return Response.json(newCategory);
    }

    if(type === "duplicate"){
      const { notificationId } = data;
      const result = await duplicateNotificationHandler(notificationId);
      return Response.json(result, { status: result.success ? 200 : 500 });
    }

    const newNotification = await createNotificationHandler(data)
    return Response.json(newNotification);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, field } = await req.json();

    if (!id || !field) {
      return Response.json(
        { success: false, message: "Missing id or field" },
        { status: 400 }
      );
    }

    // safety check
    if (!["isVisible", "isfeatured"].includes(field)) {
      return Response.json(
        { success: false, message: "Invalid field" },
        { status: 400 }
      );
    }

    const result = await toggleField({ id, field, model: Notification });
    return Response.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
      status: 500,
      body: "Internal Server Error actually",
      error
    }
    )
  }
}
