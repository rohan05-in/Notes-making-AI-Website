import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import OpenAI from "openai";

// Optional: Fallback initialization if key is missing during build/dev
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages, context } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      // Mock response if no key is provided yet
      return NextResponse.json({
        role: "assistant",
        content: `(Mock AI Response) I see you are asking about: "${messages[messages.length - 1].content}". \n\nI can help you summarize or generate ideas based on your note context once you provide an OpenAI API key in the .env file!`,
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Neura, a helpful AI assistant for a note-taking app. Use the context of the user's current note to provide highly relevant and concise answers. \n\nCurrent Note Context:\n${context || "No current note selected."}`,
        },
        ...messages,
      ],
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error("[AI_CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
