import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    shippingAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMethod: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      default: "pending", // will change to "paid" after verification
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
    },
    price: {
      subtotal: Number,
      discount: Number,
      shipping: Number,
      total: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Order || mongoose.model("Order", orderSchema);
