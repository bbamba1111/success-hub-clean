import { convertToModelMessages, streamText, tool, type UIMessage } from "ai"
import { z } from "zod"

export const maxDuration = 30

const CLIENT_CO_GUIDE_SYSTEM_PROMPT = `You are the Cherry Blossom Co-Guide, an AI partner trained on Barbara's Make Time For More™ Work-Life Balance business model.

FOUNDATION (SAME FOR ALL CLIENTS):
- Make Time For More™: 4-hour CEO workday, Mon-Thurs (1PM-5PM)
- 4 Business Pillars: AI & Automation, Zone of Genius, Visibility & Growth, Revenue & Delivery
- Operating rhythm: 8 months working (Jan-Jun, Sept-Oct), 4 months sabbatical
- Friday-Sunday: Time Freedom (no business work)
- Sunday Shift: Weekly recommitment and planning session

PERSONALIZATION (UNIQUE TO EACH CLIENT):
- Trained on their specific business type and goals
- Adapted to their learning comprehension level
- Customized to their monthly work-lifestyle intention
- Aligned with their business stage (Starting, Growing, Scaling)

YOUR CAPABILITIES:
1. Business Operations: Manage virtual executive team (COO, CFO, CMO, CTO)
2. Education: Teach business AND life sciences at their comprehension level:
   - Business: Marketing, sales, operations, finance
   - Sciences: Neuroscience, epigenetics, hormonal science, habit building, happiness science, quantum physics
3. 1-to-Many Marketing Skills: Public speaking, interviews, partnerships, networking, publicity
4. Work-Life Balance: Enforce boundaries, track time freedom, optimize energy
5. Growth Tracking: Monitor progress in work AND life goals

YOUR TEACHING STYLE:
- Adaptive (1st grade to PhD level explanations)
- Science-backed (explain the WHY behind recommendations)
- Practical (actionable steps, not just theory)
- Holistic (mind, body, relationships, business integration)
- Boundary-enforcing (no overwork, protect time freedom)

GUIDANCE PRINCIPLES:
- Always connect actions to long-term wellbeing
- Explain consequences (short-term AND long-term, good AND bad)
- Help them express their Zone of Genius authentically
- Build sustainable businesses that support sustainable lives
- Teach them to practice 1-to-many skills before going live

CLIENT CONTEXT:
You'll receive the client's business audit data, monthly intention, and learning level in the conversation.`

const planWorkdayTool = tool({
  description: "Plan today's 4-hour CEO workday across the 4 business pillars",
  inputSchema: z.object({
    monthlyIntention: z.string().describe("Their current monthly work-lifestyle intention"),
    businessStage: z.enum(["starting", "growing", "scaling"]),
    urgentPriorities: z.array(z.string()).optional(),
  }),
  execute: async ({ monthlyIntention, businessStage, urgentPriorities }) => {
    return {
      workday: {
        "1-2 PM": "AI & Automation",
        "2-3 PM": "Zone of Genius",
        "3-4 PM": "Visibility & Growth",
        "4-5 PM": "Revenue & Delivery",
      },
      todaysFocus: "Based on your monthly intention and business stage",
      tasks: urgentPriorities || [],
      boundaryReminder: "Stop at 5 PM - Time Freedom hours begin!",
    }
  },
})

const teachConceptTool = tool({
  description: "Teach a business or life science concept at the client's comprehension level",
  inputSchema: z.object({
    topic: z.string().describe("What concept to teach"),
    level: z.enum(["elementary", "middle-school", "high-school", "college", "graduate", "phd"]),
    applicationContext: z.string().describe("How this applies to their business/life"),
  }),
  execute: async ({ topic, level, applicationContext }) => {
    return {
      concept: topic,
      explanation: `Teaching ${topic} at ${level} level`,
      realWorldApplication: applicationContext,
      nextSteps: "Practice exercises and implementation plan",
      scienceBacking: "Research and studies supporting this concept",
    }
  },
})

const practice1ToManySkillTool = tool({
  description: "Help client practice 1-to-many marketing skills in a safe environment",
  inputSchema: z.object({
    skill: z.enum(["public-speaking", "interview", "partnership-pitch", "networking", "publicity"]),
    scenario: z.string().describe("The specific scenario to practice"),
  }),
  execute: async ({ skill, scenario }) => {
    return {
      skill,
      practiceScenario: scenario,
      feedback: "Detailed feedback on performance",
      improvements: "Specific areas to refine",
      readyToGoLive: "Assessment of preparation level",
    }
  },
})

const trackProgressTool = tool({
  description: "Track progress in work AND life goals",
  inputSchema: z.object({
    category: z.enum(["business", "wellness", "relationships", "time-freedom"]),
    metric: z.string(),
  }),
  execute: async ({ category, metric }) => {
    return {
      category,
      currentProgress: "Tracking data",
      streak: "Consecutive days of completion",
      insights: "Patterns and recommendations",
    }
  },
})

export async function POST(req: Request) {
  const { messages, clientContext }: { messages: UIMessage[]; clientContext?: any } = await req.json()

  const enhancedPrompt = clientContext
    ? `${CLIENT_CO_GUIDE_SYSTEM_PROMPT}

CURRENT CLIENT CONTEXT:
- Business Type: ${clientContext.businessType || "Not specified"}
- Monthly Intention: ${clientContext.monthlyIntention || "Not set"}
- Learning Level: ${clientContext.learningLevel || "Adaptive"}
- Business Stage: ${clientContext.businessStage || "Starting"}`
    : CLIENT_CO_GUIDE_SYSTEM_PROMPT

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: enhancedPrompt,
    messages: convertToModelMessages(messages),
    tools: {
      planWorkday: planWorkdayTool,
      teachConcept: teachConceptTool,
      practice1ToManySkill: practice1ToManySkillTool,
      trackProgress: trackProgressTool,
    },
    maxOutputTokens: 2000,
  })

  return result.toUIMessageStreamResponse()
}
