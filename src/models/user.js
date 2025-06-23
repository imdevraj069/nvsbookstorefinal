import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      default: " ",
    },
    phone: {
      type: String,
      default: " ",
    },
    password: {
      type: String,
    },
    signupOtp: {
      type: String,
      default: " ",
    },
    verifyOTP: {
      type: String,
      default: " ",
    },
    verifyId: {
      type: String,
      default: " ",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    image: {
      type: String,
      default: "",
    },
    authtype: {
      type: String,
      default: "credentials",
    },
    bio: {
      type: String,
      default: ""
    },
    education: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    interests: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.User || mongoose.model("User", userSchema);
