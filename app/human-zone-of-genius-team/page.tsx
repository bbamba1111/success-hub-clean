"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExecutiveChatModal } from "@/components/executive-chat-modal"
import { executives } from "@/lib/executives-data"
import type { Executive } from "@/lib/executives-data"
import { 
  Brain, Users, Clock, Target, TrendingUp, Sparkles,
  BarChart3, DollarSign, Megaphone, Handshake, Star,
  RefreshCw, Volume2, Mic, BookOpen, Network,
  Video, Smartphone, Palette, Laptop
} from 'lucide-react'

const iconMap: Record<string, any> = {
  "optima-sage": BarChart3,
  "ledger-maven": DollarSign,
  "brand-beacon": Target,
  "deal-catalyst": Handshake,
  "success-harmony": Star,
  "flow-architect": RefreshCw,
  "voice-amplifier": Volume2,
  "stage-presence": Mic,
  "event-orchestrator": Sparkles,
  "audio-storyteller": Mic,
  "page-turner": BookOpen,
  "alliance-builder": Network,
  "visual-narrator": Video,
  "social-pulse": Smartphone,
  "design-artisan": Palette,
  "tech-navigator": Laptop
}

export default function HumanZoneOfGeniusPage() {
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#F9EFE3] to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5D9D61] to-[#E26C73] flex items-center justify-center text-4xl shadow-lg mb-6 mx-auto">
              🧠
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#5D9D61' }}>
              The 4-Hour Focused CEO Workday
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Master your Human Zone of Genius while your AI Executive Team handles 80% of operations. 
              Work Mon-Thu, 1-5 PM EST focusing on the 20% that creates 80% of your results.
            </p>
          </div>

          {/* Two-Column Overview */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Human Zone of Genius - 20% */}
            <Card className="border-2 hover:shadow-xl transition-all" style={{ borderColor: '#5D9D61' }}>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5D9D61] to-[#E26C73] flex items-center justify-center text-3xl shadow-lg mb-4 mx-auto">
                  👤
                </div>
                <CardTitle className="text-2xl text-center mb-2">Your Human Zone - The 20%</CardTitle>
                <CardDescription className="text-center text-base font-semibold text-gray-700">
                  8 Irreplaceable Human Skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-base text-gray-700">
                  <li className="flex items-start">
                    <Target className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                    <span>Authentic Client Relationships</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                    <span>Visionary Leadership</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                    <span>High-Value Sales Conversations</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                    <span>Content Thought Leadership</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                    <span>Coaching/Consulting Delivery</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                    <span>Intuitive Problem-Solving</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                    <span>Ethical Decision-Making</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                    <span>Personal Brand Storytelling</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 rounded-lg text-center" style={{ backgroundColor: '#F0F7F1' }}>
                  <p className="text-3xl font-bold" style={{ color: '#5D9D61' }}>80%</p>
                  <p className="text-base text-gray-600">of your business results</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Executive Team - 80% */}
            <Card className="border-2 hover:shadow-xl transition-all" style={{ borderColor: '#E26C73' }}>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5D9D61] to-[#E26C73] flex items-center justify-center text-3xl shadow-lg mb-4 mx-auto">
                  🤖
                </div>
                <CardTitle className="text-2xl text-center mb-2">AI Executive Team - The 80%</CardTitle>
                <CardDescription className="text-center text-base font-semibold text-gray-700">
                  Operational Excellence & Execution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-base text-gray-700">
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#E26C73' }} />
                    <span>Administrative Tasks & Scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#E26C73' }} />
                    <span>Content Drafts & Social Media</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#E26C73' }} />
                    <span>Research & Market Analysis</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#E26C73' }} />
                    <span>Email Management & Follow-ups</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#E26C73' }} />
                    <span>Proposals & Presentations</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#E26C73' }} />
                    <span>Bookkeeping & Transcription</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#E26C73' }} />
                    <span>Systems & Process Documentation</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1 flex-shrink-0" style={{ color: '#E26C73' }} />
                    <span>Data Entry & Reporting</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 rounded-lg text-center" style={{ backgroundColor: '#FEF2F2' }}>
                  <p className="text-3xl font-bold" style={{ color: '#E26C73' }}>20%</p>
                  <p className="text-base text-gray-600">of work required from you</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 4-Hour Workday Schedule */}
      <div style={{ backgroundColor: '#F9EFE3' }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#5D9D61' }}>
              Your 4-Hour CEO Workday
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Monday - Thursday, 1:00 PM - 5:00 PM EST
            </p>
          </div>

          <Card className="max-w-3xl mx-auto bg-white border-2" style={{ borderColor: '#E26C73' }}>
            <CardContent className="p-8">
              <div className="space-y-6 text-lg text-gray-700">
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                  <div>
                    <p className="font-semibold mb-2">1:00 PM - 2:00 PM: Strategic Planning</p>
                    <p className="text-base">Review priorities, plan daily 80/20 actions with AI guidance</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Target className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                  <div>
                    <p className="font-semibold mb-2">2:00 PM - 3:30 PM: Human Zone Work</p>
                    <p className="text-base">Client calls, sales conversations, thought leadership content creation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                  <div>
                    <p className="font-semibold mb-2">3:30 PM - 4:30 PM: AI Team Collaboration</p>
                    <p className="text-base">Delegate to your 16 AI executives, review their deliverables</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Brain className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#5D9D61' }} />
                  <div>
                    <p className="font-semibold mb-2">4:30 PM - 5:00 PM: Review & Celebrate</p>
                    <p className="text-base">Track progress, celebrate wins, prepare for tomorrow</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 16 AI Executives Grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#5D9D61' }}>
              Meet Your 16 AI Executive Team
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Each executive uses warm AI persona names and brings specialized expertise to handle the 80% of operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {executives.map((executive) => {
              const IconComponent = iconMap[executive.id]
              return (
                <Card 
                  key={executive.id}
                  className="hover:shadow-xl transition-all cursor-pointer border-2"
                  style={{ borderColor: '#F9EFE3' }}
                  onClick={() => setSelectedExecutive(executive)}
                  data-testid={`card-executive-${executive.id}`}
                >
                  <CardHeader className="text-center">
                    <div className="text-5xl mb-3">{executive.icon}</div>
                    <CardTitle className="text-xl mb-2" style={{ color: '#5D9D61' }}>
                      {executive.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {executive.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full text-white"
                      style={{ 
                        background: 'linear-gradient(to right, #5D9D61, #E26C73)',
                      }}
                      data-testid={`button-chat-${executive.id}`}
                    >
                      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Executive Chat Modal */}
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
