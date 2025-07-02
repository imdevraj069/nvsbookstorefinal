import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This assumes you have a "User" model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true
  }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    longDescription: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    images: {
      type: Array,
      default: [],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    category: {
      type: categorySchema,
      default: null,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    content: {
      type: String,
      default: "",
    },
    isDigital: {
      type: Boolean,
      default: false,
    },
    isVisible:{
      type:Boolean,
      default:true
    },
    isFeatured:{
      type:Boolean,
      default:false
    },
    author: {
      type: String,
      default: "",
    },
    publisher: {
      type: String,
      default: "",
    },
    pages: {
      type: Number,
      default: 0,
    },
    language: {
      type: Array,
      default: [],
    },
    isbn: {
      type: String,
      default: "",
    },
    specifications: {
      type: Object,
      default: {},
    },
    digitalUrl: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models?.Category || mongoose.model("Category", categorySchema);
const Product =
  mongoose.models?.Product || mongoose.model("Product", productSchema);

export { Category, Product };
