"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  DollarSign,
  TrendingUp,
  Megaphone,
  Star,
  Handshake,
  Heart,
  Code2,
  Palette,
  Rocket,
  Flower2,
  Bot,
  MessageCircle,
  Clock,
  Check,
  GraduationCap,
  ArrowRight,
} from "lucide-react"
import CherryBlossomChatModal from "@/components/cherry-blossom-chat-modal"

/**
 * Workspace — 👥 Your AI Executive Leadership Team™.
 *
 * The team is organized into three executive councils, each coordinated by
 * Cherry Blossom (Executive Advisor & Chief of Staff):
 *   • Executive Strategy Council — Cherry Blossom, AI Transformation Executive™,
 *     Operations, Finance, Revenue
 *   • Growth Council — Marketing, Brand & Authority, Partnerships, Customer Success
 *   • Execution Council — Technology, Creative, Execution & Systems
 *
 * Every function educates, recommends a next best step, and — soon — will build
 * deliverables for approval. Nothing happens without the founder's permission
 * (Yes, Show Me / Maybe Later / No Thanks). No real asset generation this phase.
 */

type Permission = "pending" | "yes" | "later" | "no"
type Council = "strategy" | "growth" | "execution"

interface FunctionArea {
  id: string
  council: Council
  name: string
  icon: typeof Settings
  tagline: string
  members: { name: string; role: string }[]
  invitation: string
  deliverables: string[]
  chatPrompt: string
}

const COUNCILS: { id: Council; name: string; description: string }[] = [
  {
    id: "strategy",
    name: "Executive Strategy Council",
    description: "The senior advisors who set direction, protect profit, and grow revenue.",
  },
  {
    id: "growth",
    name: "Growth Council",
    description: "The executives who expand your visibility, authority, and relationships.",
  },
  {
    id: "execution",
    name: "Execution Council",
    description: "The builders who turn strategy into shipped, systemized work.",
  },
]

