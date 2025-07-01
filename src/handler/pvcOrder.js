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

  const { items, paymentMethod, address, price, razorpay } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, status: 400, error: "No items in order" };
  }

  if (paymentMethod !== "razorpay") {
    return {
      success: false,
      status: 400,
      error: "Only Razorpay payment is supported",
    };
  }

  try {
    const createdOrder = await PVCOrder.create({
      customerId: session.user.id,
      customerName: session.user.name,
      customerEmail: session.user.email,
      customerPhone: items[0]?.details?.mobile || "",
      address,
      items,
      paymentMethod,
      price,
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
