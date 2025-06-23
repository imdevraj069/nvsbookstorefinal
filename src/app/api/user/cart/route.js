import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/dbConnect"
import Cart from "@/models/Cart"
import Product from "@/models/product" // required for populate

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ cartItems: [] }, { status: 401 })
  }

  await connectDB()
  const user = session.user

  const cart = await Cart.findOne({ userId: user.id }).populate("items.product");

  return Response.json({
    cartItems: cart?.items || []
  })
}

export async function POST(req) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      })
    }

    const userId = session.user.id
    const body = await req.json()

    if (!Array.isArray(body.items)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
      })
    }

    // Ensure each item has a valid product and quantity
    const validatedItems = body.items.filter(
      (item) =>
        item &&
        item.productId &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    )

    // Format for MongoDB
    const formattedItems = validatedItems.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }))

    // Upsert cart
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { items: formattedItems },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("items.product")

    return new Response(JSON.stringify(updatedCart), {
      status: 200,
    })
  } catch (err) {
    console.error("Cart Sync Error:", err)
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    })
  }
}
