"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, BarChart3, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const executives = [
    {
      name: "Optima Sage",
      role: "COO",
      description: "Streamlines operations and optimizes processes for maximum efficiency.",
      tags: ["Process Optimization", "Team Management", "Systems Design"]
    },
    {
      name: "Ledger Maven",
      role: "CFO",
      description: "Manages financial strategy, pricing, and profitability.",
      tags: ["Financial Planning", "Pricing Strategy", "Cash Flow"]
    },
    {
      name: "Brand Beacon",
      role: "CMO",
      description: "Crafts marketing strategies to attract ideal clients.",
      tags: ["Brand Strategy", "Content Marketing", "Lead Generation"]
    },
    {
      name: "Deal Catalyst",
      role: "Sales Director",
      description: "Develops sales strategies to convert prospects into clients.",
      tags: ["Sales Strategy", "Conversion", "Objection Handling"]
    },
    {
      name: "Success Harmony",
      role: "Customer Success Manager",
      description: "Ensures client satisfaction and exceptional experiences.",
      tags: ["Client Onboarding", "Retention", "Experience Design"]
    },
    {
      name: "Flow Architect",
      role: "Operations Manager",
      description: "Handles day-to-day operations and systems.",
      tags: ["Systems", "Tool Selection", "Process Documentation"]
    },
    {
      name: "Voice Amplifier",
      role: "PR Executive",
      description: "Manages brand reputation and media relations.",
      tags: ["Media Relations", "Brand Reputation"]
    },
    {
      name: "Stage Presence",
      role: "Speaking Coach",
      description: "Helps secure and prepare for speaking engagements.",
      tags: ["Speaking Opportunities", "Presentation Skills"]
    },
    {
      name: "Event Orchestrator",
      role: "Virtual Events Director",
      description: "Plans engaging webinars and online events.",
      tags: ["Webinar Strategy", "Event Planning"]
    },
    {
      name: "Audio Storyteller",
      role: "Podcast Producer",
      description: "Guides through all aspects of podcasting.",
      tags: ["Podcast Strategy", "Content Creation"]
    },
    {
      name: "Page Turner",
      role: "Publishing Coach",
      description: "Guides through book writing and publishing.",
      tags: ["Book Writing", "Publishing Strategy"]
    },
    {
      name: "Alliance Builder",
      role: "Partnership Executive",
      description: "Creates strategic partnerships.",
      tags: ["Partnership Development", "Collaboration"]
    },
    {
      name: "Visual Narrator",
      role: "Video Creator",
      description: "Creates compelling marketing videos.",
      tags: ["Video Production", "Visual Storytelling"]
    },
    {
      name: "Social Pulse",
      role: "Social Media Executive",
      description: "Develops social media strategies.",
      tags: ["Social Strategy", "Community Building"]
    },
    {
      name: "Design Artisan",
      role: "Graphic Designer",
      description: "Creates professional visual branding and design assets.",
      tags: ["Visual Branding", "Design Assets"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-[#E26C73]" />
            <span className="text-xl font-bold text-gray-900">4-Hour CEO</span>
          </div>
          <Link href="/auth/login">
            <Button variant="outline" className="border-[#E26C73] text-[#E26C73] hover:bg-[#E26C73] hover:text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Your Personal Team of <br />
            <span className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] bg-clip-text text-transparent">
              Executive Coaches
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Get expert coaching from 21 specialized AI guides (15 business executives + 6 work-life balance co-guides)
            to grow your coaching or consulting business. Available Monday-Thursday, 9:00 AM to 5:00 PM ET to help you
            strategize, execute, and scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white font-semibold px-8 py-6 text-lg"
              >
                Start Free Session
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/ai-executive-team">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#E26C73] text-[#E26C73] hover:bg-[#E26C73] hover:text-white font-semibold px-8 py-6 text-lg"
              >
                Meet Your Executives
              </Button>
            </Link>
          </div>
        </div>

        {/* Why Top Coaches Choose 4-Hour CEO */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-[#7FB069] text-center mb-12">Why Top Coaches Choose 4-Hour CEO</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-[#E26C73]/20 hover:border-[#E26C73] transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#7FB069]">21 Specialized AI Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  15 business executives (COO to Graphic Designer) plus 6 work-life balance co-guides for comprehensive
                  support.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#7FB069]/20 hover:border-[#7FB069] transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#E26C73]">AI-Powered Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Educational coaching that teaches you how to implement strategies with clear step-by-step guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#E26C73]/20 hover:border-[#E26C73] transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[#7FB069]">Available Mon-Thu 9-5 ET</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Get expert coaching during business hours aligned with the 4-Hour CEO Workday, no scheduling required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Your Executive Team */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-[#7FB069] text-center mb-6">Your Executive Team</h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Each executive brings specialized expertise to help you grow your coaching or consulting business.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executives.map((exec, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-[#E26C73] transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <CardTitle className="text-xl text-gray-900 mb-1">{exec.name}</CardTitle>
                      <p className="text-[#E26C73] font-semibold">{exec.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{exec.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {exec.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#7FB069]/10 text-[#7FB069] text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Coaching Business?</h2>
          <p className="text-xl mb-8 text-white/90">
            Start your first coaching session today and experience the power of 21 specialized AI guides.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-white text-[#E26C73] hover:bg-gray-100 font-semibold px-8 py-6 text-lg"
            >
              Start Free Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
