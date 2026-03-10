import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Registration body parse error:", e);
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { email, password, name } = body;

    if (!email || !password || !name) {
      console.error("Registration missing fields:", { email, name, hasPassword: !!password });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password_hash,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("REGISTRATION_ERROR:", error);
    return NextResponse.json(
      { message: error?.message || "An error occurred during registration" },
      { status: 500 }
    );
  }
}
