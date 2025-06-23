// lib/dbConnect.js
import mongoose from 'mongoose'

let cached = global.mongoose || { conn: null, promise: null }

export default async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI
  
  if (!MONGODB_URI) throw new Error("Define MONGODB_URI in .env.local")
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise
  global.mongoose = cached
  return cached.conn
}
