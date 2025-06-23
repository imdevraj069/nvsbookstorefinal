import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";
import User from "@/models/user";

export async function GET(){
  return NextResponse.json({ message: "Hello, World!" });
}


export async function POST(req){
  try {
    await connectDB();

    const data = await req.json();
    const {name, email, password, phone, address} = data;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address:address,
      role: "user",
      authType: "credentials",
    })

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    
  }
}