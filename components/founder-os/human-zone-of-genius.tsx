"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Heart,
  Lightbulb,
  MessageCircle,
  Users,
  Award,
  Brain,
  Shield,
  Sparkles,
} from "lucide-react"

/**
 * Workspace 3 — 🎯 Human Zone of Genius™.
 *
 * The "what only I can do" workspace: the 20% of high-value, human-only work
 * that generates 80% of results. Content reused from the original page.
 */

/**
 * The canonical 8 Human Zone of Genius™ practices. Exported so other
 * Founder Operating System™ features (e.g. the Weekly WLBB Debrief™) can
 * reuse this single source of truth instead of duplicating the list.
 */
export const humanSkills = [
  {
    icon: Heart,
    title: "Authentic Client Relationships",
    description:
      "Deep empathy, emotional intelligence, and genuine human connection that builds trust and long-term client relationships AI cannot replicate.",
  },
  {
    icon: Lightbulb,
    title: "Visionary Leadership",
    description:
      "Setting strategic direction, defining your unique methodology, and making high-level business decisions that shape your company's future.",
  },
  {
    icon: MessageCircle,
    title: "High-Value Sales Conversations",
    description:
      "Discovery calls, enrollment conversations, and relationship-based selling where your intuition and human presence close premium clients.",
  },
  {
    icon: Users,
    title: "Content Thought Leadership",
    description:
      "Your unique voice, perspective, and insights that position you as the authority. AI drafts, but your authentic experience makes it powerful.",
  },
  {
    icon: Award,
    title: "Coaching / Consulting Delivery",
    description:
      "Facilitating transformation, asking powerful questions, holding space, and guiding clients through breakthroughs only you can deliver.",
  },
  {
    icon: Brain,
    title: "Intuitive Problem-Solving",
    description:
      "Reading between the lines, sensing what's not being said, and innovating custom solutions based on pattern recognition and experience.",
  },
  {
    icon: Shield,
    title: "Ethical Decision-Making",
    description:
      "Values-based leadership, cultural sensitivity, and navigating complex ethical situations that require human judgment and integrity.",
  },
  {
    icon: Sparkles,
    title: "Personal Brand Storytelling",
    description:
      "Sharing your journey, vulnerabilities, and transformation story that creates emotional resonance and attracts ideal clients to you.",
  },
]

export function HumanZoneOfGenius() {
  return (
    <div className="space-y-5">
      <p className="text-[#3A2E33] leading-relaxed">
        {"This is your "}
        <strong>20%</strong>
        {
          " — the irreplaceable, human-only work that creates 80% of your results. Everything else can be augmented so you can spend your CEO Workday here."
        }
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {humanSkills.map((skill, index) => (
          <Card key={skill.title} className="border-l-4 border-l-[#E26C73]">
            <CardHeader>
              <skill.icon className="mb-3 h-8 w-8 text-[#E26C73]" />
              <CardTitle className="mb-1 text-base text-[#3A2E33]">
                {index + 1}. {skill.title}
              </CardTitle>
              <CardDescription className="leading-relaxed">{skill.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
