import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tags = await prisma.tag.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { notes: true }
        }
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("[TAGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        userId: session.user.id as string,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("[TAGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
