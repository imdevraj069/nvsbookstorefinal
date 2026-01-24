import mongoose from "mongoose";

const notificationCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  slug: {
    type: String,
    default: "",
  },
});

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  category: {
    type: notificationCategorySchema,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  pdfUrl: {
    type: String,
    default: "",
  },
  applyUrl: {
    type: String,
    default: "",
  },
  websiteUrl: {
    type: String,
    default: "",
  },

  // ✅ Newly added fields
  loginUrl: {
    type: String,
    default: "",
  },
  resultUrl: {
    type: String,
    default: "",
  },
  admitCardUrl: {
    type: String,
    default: "",
  },

  lastDate: {
    type: Date,
    default: Date.now,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  isfeatured: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
    index: true,
  },
});

const NotificationCategory =
  mongoose.models?.NotificationCategory ||
  mongoose.model("NotificationCategory", notificationCategorySchema);

const Notification =
  mongoose.models?.Notification ||
  mongoose.model("Notification", notificationSchema);

export { Notification, NotificationCategory };