const FUNCTIONS: FunctionArea[] = [
  // ---- Executive Strategy Council ----
  {
    id: "operations",
    council: "strategy",
    name: "Operations",
    icon: Settings,
    tagline: "Systems, SOPs, and smooth day-to-day execution.",
    members: [{ name: "Optima Sage", role: "COO" }],
    invitation:
      "There are opportunities to lighten your operational load with simple systems. Would you like me to show you where we could start?",
    deliverables: ["SOP drafts", "Workflow maps", "Weekly operations checklist", "Bottleneck audit"],
    chatPrompt: "As my Operations function (Optima Sage, COO), educate me on one operational system that would free up my time this week.",
  },
  {
    id: "finance",
    council: "strategy",
    name: "Finance",
    icon: DollarSign,
    tagline: "Profit, pricing, and financial confidence.",
    members: [{ name: "Ledger Maven", role: "CFO" }],
    invitation:
      "There are opportunities to strengthen your pricing and profit. Would you like to explore them together?",
    deliverables: ["Pricing review", "Profit-margin snapshot", "Cash-flow overview", "Offer profitability map"],
    chatPrompt: "As my Finance function (Ledger Maven, CFO), educate me on one way to improve my pricing or profit.",
  },
  {
    id: "revenue",
    council: "strategy",
    name: "Revenue",
    icon: TrendingUp,
    tagline: "Sales conversations, conversions, and consistent income.",
    members: [{ name: "Deal Catalyst", role: "Sales Director" }],
    invitation:
      "There are opportunities to make your revenue more consistent. Would you like me to show you a next best step?",
    deliverables: ["Sales conversation guide", "Follow-up sequences", "Offer positioning", "Pipeline review"],
    chatPrompt: "As my Revenue function (Deal Catalyst, Sales Director), educate me on one way to create more consistent revenue.",
  },

  // ---- Growth Council ----
  {
    id: "marketing",
    council: "growth",
    name: "Marketing",
    icon: Megaphone,
    tagline: "Visibility, content, and attracting ideal customers.",
    members: [
      { name: "Brand Beacon", role: "CMO" },
      { name: "Social Pulse", role: "Social Media Executive" },
    ],
    invitation:
      "There are opportunities to grow your visibility without more hustle. Would you like to see where we could focus?",
    deliverables: ["Content calendar", "Social post drafts", "Email campaigns", "Messaging refresh"],
    chatPrompt: "As my Marketing function (Brand Beacon / Social Pulse), educate me on one high-leverage visibility move.",
  },
  {
    id: "authority",
    council: "growth",
    name: "Brand & Authority",
    icon: Star,
    tagline: "Speaking, podcasting, publishing, PR, and events.",
    members: [
      { name: "Voice Amplifier", role: "PR Executive" },
      { name: "Stage Presence", role: "Speaking Coach" },
      { name: "Audio Storyteller", role: "Podcast Producer" },
      { name: "Page Turner", role: "Publishing Coach" },
    ],
    invitation:
      "There are opportunities to grow your authority and platform. Would you like me to show you a starting point?",
    deliverables: ["Signature talk outline", "Podcast pitch list", "PR angle ideas", "Book chapter map"],
    chatPrompt:
      "As my Brand & Authority function (Voice Amplifier / Stage Presence / Audio Storyteller / Page Turner), educate me on one way to grow my authority.",
  },
  {
    id: "partnerships",
    council: "growth",
    name: "Partnerships",
    icon: Handshake,
    tagline: "Collaborations, alliances, and referral relationships.",
    members: [{ name: "Alliance Builder", role: "Partnership Executive" }],
    invitation:
      "There are opportunities to grow through partnerships instead of more effort. Would you like to explore one together?",
    deliverables: ["Partner outreach list", "Collaboration proposal", "Referral program outline", "Affiliate plan"],
    chatPrompt: "As my Partnerships function (Alliance Builder), educate me on one partnership move that could expand my reach.",
  },
  {
    id: "customer-success",
    council: "growth",
    name: "Customer Success",
    icon: Heart,
    tagline: "Client experience, retention, and referrals.",
    members: [{ name: "Success Harmony", role: "Customer Success Manager" }],
    invitation:
      "There are opportunities to deepen your client experience and retention. Would you like to explore one together?",
    deliverables: ["Onboarding flow", "Check-in cadence", "Testimonial requests", "Retention playbook"],
    chatPrompt: "As my Customer Success function (Success Harmony), educate me on one way to improve client retention or referrals.",
  },

  // ---- Execution Council ----
  {
    id: "technology",
    council: "execution",
    name: "Technology",
    icon: Code2,
    tagline: "Tools, integrations, and a tech stack that works for you.",
    members: [
      { name: "Tech Architect", role: "CTO" },
      { name: "Integration Engineer", role: "Systems Integrator" },
    ],
    invitation:
      "There are opportunities to simplify and connect your tools so your tech works harder than you do. Would you like to explore where?",
    deliverables: ["Tech stack review", "Integration map", "Tool consolidation plan", "Data hygiene checklist"],
    chatPrompt: "As my Technology function (Tech Architect / Integration Engineer), educate me on one way to simplify or connect my tools.",
  },
  {
    id: "creative",
    council: "execution",
    name: "Creative",
    icon: Palette,
    tagline: "Visual branding, video, and design assets.",
    members: [
      { name: "Visual Narrator", role: "Video Content Creator" },
      { name: "Design Artisan", role: "Graphic Designer" },
    ],
    invitation: "There are opportunities to polish how your brand looks and feels. Would you like to explore them?",
    deliverables: ["Brand style notes", "Video scripts", "Social graphics briefs", "Slide templates"],
    chatPrompt: "As my Creative function (Visual Narrator / Design Artisan), educate me on one way to elevate my visual brand.",
  },
  {
    id: "execution-systems",
    council: "execution",
    name: "Execution & Systems",
    icon: Rocket,
    tagline: "Getting approved work shipped, consistently and on time.",
    members: [
      { name: "Flow Architect", role: "Operations Manager" },
      { name: "Systems Orchestrator", role: "Delivery Lead" },
    ],
    invitation:
      "There are opportunities to turn your plans into finished, shipped work more reliably. Would you like to see where we could tighten things up?",
    deliverables: ["Execution checklist", "Project tracker setup", "Launch runbook", "Weekly shipping cadence"],
    chatPrompt: "As my Execution & Systems function (Flow Architect / Systems Orchestrator), educate me on one way to ship approved work more reliably.",
  },
]

