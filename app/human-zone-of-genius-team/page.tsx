"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Sparkles, Brain, ArrowLeft, Target, Clock, Zap, Heart, MessageCircle, Lightbulb, Users, Award, Shield } from 'lucide-react'
import CherryBlossomChatModal from "@/components/cherry-blossom-chat-modal"
import { ExecutiveChatModal } from "@/components/executive-chat-modal"

const executives = [
  {
    id: "optima-sage",
    name: "Optima Sage",
    role: "COO",
    icon: "🎯",
    description: "Streamlines operations and optimizes processes for maximum efficiency.",
  },
  {
    id: "ledger-maven",
    name: "Ledger Maven",
    role: "CFO",
    icon: "💰",
    description: "Manages financial strategy, profitability, and pricing.",
  },
  {
    id: "brand-beacon",
    name: "Brand Beacon",
    role: "CMO",
    icon: "📢",
    description: "Crafts marketing strategies to attract ideal clients.",
  },
  {
    id: "deal-catalyst",
    name: "Deal Catalyst",
    role: "Sales Director",
    icon: "🤝",
    description: "Develops sales strategies and conversion systems.",
  },
  {
    id: "success-harmony",
    name: "Success Harmony",
    role: "Customer Success Manager",
    icon: "⭐",
    description: "Ensures exceptional client experiences and retention.",
  },
  {
    id: "flow-architect",
    name: "Flow Architect",
    role: "Operations Manager",
    icon: "⚙️",
    description: "Handles day-to-day operations and workflows.",
  },
  {
    id: "voice-amplifier",
    name: "Voice Amplifier",
    role: "PR Executive",
    icon: "📻",
    description: "Manages brand reputation and media relations.",
  },
  {
    id: "stage-presence",
    name: "Stage Presence",
    role: "Speaking Coach",
    icon: "🎤",
    description: "Helps secure speaking engagements and opportunities.",
  },
  {
    id: "event-orchestrator",
    name: "Event Orchestrator",
    role: "Virtual Events Director",
    icon: "🎪",
    description: "Plans engaging webinars and virtual events.",
  },
  {
    id: "audio-storyteller",
    name: "Audio Storyteller",
    role: "Podcast Producer",
    icon: "🎙️",
    description: "Guides through all aspects of podcasting.",
  },
  {
    id: "page-turner",
    name: "Page Turner",
    role: "Publishing Coach",
    icon: "📚",
    description: "Guides through book writing and publishing.",
  },
  {
    id: "alliance-builder",
    name: "Alliance Builder",
    role: "Partnership Executive",
    icon: "🔗",
    description: "Creates strategic partnerships and collaborations.",
  },
  {
    id: "visual-narrator",
    name: "Visual Narrator",
    role: "Video Content Creator",
    icon: "🎬",
    description: "Creates compelling marketing videos.",
  },
  {
    id: "social-pulse",
    name: "Social Pulse",
    role: "Social Media Executive",
    icon: "📱",
    description: "Develops social media strategies and content.",
  },
  {
    id: "design-artisan",
    name: "Design Artisan",
    role: "Graphic Designer",
    icon: "🎨",
    description: "Creates professional visual branding and design assets.",
  },
]

const workdayPillars = [
  { icon: Clock, title: "1:00-5:00 PM Focus", description: "Mon-Thu focused workday for maximum leverage" },
  { icon: Target, title: "80/20 Pareto Principle", description: "20% of work that generates 80% of results" },
  { icon: Brain, title: "Human-Only Skills", description: "8 high-value skills only you can do" },
  { icon: Zap, title: "AI Delegation", description: "AI handles 80% of administrative tasks" },
]

