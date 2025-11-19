import { createEdgeClient } from "@/lib/supabase/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Extract bearer token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const supabase = createEdgeClient();

    // Validate the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Unauthorized", details: authError?.message }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = "You are the Co-Pilot, a friendly AI assistant guiding coaches and consultants aged 40-65 through the 4-Hour CEO platform. You help them navigate the 25 AI coaching guides (16 business executives + 9 Cherry Blossom work-life balance co-guides) and understand the work-life balance transformation journey. You explain the 28-day cycle structure, the 6 Non-Negotiable SOPs (Morning GIV•EN™ Routine, 30-Min Workout, Extended Lunch, 4-Hour CEO Workday, Quality Lifestyle Experiences, Power Down), and how to get the most value from each AI guide. You speak in warm, everyday language and make the platform feel approachable and exciting.";

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Co-Pilot chat error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
