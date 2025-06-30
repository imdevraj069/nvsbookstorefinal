import connectDB from "@/lib/dbConnect";
import Order from "@/models/order"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redis } from "@/lib/redis";
import { Product } from "@/models/product"
import { sendEmail } from "@/lib/mailer"
import {
  renderAdminOrderNotificationEmail,
  renderUserOrderConfirmationEmail,
  renderUserOrderStatusUpdateEmail
} from "@/utils/templates/order"

export async function getOrdersHandler() {
  await connectDB()

  const cacheKey = 'orders'
  const cachedOrders = await redis.get(cacheKey);
  if (cachedOrders) {
    return {
      sourse: "redis",
      data: cachedOrders
    }
  }

  const orders = await Order.find({}).populate('items.product').sort({createdAt : -1}).lean()
  await redis.set(cacheKey, orders, { ex: 3600 });

  return {
    source: "mongo",
    data: orders
  }
}

export async function createOrderHandler(req) {
  await connectDB()

  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return {
      success: false,
      status: 401,
      error: "Unauthorized",
    }
  }

  const { items, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, price } = req

  if (paymentMethod !== "cod") {
    return {
      success: false,
      status: 400,
      error: "Only COD is allowed currently",
    }
  }

  try {
    const createdOrder = await Order.create({
      customerId: session.user.id,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      price,
    })

    const order = await Order.findById(createdOrder._id).populate("items.product")

    await redis.del("orders")

    // Send emails to user and admin
    await sendEmail({
      to: customerEmail,
      subject: "✅ Order Confirmation - NVS Book Store",
      html: renderUserOrderConfirmationEmail(order),
    });

    await sendEmail({
      to: process.env.ADMIN_MAIL,
      subject: `📦 New Order: ${customerName}`,
      html: renderAdminOrderNotificationEmail(order),
    });

    return {
      success: true,
      status: 201,
      data: order,
    }
  } catch (error) {
    console.error("Order creation error:", error)
    return {
      success: false,
      status: 500,
      error: "Server error creating order",
    }
  }
}

export async function updateOrderStatusHandler(orderId, newStatus) {
  await connectDB();

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(newStatus)) {
    return {
      success: false,
      status: 400,
      error: "Invalid status value",
    };
  }

  try {
    await Order.findByIdAndUpdate(orderId, { status: newStatus });
    const updatedOrder = await Order.findById(orderId).populate("items.product")

    if (!updatedOrder) {
      return {
        success: false,
        status: 404,
        error: "Order not found",
      };
    }

    await redis.del("orders");

    // Send status update email to user
    await sendEmail({
      to: updatedOrder.customerEmail,
      subject: `📢 Order Status Updated - ${updatedOrder.status.toUpperCase()}`,
      html: renderUserOrderStatusUpdateEmail(updatedOrder),
    });

    return {
      success: true,
      status: 200,
      data: updatedOrder,
    };
  } catch (err) {
    console.error("Error updating order status:", err);
    return {
      success: false,
      status: 500,
      error: "Server error updating order",
    };
  }
}

export async function getOrderByIdHandler(orderId) {
  await connectDB();

  try {
    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return {
        success: false,
        status: 404,
        error: "Order not found",
      };
    }

    return {
      success: true,
      status: 200,
      data: order,
    };
  } catch (err) {
    console.error("Error fetching order:", err);
    return {
      success: false,
      status: 500,
      error: "Server error fetching order",
    };
  }
}
