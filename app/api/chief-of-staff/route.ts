import { convertToModelMessages, streamText, tool, type UIMessage } from "ai"
import { z } from "zod"

export const maxDuration = 30

const BARBARA_SYSTEM_PROMPT = `You are Barbara's personal AI Chief of Staff for her Make Time For More™ coaching business.

YOUR ROLE:
- Help Barbara run her business operations efficiently
- Manage her 1PM-5PM CEO workday (4-hour focused work blocks)
- Coordinate her virtual executive team (COO, CFO, CMO, CTO)
- Keep her in integrity with her own work-life balance model

BARBARA'S BUSINESS MODEL:
- Make Time For More™: Sustainable 4-hour CEO workday, Mon-Thurs
- Operating schedule: Jan-Jun, Sept-Oct (with summer & winter sabbaticals)
- 4 Business Pillars: AI & Automation, Zone of Genius, Visibility & Growth, Revenue & Delivery
- Target clients: Coaches, consultants, entrepreneurs (ages 8-80!)
- Mission: Bring families together, build AI & Human powered businesses

BARBARA'S CURRENT CHALLENGES:
- Onboarding scheduled 7-8:30 PM (conflicts with hub closing at 5 PM)
- Needs to delegate more tasks
- Wants to operate as top 0.1% thought leader
- Building this hub while serving clients

YOUR GUIDANCE STYLE:
- Direct and actionable (Barbara values efficiency)
- Challenge her when she's overworking
- Strategic thinking for scaling
- Science-backed recommendations (neuroscience, habit science, business strategy)

CAPABILITIES:
- Schedule optimization
- Task delegation to virtual team
- Strategic business planning
- Content creation support
- Client management insights`

const delegateTaskTool = tool({
  description: "Delegate a task to one of Barbara's virtual executive team members",
  inputSchema: z.object({
    task: z.string().describe("The task to delegate"),
    teamMember: z.enum(["COO", "CFO", "CMO", "CTO"]).describe("Which executive to delegate to"),
    priority: z.enum(["urgent", "high", "medium", "low"]),
    dueDate: z.string().optional().describe("When this should be completed"),
  }),
  execute: async ({ task, teamMember, priority, dueDate }) => {
    return {
      status: "delegated",
      task,
      assignedTo: teamMember,
      priority,
      dueDate: dueDate || "Not specified",
      message: `Task delegated to ${teamMember}. I'll track progress and report back.`,
    }
  },
})

const scheduleOptimizationTool = tool({
  description: "Analyze and optimize Barbara's schedule within the 4-hour workday model",
  inputSchema: z.object({
    currentSchedule: z.string().describe("Description of current scheduling issue"),
    desiredOutcome: z.string().describe("What Barbara wants to achieve"),
  }),
  execute: async ({ currentSchedule, desiredOutcome }) => {
    return {
      analysis: `Current issue: ${currentSchedule}`,
      recommendation: "Moving to 1-5 PM workday slot",
      pillarAlignment: "This fits in the Revenue & Delivery pillar",
      integrityCheck: "Keeps you in alignment with your model",
    }
  },
})

const businessMetricsTool = tool({
  description: "Track and analyze business metrics",
  inputSchema: z.object({
    metric: z.enum(["revenue", "clients", "time-freedom", "engagement"]),
    period: z.enum(["daily", "weekly", "monthly", "quarterly"]),
  }),
  execute: async ({ metric, period }) => {
    return {
      metric,
      period,
      data: `Analyzing ${metric} for ${period} period`,
      insights: "Tracking setup - will provide real data once integrated",
    }
  },
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: BARBARA_SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: {
      delegateTask: delegateTaskTool,
      scheduleOptimization: scheduleOptimizationTool,
      businessMetrics: businessMetricsTool,
    },
    maxOutputTokens: 2000,
  })

  return result.toUIMessageStreamResponse()
}
