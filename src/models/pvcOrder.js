// File: models/pvcOrder.js

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
    paymentMethod: { type: String, enum: ["cod"], default: "cod" },
    price: { type: Number, required: true },
    items: [
      {
        productType: { type: String, required: true },
        copies: { type: Number, default: 1 },
        details: { type: mongoose.Schema.Types.Mixed }, // flexible schema
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
