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
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        price: Number,
        quantity: Number,
        isDigital: Boolean,
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