const humanSkills = [
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
    title: "Coaching/Consulting Delivery",
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

export default function HumanZoneOfGeniusTeam() {
  const [isAssessmentChatOpen, setIsAssessmentChatOpen] = useState(false)
  const [selectedExecutive, setSelectedExecutive] = useState<(typeof executives)[0] | null>(null)

  const assessmentPrefillMessage =
    "I want to design my personalized 4-Hour Focused CEO Workday (1:00-5:00 PM). Can you guide me through a comprehensive assessment to create my customized coaching/consulting business journey based on my zone of genius, entrepreneurial status, and work-life goals?"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* 1. HERO - Soft White */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#5D9D61]/20 via-[#E26C73]/20 to-[#5D9D61]/20 mb-6">
            <Sparkles className="w-10 h-10 text-[#5D9D61]" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-[#5D9D61]">
            Human Zone Of Genius Team
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
            Your dedicated command center above the AI Executive Team
          </p>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            In the AI Age, this is where you identify the 20% of high-value work that only YOU can do—the work that
            generates 80% of your results.
          </p>

          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-[#E26C73] hover:bg-[#E26C73]/90 text-white"
            onClick={() => setIsAssessmentChatOpen(true)}
            data-testid="button-start-assessment"
          >
            <Brain className="w-5 h-5 mr-2" />
            Start Your Zone of Genius Assessment
          </Button>
        </div>
      </section>

      {/* 2. 4 WORKDAY PILLARS - Soft Peachy Tan */}
      <section className="py-16 px-6 bg-[#FDF9F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#E26C73]">4 Workday Pillars</h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            The foundation of your 4-Hour Focused CEO Workday
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workdayPillars.map((pillar, index) => (
              <Card key={index} className="border-2 border-[#E26C73]/30">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#E26C73]/20 to-[#5D9D61]/20 mb-4">
                    <pillar.icon className="w-8 h-8 text-[#E26C73]" />
                  </div>
                  <CardTitle className="text-xl">{pillar.title}</CardTitle>
                  <CardDescription className="text-lg leading-relaxed">{pillar.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 8 HUMAN-ONLY SKILLS - Soft Coral Pink */}
      <section className="py-16 px-6 bg-[#FCF2F3]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#5D9D61]">Your 8 Human-Only Business Skills</h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            The 20% of high-value work that only YOU can do—building 6, 7, 8 figure+ businesses
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {humanSkills.map((skill, index) => (
              <Card key={index} className="border-l-4 border-l-[#E26C73]">
                <CardHeader>
                  <skill.icon className="w-10 h-10 mb-3 text-[#E26C73]" />
                  <CardTitle className="text-lg mb-2">
                    {index + 1}. {skill.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">{skill.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI EXECUTIVE TEAM SERVES YOU - Soft White */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#E26C73]">The AI Executive Team Serves You</h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            The AI Executive Team serves YOU. They guide you through starting, growing, and scaling your coaching or
            consulting business. They keep you in your Zone of Genius, handling operational tasks unless you choose to
            take on a specific role. Daily, they educate you on business progress and tell you the exact next-best-move
            for forward momentum toward 6, 7, 8 figure+ revenue.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className="border-2 border-[#5D9D61]/30">
              <CardHeader>
                <CardTitle className="text-xl text-[#5D9D61]">You (Human CEO) - The 20%</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Your 8 Human-Only Business Skills: authentic relationships, visionary leadership, high-value sales,
                  thought leadership, coaching delivery, intuitive problem-solving, ethical decisions, and personal
                  storytelling. This is where you create 80% of results.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-[#5D9D61]/30">
              <CardHeader>
                <CardTitle className="text-xl text-[#E26C73]">AI Executive Team - The 80%</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  They serve you by handling: administrative tasks, content drafts, research, scheduling, inquiries,
                  bookkeeping, transcription, proposals, social media, and operational execution. They educate you on
                  daily business progress and guide your next moves.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. YOUR 16 AI EXECUTIVE TEAM - Soft Peachy Tan */}
      <section className="py-20 px-6 bg-[#FDF9F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#5D9D61]">Your 16 AI Executive Team</h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Specialized AI executives ready to guide you through every aspect of your business
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {executives.map((exec) => (
              <Card
                key={exec.id}
                className="border-2 border-[#5D9D61]/30 hover:border-[#E26C73] transition-all cursor-pointer hover-elevate"
                onClick={() => setSelectedExecutive(exec)}
                data-testid={`card-executive-${exec.id}`}
              >
                <CardHeader>
                  <div className="text-5xl mb-3 text-center">{exec.icon}</div>
                  <CardTitle className="text-lg text-center">{exec.name}</CardTitle>
                  <CardDescription className="text-base font-semibold text-[#5D9D61] text-center">
                    {exec.role}
                  </CardDescription>
                  <CardDescription className="text-base leading-relaxed text-center pt-2">
                    {exec.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-[#E26C73] hover:bg-[#E26C73]/90 text-white"
                    data-testid={`button-chat-${exec.id}`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Coaching
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CherryBlossomChatModal
        isOpen={isAssessmentChatOpen}
        onClose={() => setIsAssessmentChatOpen(false)}
        prefillMessage={assessmentPrefillMessage}
        conversationTitle="Human Zone of Genius Assessment"
        executiveRole="Cherry Blossom - CEO Workday"
      />

      {selectedExecutive && (
        <ExecutiveChatModal
          isOpen={!!selectedExecutive}
          onClose={() => setSelectedExecutive(null)}
          executiveId={selectedExecutive.id}
          executiveName={selectedExecutive.name}
          executiveRole={selectedExecutive.role}
          executiveIcon={selectedExecutive.icon}
        />
      )}
    </div>
  )
}
