import connectDB from "@/lib/dbConnect";
import Order from "@/models/order"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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
    const order = await Order.create({
      customerId: session.user.id,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      price,
    })

    return {
      success: true,
      status: 201,
      data:order,
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