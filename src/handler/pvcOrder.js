// File: /handler/pvcOrderHandler.js

import connectDB from "@/lib/dbConnect";
import PVCOrder from "@/models/pvcOrder";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { sendEmail } from "@/lib/mailer";
import {
  renderAdminOrderNotificationEmail,
  renderUserOrderConfirmationEmail,
  renderUserPVCOrderStatusUpdateEmail
} from "@/utils/templates/pvcOrder";

export async function createPVCOrderHandler(body) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, status: 401, error: "Unauthorized" };
  }

  const { items, paymentMethod } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, status: 400, error: "No items in order" };
  }

  if (paymentMethod !== "cod") {
    return {
      success: false,
      status: 400,
      error: "Only COD is allowed currently",
    };
  }

  try {
    const total = items.reduce((acc, i) => acc + (i.copies || 1) * 50, 0);

    const createdOrder = await PVCOrder.create({
      customerId: session.user.id,
      customerName: session.user.name,
      customerEmail: session.user.email,
      customerPhone: items[0]?.details?.mobile || "",
      items,
      paymentMethod,
      price: total,
    });

    await redis.del("pvc-orders");

    await sendEmail({
      to: session.user.email,
      subject: "✅ PVC Order Confirmation",
      html: renderUserOrderConfirmationEmail(createdOrder),
    });

    await sendEmail({
      to: process.env.ADMIN_MAIL,
      subject: "📦 New PVC Card Order",
      html: renderAdminOrderNotificationEmail(createdOrder),
    });

    return { success: true, status: 201, data: createdOrder };
  } catch (err) {
    console.error(err);
    return { success: false, status: 500, error: "Failed to create order" };
  }
}
