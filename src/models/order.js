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
    status: {
      type: String,
      default: "pending",
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
