import mongoose from "mongoose";

const pvcOrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    address: { type: String, required: true }, // 🆕 delivery address

    paymentMethod: {
      type: String, // Only Razorpay now
      default: "razorpay",
    },

    price: { type: Number, required: true },

    items: [
      {
        productType: { type: String, required: true },
        mode: { type: String, enum: ["copy", "lost"], required: true },
        copies: { type: Number, default: 1 },
        details: { type: mongoose.Schema.Types.Mixed }, // form data
      },
    ],

    status: {
      type: String,
      enum: ["pending", "processing", "printed", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.PVCOrder ||
  mongoose.model("PVCOrder", pvcOrderSchema);
