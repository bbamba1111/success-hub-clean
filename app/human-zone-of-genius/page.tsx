"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react'
import { ZoneOfGeniusChatModal } from "@/components/zone-of-genius-chat-modal"
import Link from "next/link"

export default function HumanZoneOfGeniusPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Hero Section - White Background */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Human Zone of Genius
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            In the age of AI, your human skills are your greatest competitive advantage. Discover and develop your 8 irreplaceable human-only business skills.
          </p>
          
          <Button 
            onClick={() => setIsChatOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-6 text-xl"
          >
            <Brain className="mr-2 h-6 w-6" />
            Start Your Zone of Genius Assessment
          </Button>
        </div>
      </div>

      {/* 8 Human Skills Section - Peachy Background */}
      <div style={{ backgroundColor: '#FFE8D6' }} className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your 8 Human-Only Business Skills
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Authentic Relationships", description: "Building genuine connections that AI cannot replicate" },
              { title: "Visionary Leadership", description: "Setting direction and inspiring others with your vision" },
              { title: "High-Value Sales", description: "Consultative selling and closing transformational deals" },
              { title: "Thought Leadership", description: "Creating original insights and content that positions you as an authority" },
              { title: "Coaching Delivery", description: "Transformational client work that requires human intuition" },
              { title: "Intuitive Problem-Solving", description: "Creative solutions that go beyond algorithmic thinking" },
              { title: "Ethical Decisions", description: "Values-based business choices that reflect your principles" },
              { title: "Personal Storytelling", description: "Sharing your unique journey in a way that resonates" }
            ].map((skill, index) => (
              <Card key={index} className="bg-white border-2 border-gray-200 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">{skill.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{skill.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Command Center Section - White Background */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Command Center Above the AI Team
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700">You (Human CEO) - The 20%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Your 8 Human-Only Business Skills: authentic relationships, visionary leadership, high-value sales, thought leadership, coaching delivery, intuitive problem-solving, ethical decisions, and personal storytelling.
                </p>
                <p className="text-lg font-bold text-purple-700">This is where you create 80% of results.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">AI Executive Team - The 80%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  They serve you by handling: administrative tasks, content drafts, research, scheduling, inquiries, bookkeeping, transcription, proposals, social media, and operational execution.
                </p>
                <p className="text-lg font-bold text-green-700">They educate you on daily business progress and guide your next moves.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 4 Hours Sweet Spot Section - Tan Background */}
      <div style={{ backgroundColor: '#F5E6D3' }} className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            4 Hours is Your Sweet Spot
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
            Monday through Thursday, 1:00-5:00 PM EST is your structured 4-hour workday focused entirely on the 20% of work that generates 80% of your results while AI handles the rest.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Next Best Move</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Each business day, the AI tells you exactly what needle-moving action to focus on for maximum leverage and forward momentum.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Progress Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  The AI team educates you daily on what's happening in your business, showing your accomplishments and guiding you to 6, 7, 8 figure+ revenue.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Mon-Thu 1-5pm EST</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Your structured 4-hour workday focused entirely on the 20% of work that generates 80% of your results while AI handles the rest.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Top Coaches Section - White Background */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Top Coaches Choose This Approach
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
              <CardHeader>
                <CardTitle className="text-xl">15 AI Executives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  15 business executives (COO to Graphic Designer) for comprehensive support across all business functions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
              <CardHeader>
                <CardTitle className="text-xl">AI-Powered Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Educational coaching that teaches you how to implement strategies with clear step-by-step guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
              <CardHeader>
                <CardTitle className="text-xl">Available Mon-Thu 1-5 PM ET</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Get expert coaching during business hours aligned with the 4-Hour CEO Workday, no scheduling required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Ready to Plan CTA - Green Background */}
      <div style={{ backgroundColor: '#E8F5E9' }} className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Plan Your 4-Hour CEO Workday?
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Start with your Zone of Genius Assessment, then meet your full AI Executive Team who will support you daily.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setIsChatOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-6 text-lg"
            >
              <Brain className="mr-2 h-5 w-5" />
              Start Zone Assessment
            </Button>
            
            <Link href="/ai-executive-team">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-purple-500 text-purple-700 hover:bg-purple-50 font-bold px-8 py-6 text-lg w-full sm:w-auto"
              >
                <Users className="mr-2 h-5 w-5" />
                Meet AI Executive Team
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Executive Team Support Section - Tan Background */}
      <div style={{ backgroundColor: '#F5E6D3' }} className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Your Executive Team Supports Your Daily Focus
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl">
                    ⚙️
                  </div>
                  <div>
                    <CardTitle className="text-lg">Optima Sage</CardTitle>
                    <p className="text-sm text-gray-600">COO</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  Your Chief Operating Officer handles systems, processes, and operational efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-2xl">
                    💰
                  </div>
                  <div>
                    <CardTitle className="text-lg">Ledger Maven</CardTitle>
                    <p className="text-sm text-gray-600">CFO</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  Your Chief Financial Officer manages revenue optimization and financial planning.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-orange-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl">
                    📢
                  </div>
                  <div>
                    <CardTitle className="text-lg">Brand Beacon</CardTitle>
                    <p className="text-sm text-gray-600">CMO</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  Your Chief Marketing Officer builds your brand and lead generation strategies.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/ai-executive-team">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold px-8 py-4"
              >
                <Users className="mr-2 h-5 w-5" />
                Meet All 15 Executives
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ZoneOfGeniusChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  )
}
