import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { message, userName } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in intention setting. A user named ${userName || "there"} is asking: ${message}

Please provide guidance about setting powerful 28-day intentions, using the GIV•EN™ Framework, and creating transformation plans.

Respond with wisdom, encouragement, and practical steps for meaningful change.`,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Error in intention setting:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
