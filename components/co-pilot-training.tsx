"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock, Target, Shield, Brain, Heart, CheckCircle, Download, Zap } from "lucide-react"

export function CoPilotTraining() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <Card className="border-2 border-[#7FB069] bg-gradient-to-br from-white to-[#7FB069]/5">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <Badge className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0 mb-2">
                Step 2: Build Your Foundation
              </Badge>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent">
                Train Your Personal AI Co-Pilot
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Your Personal AI Co-Pilot is pre-loaded with the{" "}
            <span className="font-bold text-[#7FB069]">Make Time For More™ Monthly Business Model & SOP</span> — the
            exact system you're experiencing right now. It's trained to protect your 4-day work week, enforce your
            4-hour CEO workday, and keep you in your zone of genius while AI handles everything else.
          </p>

          <div className="bg-gradient-to-r from-[#E26C73]/10 to-[#7FB069]/10 p-6 rounded-xl border-2 border-[#E26C73]/20">
            <h4 className="font-bold text-[#E26C73] mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              What Makes This Different
            </h4>
            <p className="text-gray-700 leading-relaxed">
              You're not just learning AI tools — you're{" "}
              <span className="font-bold">installing yourself into a sustainable operating system</span> while your
              co-pilot builds the business infrastructure. You'll experience time freedom NOW while proving the model
              works, not after you "earn it."
            </p>
          </div>

          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold"
            size="lg"
          >
            {isExpanded ? "Hide Co-Pilot Training Details" : "Start Building Your Co-Pilot"}
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Expanded Training Content */}
      {isExpanded && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* What's Pre-Loaded Section */}
          <Card className="border-2 border-[#7FB069]/30 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#7FB069] flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Your Co-Pilot Comes Pre-Loaded With
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">4-Day Work Week Framework</h5>
                      <p className="text-sm text-gray-600">
                        Automatically blocks your calendar, refuses meetings on off days, protects your 152 hours for
                        life
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">4-Hour CEO Workday Structure</h5>
                      <p className="text-sm text-gray-600">
                        Tells you when to stop: "Your 4 hours are up, I'll handle the rest"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Non-Negotiable Schedule Template</h5>
                      <p className="text-sm text-gray-600">
                        Morning routine, workout window, lunch break, CEO focus time, lifestyle experiences, digital
                        detox
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Anti-Hustle Guardrails</h5>
                      <p className="text-sm text-gray-600">
                        Detects hustle patterns and redirects: "That's old programming. Let me automate this instead."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Monthly Work-Lifestyle Intentions</h5>
                      <p className="text-sm text-gray-600">
                        Guides you to set and track your Desired Work-Lifestyle Intention each month for the 8 months
                        you work
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">12 Life Value Areas Integration</h5>
                      <p className="text-sm text-gray-600">
                        Suggests activities and tools based on your audit results (spiritual, physical, emotional, etc.)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Zone of Genius Filter</h5>
                      <p className="text-sm text-gray-600">
                        Constantly asks: "Is this in your genius zone? If no, I'll handle it or find who/what can."
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">8-Month Work Calendar</h5>
                      <p className="text-sm text-gray-600">
                        Respects your 4 months off per year, tracks sabbaticals, plans breaks after 28-day cycles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Steps */}
          <Card className="border-2 border-[#E26C73]/30 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#E26C73] flex items-center gap-2">
                <Brain className="h-5 w-5" />
                How to Train Your Co-Pilot on YOU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-gray-700">
                  Now that your co-pilot knows the <span className="font-bold">Make Time For More™ SOP</span>, it's time
                  to teach it about YOUR specific business, voice, values, and goals:
                </p>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="bg-[#7FB069]/5 p-4 rounded-lg border border-[#7FB069]/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#7FB069] text-white flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 mb-2">Feed It Your Audit Results</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Your co-pilot will automatically import your AI Business Audit results (passions, purpose,
                          values, zone of genius, business goals, life priorities).
                        </p>
                        <Button size="sm" className="bg-[#7FB069] hover:bg-[#6FA055] text-white">
                          <Download className="mr-2 h-4 w-4" />
                          Import Audit Results
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-[#E26C73]/5 p-4 rounded-lg border border-[#E26C73]/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#E26C73] text-white flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 mb-2">Train It On Your Voice & Communication Style</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Upload 5-10 sample emails, social posts, or content pieces so your co-pilot learns how YOU
                          communicate.
                        </p>
                        <Button size="sm" className="bg-[#E26C73] hover:bg-[#D55A60] text-white">
                          <Zap className="mr-2 h-4 w-4" />
                          Upload Voice Samples
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-[#7FB069]/5 p-4 rounded-lg border border-[#7FB069]/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#7FB069] text-white flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 mb-2">Set Your Monthly Work-Lifestyle Intention</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Tell your co-pilot your Desired Work-Lifestyle Intention for this month (from your 28-day
                          intention setting).
                        </p>
                        <Button size="sm" className="bg-[#7FB069] hover:bg-[#6FA055] text-white">
                          <Target className="mr-2 h-4 w-4" />
                          Set This Month's Intention
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-[#E26C73]/5 p-4 rounded-lg border border-[#E26C73]/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#E26C73] text-white flex items-center justify-center font-bold flex-shrink-0">
                        4
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 mb-2">Configure Your Business Context</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Tell it: What you sell, who you serve, your offers, your pricing, your unique methodology,
                          your current processes.
                        </p>
                        <Button size="sm" className="bg-[#E26C73] hover:bg-[#D55A60] text-white">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Add Business Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-[#7FB069]/5 p-4 rounded-lg border border-[#7FB069]/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#7FB069] text-white flex items-center justify-center font-bold flex-shrink-0">
                        5
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 mb-2">Test & Calibrate</h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Have a conversation with your co-pilot. Ask it to draft an email, create content, make a
                          decision. See how it sounds. Adjust and refine.
                        </p>
                        <Button size="sm" className="bg-[#7FB069] hover:bg-[#6FA055] text-white">
                          <Clock className="mr-2 h-4 w-4" />
                          Start Test Conversation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="border-2 border-[#7FB069] bg-gradient-to-br from-[#7FB069]/5 to-[#E26C73]/5">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#7FB069]" />
                What Happens After Training
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Once your co-pilot is trained, it becomes your daily partner throughout your 4-hour CEO workday:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-[#7FB069]/20">
                  <h5 className="font-semibold text-[#7FB069] mb-2">Morning Briefing</h5>
                  <p className="text-sm text-gray-600">
                    "Good morning! Here's your 4-hour CEO focus for today. I've handled your emails and prepared your
                    content."
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-[#E26C73]/20">
                  <h5 className="font-semibold text-[#E26C73] mb-2">Strategic Decision Partner</h5>
                  <p className="text-sm text-gray-600">
                    Helps you make CEO-level decisions based on your values, goals, and the Make Time For More™
                    framework.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-[#7FB069]/20">
                  <h5 className="font-semibold text-[#7FB069] mb-2">Content & Communication</h5>
                  <p className="text-sm text-gray-600">
                    Creates emails, social posts, blog content in YOUR voice while you focus on strategy.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-[#E26C73]/20">
                  <h5 className="font-semibold text-[#E26C73] mb-2">Work-Life Balance Coach</h5>
                  <p className="text-sm text-gray-600">
                    "You've worked 4 hours today. Time to power down. What life experience are you choosing this
                    afternoon?"
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 p-6 rounded-xl border-2 border-[#7FB069]/20 mt-6">
                <h5 className="font-bold text-gray-900 mb-3">Your Co-Pilot Becomes:</h5>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#7FB069]" />
                    <span>Your Executive Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E26C73]" />
                    <span>Your Accountability Partner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#7FB069]" />
                    <span>Your Content Creator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E26C73]" />
                    <span>Your Decision Advisor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#7FB069]" />
                    <span>Your Time Guardian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E26C73]" />
                    <span>Your Anti-Hustle Intervention</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