function FunctionCard({ area }: { area: FunctionArea }) {
  const [permission, setPermission] = useState<Permission>("pending")
  const [chatOpen, setChatOpen] = useState(false)
  const Icon = area.icon

  return (
    <Card className="border-2 border-[#5D9D61]/25">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5D9D61]/10">
            <Icon className="h-6 w-6 text-[#5D9D61]" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg text-[#3A2E33]">{area.name}</CardTitle>
            <CardDescription className="leading-relaxed">{area.tagline}</CardDescription>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {area.members.map((m) => (
            <Badge key={m.name} variant="secondary" className="bg-[#F5F1E8] font-normal text-[#3A2E33]">
              {m.name} · {m.role}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {permission === "pending" && (
          <div className="rounded-lg border border-[#E26C73]/20 bg-[#E26C73]/5 p-3">
            <p className="text-sm leading-relaxed text-[#3A2E33]">{area.invitation}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                className="bg-[#5D9D61] text-white hover:bg-[#5D9D61]/90"
                onClick={() => setPermission("yes")}
              >
                Yes, Show Me
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#5D9D61]/40 bg-transparent text-[#3A2E33]"
                onClick={() => setPermission("later")}
              >
                Maybe Later
              </Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setPermission("no")}>
                No Thanks
              </Button>
            </div>
          </div>
        )}

        {(permission === "later" || permission === "no") && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-[#F5F1E8]/70 p-3">
            <p className="text-sm text-[#3A2E33]">
              {permission === "later"
                ? "No rush — I'll keep this ready for whenever you're interested."
                : "Understood. We'll leave this one aside for now."}
            </p>
            <Button size="sm" variant="ghost" className="text-[#5D9D61]" onClick={() => setPermission("pending")}>
              Reconsider
            </Button>
          </div>
        )}

        {permission === "yes" && (
          <div className="space-y-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#3A2E33]">
                <Clock className="h-4 w-4 text-[#E26C73]" />
                Deliverables catalog
                <Badge variant="outline" className="border-[#E26C73]/40 font-normal text-[#E26C73]">
                  Coming soon
                </Badge>
              </p>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {area.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#5D9D61]" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full bg-[#E26C73] text-white hover:bg-[#E26C73]/90" onClick={() => setChatOpen(true)}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Educate me with Cherry Blossom
            </Button>
          </div>
        )}
      </CardContent>

      {chatOpen && (
        <CherryBlossomChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          prefillMessage={area.chatPrompt}
          conversationTitle={`${area.name} — AI Executive Leadership Team`}
          executiveRole={`Cherry Blossom - ${area.name} Guide`}
        />
      )}
    </Card>
  )
}

/** Cherry Blossom — the coordinating Executive Advisor & Chief of Staff. */
function CherryBlossomCard() {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <Card className="border-2 border-[#E26C73]/35 bg-gradient-to-br from-[#E26C73]/5 to-transparent">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E26C73]/10">
            <Flower2 className="h-6 w-6 text-[#E26C73]" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg text-[#3A2E33]">Cherry Blossom™</CardTitle>
            <CardDescription className="leading-relaxed">Executive Advisor &amp; Chief of Staff</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-[#3A2E33]">
          {
            "I coordinate every council, introduce each executive, summarize their recommendations, and hold the memory of your business across all departments. You're always the CEO — I make sure it all works together for you."
          }
        </p>
        <Button className="w-full bg-[#E26C73] text-white hover:bg-[#E26C73]/90" onClick={() => setChatOpen(true)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Talk with Cherry Blossom
        </Button>
      </CardContent>
      {chatOpen && (
        <CherryBlossomChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          conversationTitle="Cherry Blossom — Executive Advisor & Chief of Staff"
          executiveRole="Cherry Blossom - Executive Advisor & Chief of Staff"
        />
      )}
    </Card>
  )
}

/** AI Transformation Executive™ — links to its dedicated command center above. */
function AITransformationCard() {
  return (
    <Card className="border-2 border-[#5D9D61]/35 bg-gradient-to-br from-[#5D9D61]/5 to-transparent">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5D9D61]/10">
            <Bot className="h-6 w-6 text-[#5D9D61]" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg text-[#3A2E33]">AI Transformation Executive™</CardTitle>
            <CardDescription className="leading-relaxed">Chief AI Officer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-[#3A2E33]">
          {
            "I own your AI transformation strategy — helping you increase Founder Capacity™, reduce Founder Risk™, and adopt AI responsibly, while protecting the human work only you can do. I have a dedicated command center in this dashboard."
          }
        </p>
        <Button
          className="w-full bg-[#5D9D61] text-white hover:bg-[#5D9D61]/90"
          onClick={() =>
            document.getElementById("ai-transformation-executive")?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          Open AI Transformation Command Center
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export function AIExecutiveLeadershipTeam() {
  return (
    <div className="space-y-8">
      <div>
        <p className="leading-relaxed text-[#3A2E33]">
          {"Your "}
          <strong>AI Executive Leadership Team™</strong>
          {
            " is organized into three councils — Strategy, Growth, and Execution. Each function educates you, recommends your next best move, and — soon — will build deliverables for your approval. Nothing happens without your permission."
          }
        </p>
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#E26C73]/20 bg-[#E26C73]/5 p-3">
          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E26C73]" />
          <p className="text-sm leading-relaxed text-[#3A2E33]">
            {"Cherry Blossom coordinates every council. You're always the CEO — you decide "}
            <em>Yes, Show Me</em>
            {", "}
            <em>Maybe Later</em>
            {", or "}
            <em>No Thanks</em>
            {"."}
          </p>
        </div>
      </div>

      {COUNCILS.map((council) => (
        <section key={council.id}>
          <div className="mb-3 border-l-4 border-[#5D9D61] pl-3">
            <h3 className="text-base font-bold text-[#3A2E33]">{council.name}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{council.description}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {council.id === "strategy" && (
              <>
                <CherryBlossomCard />
                <AITransformationCard />
              </>
            )}
            {FUNCTIONS.filter((f) => f.council === council.id).map((area) => (
              <FunctionCard key={area.id} area={area} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
