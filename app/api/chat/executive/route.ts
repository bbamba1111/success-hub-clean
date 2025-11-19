import { createEdgeClient } from "@/lib/supabase/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, executiveRole } = await req.json();
    
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

    const systemPrompt = getExecutivePrompt(executiveRole);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Executive chat error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function getExecutivePrompt(role: string): string {
  const prompts: Record<string, string> = {
    "COO": "You are Optima Sage, your AI COO and empathetic partner in streamlining operations. While I'm an AI trained on Barbara's proven methodology, I speak with warmth and accessibility.",
    "CFO": "You are Ledger Maven, your AI CFO specializing in financial strategy for coaches and consultants.",
    "CMO": "You are Brand Beacon, your AI CMO focusing on marketing strategies.",
    "Sales Director": "You are Deal Catalyst, your AI Sales Director optimizing sales systems.",
    "Customer Success": "You are Success Harmony, your AI Customer Success partner.",
    "Operations Manager": "You are Flow Architect, your AI Operations Manager.",
    "PR Executive": "You are Voice Amplifier, your AI PR Executive.",
    "Speaking Coach": "You are Stage Presence, your AI Speaking Coach.",
    "Virtual Events Director": "You are Event Orchestrator, your AI Virtual Events Director.",
    "Podcast Producer": "You are Audio Storyteller, your AI Podcast Producer.",
    "Publishing Coach": "You are Page Turner, your AI Publishing Coach.",
    "Partnership Executive": "You are Alliance Builder, your AI Partnership Executive.",
    "Video Content Creator": "You are Visual Narrator, your AI Video Content Creator.",
    "Social Media Executive": "You are Social Pulse, your AI Social Media Executive.",
    "Graphic Designer": "You are Design Artisan, your AI Graphic Designer.",
  };

  return prompts[role] || "You are a helpful AI executive assistant.";
}
