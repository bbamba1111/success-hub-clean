"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target, TrendingUp, Calendar, Sparkles } from 'lucide-react'
import ChatShell from "@/components/chat-shell"
import { getExecutive } from "@/lib/executives-config"
import { ZoneOfGeniusChatModal } from "@/components/zone-of-genius-chat-modal"

export default function HumanZoneOfGeniusPage() {
  const [showChatModal, setShowChatModal] = useState(false)

  const executive = getExecutive("zone-of-genius")

  const humanSkills = [
    {
      number: "1",
      title: "Authentic Client Relationships",
      description: "Deep empathy, emotional intelligence, and genuine human connection that builds trust and long-term client relationships AI cannot replicate."
    },
    {
      number: "2",
      title: "Visionary Leadership",
      description: "Setting strategic direction, defining your unique methodology, and making high-level business decisions that shape your company's future."
    },
    {
      number: "3",
      title: "High-Value Sales Conversations",
      description: "Discovery calls, enrollment conversations, and relationship-based selling where your intuition and human presence close premium clients."
    },
    {
      number: "4",
      title: "Content Thought Leadership",
      description: "Your unique voice, perspective, and insights that position you as the authority. AI drafts, but your authentic experience makes it powerful."
    },
    {
      number: "5",
      title: "Strategic Partnerships & Networking",
      description: "Building mutually beneficial relationships, collaborations, and alliances that expand your reach and create new opportunities."
    },
    {
      number: "6",
      title: "Creative Vision & Innovation",
      description: "Designing unique offers, creating signature frameworks, and innovating solutions that differentiate you in the marketplace."
    },
    {
      number: "7",
      title: "Ethical Decision-Making",
      description: "Values-based leadership, cultural sensitivity, and navigating complex ethical situations that require human judgment and integrity."
    },
    {
      number: "8",
      title: "Personal Brand Storytelling",
      description: "Sharing your journey, vulnerabilities, and transformation story that creates emotional resonance and attracts ideal clients to you."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9EFE3] to-[#FEFAF5]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/4-hour-workday">
          <Button variant="ghost" className="mb-8 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#E26C73] flex items-center justify-center shadow-lg">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Human Zone Of Genius
          </h1>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4 leading-relaxed">
            Your dedicated office for discovering and leveraging your unique human capabilities
          </p>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            In the AI Age, this is where you identify the 20% of high-value work that only YOU can do—the work that generates 80% of your results.
          </p>

          <Button 
            onClick={() => setShowChatModal(true)}
            size="lg"
            className="bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold px-10 py-6 text-lg rounded-lg shadow-lg"
          >
            <Target className="mr-2 h-5 w-5" />
            Start Your Zone of Genius Assessment
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Your AI Team Serves You Daily
        </h2>
        
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Monday through Thursday, 1:00-5:00 PM EST, your AI Executive Team guides you through the exact next-best-move for forward momentum in your coaching or consulting business using the 80/20 Pareto Principle.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-[#E26C73]/10 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-[#E26C73]" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Next Best Move</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Each business day, the AI tells you exactly what needle-moving action to focus on for maximum leverage and forward momentum.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-[#5D9D61]/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-[#5D9D61]" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Progress Education</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                The AI team educates you daily on what's happening in your business, showing your accomplishments and guiding you to 6, 7, 8 figure+ revenue.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-[#E26C73]/10 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-[#E26C73]" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Mon-Thu 1-5pm EST</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Your structured 4-hour workday focused entirely on the 20% of work that generates 80% of your results while AI handles the rest.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Your 8 Human-Only Business Skills
        </h2>
        
        <p className="text-lg text-center text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
          These are the specific skills you'll develop and focus on daily. These are what only YOU can do—the high-value work that builds 6, 7, 8 figure+ coaching and consulting businesses. The AI team handles everything else.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {humanSkills.map((skill) => (
            <Card 
              key={skill.number}
              className="bg-white border-l-4 border-l-[#E26C73] border-t border-r border-b border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="text-2xl font-bold text-[#E26C73] mt-1">
                    {skill.number}.
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                    {skill.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed pl-9">
                  {skill.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-[#5D9D61]/5 to-[#E26C73]/5 border-2 border-[#E26C73]/20 mb-20">
          <CardContent className="pt-8 pb-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
              While You Focus on These 8 Skills...
            </h3>
            <p className="text-lg text-center text-gray-600 leading-relaxed">
              Your AI Executive Team handles: <span className="font-semibold text-gray-800">administrative tasks, content drafting, research, scheduling, email management, bookkeeping, transcription, proposals, social media posting, and all operational execution.</span>
            </p>
          </CardContent>
        </Card>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Your Personalized Business Journey
          </h2>
          
          <p className="text-lg text-center text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Through a comprehensive 13-step assessment, you'll discover your entrepreneurial status, passions, skills, zone of genius, and create a customized 3-phase roadmap (Foundation → Momentum → Mastery) for building your coaching or consulting business. Your AI team will then guide you daily on your next-best-move.
          </p>

          <Card className="bg-white border-2 border-[#E26C73]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Your Assessment Creates Your Daily Roadmap:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-[#E26C73] mt-1">→</div>
                <p className="text-gray-700 leading-relaxed">
                  Your 2-3 core human-only skills from the 8 categories to develop daily
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#E26C73] mt-1">→</div>
                <p className="text-gray-700 leading-relaxed">
                  What to STOP doing (delegate to AI/team) vs. START doing (your CEO-level work)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#E26C73] mt-1">→</div>
                <p className="text-gray-700 leading-relaxed">
                  Daily next-best-move guidance (Mon-Thu 1-5pm) for needle-moving 80/20 actions
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#E26C73] mt-1">→</div>
                <p className="text-gray-700 leading-relaxed">
                  AI education on your business progress, accomplishments, and path to 6-7-8 figures
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#E26C73] mt-1">→</div>
                <p className="text-gray-700 leading-relaxed">
                  Phase-specific 4-Hour CEO Workday structure (Foundation, Momentum, or Mastery)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button 
              onClick={() => setShowChatModal(true)}
              size="lg"
              className="bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold px-10 py-6 text-lg rounded-lg shadow-lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Begin Your Assessment
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Your Command Center Above the AI Team
          </h2>
          
          <p className="text-lg text-center text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            The AI Executive Team serves YOU. They guide you through starting, growing, and scaling your coaching or consulting business. They keep you in your Zone of Genius, handling operational tasks unless you choose to take on a specific role. Daily, they educate you on business progress and tell you the exact next-best-move for forward momentum toward 6, 7, 8 figure+ revenue.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-[#E26C73]/5 to-[#E26C73]/10 border-2 border-[#E26C73]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  You (Human CEO) - The 20%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your 8 Human-Only Business Skills: <span className="font-semibold">authentic relationships, visionary leadership, high-value sales, thought leadership, coaching delivery, intuitive problem-solving, ethical decisions, and personal storytelling.</span>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This is where you create 80% of results.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#5D9D61]/5 to-[#5D9D61]/10 border-2 border-[#5D9D61]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  AI Executive Team - The 80%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  They serve you by handling: <span className="font-semibold">administrative tasks, content drafts, research, scheduling, inquiries, bookkeeping, transcription, proposals, social media, and operational execution.</span>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  They educate you on daily business progress and guide your next moves.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/4-hour-workday">
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-[#5D9D61] text-[#5D9D61] hover:bg-[#5D9D61] hover:text-white font-semibold px-10 py-6 text-lg rounded-lg"
              >
                Meet Your AI Executive Team
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ZoneOfGeniusChatModal 
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
    </div>
  )
}
