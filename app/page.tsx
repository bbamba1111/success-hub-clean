"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Target, TrendingUp, Calendar, Zap, Moon, CheckCircle, Star } from 'lucide-react'
import CherryBlossomCountdown from "@/components/cherry-blossom-countdown"
import WorkLifeBalanceSchedule from "@/components/work-life-balance-schedule"

export default function HomePage() {
  const [dashboardVisited, setDashboardVisited] = useState(false)

  useEffect(() => {
    const visited = localStorage.getItem("dashboardVisited")
    if (visited === "true") {
      setDashboardVisited(true)
    }
  }, [])

  const scrollToWellnessDashboard = () => {
    const element = document.getElementById("wellness-dashboard")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  M
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  Make Time For More<sup className="text-lg">™</sup> Monthly
                  <br />
                  Success Hub
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Take The Audit, Set Your 28-Day Intention, and access Cherry Blossom your AI Powered Work-Life Balance
                  Co-Guide. Experience non-negotiable co-working, community connections, wellness tracking, personalized
                  guidance and more -- all in one{" "}
                  <button
                    onClick={scrollToWellnessDashboard}
                    className={`font-bold underline transition-colors ${
                      dashboardVisited
                        ? "text-[#7FB069] hover:text-[#6FA055] cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!dashboardVisited}
                  >
                    Dashboard
                  </button>
                  .
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Diverse women enjoying tea together in cherry blossom garden"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 - Onboarding Section */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              M
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Step 1
            </Badge>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#7FB069] mb-4">
              Complete Onboarding: Your First 3-Steps to Balance, Freedom & Success...
            </h2>
            <p className="text-lg text-gray-600">
              Complete these three essential steps to prepare for your transformation journey
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Step 1.1 - Audit Card */}
            <Card className="bg-[#7FB069] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    M
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                    Step 1.1
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">Take The Work-Life Balance Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Discover exactly where you stand across 15 key life areas with our comprehensive assessment. Get
                  personalized insights and identify your biggest opportunities for growth.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">15-question comprehensive assessment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Instant personalized results</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">AI-powered insights from Cherry Blossom</span>
                  </div>
                </div>

                <div className="mt-6 mb-4">
                  <a
                    href="https://join.butter.us/make-time-for-more/audit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-white hover:bg-gray-50 text-[#7FB069] border-2 border-white font-semibold">
                      Join The Work-Life Balance Audit
                    </Button>
                  </a>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/audit" className="block">
                    <Button size="lg" className="w-full bg-white text-[#7FB069] hover:bg-gray-50 font-semibold">
                      Take The Work-Life Balance Audit
                    </Button>
                  </Link>
                  <a
                    href="https://chatgpt.com/g/g-68d2da76c4d881919bf0ff4131ac8ca8-your-work-life-balance-audit-review-2-0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-[#7FB069] bg-transparent"
                    >
                      Review Your Audit with Cherry Blossom
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Step 1.2 - Intention Setting Card */}
            <Card className="bg-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    M
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                    Step 1.2
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Set Your 28-Day Desired Work-LifeStyle Intention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Transform your audit insights into powerful, actionable intentions. Choose 1-3 focus areas and let
                  Cherry Blossom guide you through creating your personalized 28-day transformation plan.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Select 1-3 focus areas for maximum impact</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">AI-guided intention crafting with Cherry Blossom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Personalized daily practices & action plan</span>
                  </div>
                </div>

                <div className="mt-6 mb-4">
                  <a
                    href="https://join.butter.us/make-time-for-more/onboarding"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-white hover:bg-gray-50 text-[#E26C73] border-2 border-white font-semibold">
                      Join The Intention Setting Circle
                    </Button>
                  </a>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/focus-areas" className="block">
                    <Button size="lg" className="w-full bg-white text-[#E26C73] hover:bg-gray-50 font-semibold">
                      Choose Your 1-3 Priority Focus Areas
                    </Button>
                  </Link>
                  <a
                    href="https://chatgpt.com/g/g-67ec80061e1c819192bc80c37a7ee320-set-your-desired-work-lifestyle-intention"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-[#E26C73] bg-transparent"
                    >
                      Set Your 28-Day Intention
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Step 1.3 - Preparation Checklist Card */}
            <Card className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    M
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                    Step 1.3
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Prepare For The Experience: Download Your Preparation Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Get ready for your transformation with our comprehensive preparation checklist. Complete these steps
                  to create the optimal environment for your work-life balance journey.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Clear your physical space</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Block off your calendar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Notify your family & team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Delegate or delay tasks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Prepare your spirit</span>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="https://docs.google.com/document/d/1IZ5qefGnMQpYJP8wMgQS3tVY6sj56CHcCpRBkOGpGjU/edit?tab=t.0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-white text-[#7FB069] hover:bg-gray-50 border-2 border-white font-semibold"
                    >
                      Download The Checklist
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#E26C73]">
            <p className="text-xl font-bold text-[#E26C73] text-center">
              Completing Onboarding is Mandatory to Make The Sunday Shift™ and Start Co-Working
            </p>
          </div>
        </div>
      </div>

      {/* Step 2 - Sunday Shift Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              M
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Step 2
            </Badge>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
              Make The Sunday Shift
            </h3>
            <p className="text-xl text-gray-700 font-medium">
              Adopt The Work-Life Balance Business Model & SOP™ -- the "Sustainable" Operating Procedure
            </p>
          </div>

          <div className="text-center mb-12">
            <CherryBlossomCountdown />
          </div>

          <div className="flex justify-center">
            <div className="space-y-4 flex flex-col max-w-4xl w-full">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-3 text-gray-700 bg-white/80 p-3 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-[#7FB069] flex-shrink-0" />
                  <span className="font-semibold text-lg">Join Us Live: Sunday @ 1:00–2:00 PM ET</span>
                </div>

                <a
                  href="https://join.butter.us/make-time-for-more/sunday-kickoff"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="w-full h-full bg-white/80 hover:bg-white p-3 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                    <span className="text-2xl">🌸</span>
                    <span className="font-semibold text-lg text-[#7FB069]">Click Here to Make The Sunday Shift™</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 - Co-Working Non-Negotiables Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              M
            </div>
            <Badge variant="secondary" className="bg-[#7FB069] text-white border-0">
              Step 3
            </Badge>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#7FB069] mb-4">
              Break The Hustle Habit — Co-Work Your Non-Negotiables™
            </h3>
          </div>

          <div className="text-center mb-8">
            <div className="max-w-6xl mx-auto">
              <img
                src="/placeholder.svg?height=600&width=1200"
                alt="Diverse professional women in co-working environments with cherry blossoms"
                className="w-full h-auto object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          <div className="max-w-6xl mx-auto mb-8 -mt-4">
            <div className="bg-[#7FB069] text-white p-4 rounded-b-2xl shadow-lg text-center">
              <p className="text-lg lg:text-2xl font-medium leading-relaxed">
                You'll Practice, Embody & Live This Schedule with Us — 4 Days a Week
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden mt-4">
            <WorkLifeBalanceSchedule />
          </div>
        </div>
      </div>

      {/* Cherry Blossom AI Suite */}
      <div className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 pt-20 pb-25">
        <div className="text-center mb-12">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                M
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#E26C73] mb-4">
              🌸 World's First AI-Powered Work-Life Balance Planner 🌸
            </h2>
            <p className="text-lg text-gray-900 mb-4">
              6 AI Powered Work-Life Balance Co-Guides to help plan your Experience — Each co-guide provides
              personalized planning, progress insights and transformation strategies.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto px-6">
          {/* Card 1 - Morning Routine */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center shadow-sm">
                  <span className="text-2xl">☕</span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Morning GIV•EN™ Routine</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your spiritual alignment and morning routine co-guide for starting each day with intention and divine
                connection.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Woman meditating in morning"
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="space-y-3">
                <a
                  href="https://chatgpt.com/g/g-67edfb8de70c8191926d0d3c6e60404f-plan-your-morning-given-routine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold">
                    Plan Your Morning Routine
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 - Workout Window */}
          <Card className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 border-2 border-[#7FB069]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-sm">
                  <span className="text-2xl">🧘</span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">30-Minute Workday Workout Window</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your movement and energy optimization co-guide for integrating physical wellness into your workday.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Woman exercising"
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="space-y-3">
                <a
                  href="https://chatgpt.com/g/g-67f1a8b481048191965df81cdea2326a-30-minute-workday-workout-window"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white font-semibold">
                    Plan Your 30-Minute Workout Window
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 - Lunch Break */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center shadow-sm">
                  <span className="text-2xl">🥗</span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Extended Healthy Hybrid Lunch Break</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your nourishment and activity-stacking co-guide for combining social connections, business meetings, and
                healthy eating in beautiful settings.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Woman enjoying healthy lunch"
                  className="w-full h-48 object-cover"
                />
              </div>

              <a
                href="https://chatgpt.com/g/g-67eecba908348191b9a9b349bb8c6f08-plan-your-extended-healthy-hybrid-lunch-break"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold">
                  Plan Your Extended Lunch Break
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Card 4 - CEO Workday */}
          <Card className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 border-2 border-[#7FB069]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-sm">
                  <span className="text-2xl">💼</span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">4-Hour Focused CEO Workday</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your productivity and business alignment co-guide for working ON your business with divine co-creation
                and quantum focus.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Professional woman working"
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="space-y-3">
                <a
                  href="https://chatgpt.com/g/g-67ef467e4b288191ba2767b54574825c-plan-your-4-hour-focused-ceo-workday"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white font-semibold">
                    Plan Your 4-Hour CEO Workday
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Card 5 - Lifestyle Experiences */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center shadow-sm">
                  <span className="text-2xl">✈️</span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Quality of Lifestyle Experiences</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your joy, creativity, and connection co-guide for immersing in the real wealth of life experiences.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Woman with family on vacation"
                  className="w-full h-48 object-cover"
                />
              </div>

              <a
                href="https://chatgpt.com/g/g-67f1b6ff90a48191b608dea34209591f-plan-enjoy-quality-of-lifestyle-experiences"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold">
                  Plan & Enjoy Quality Lifestyle Experiences
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Card 6 - Digital Detox */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-sm">
                  <span className="text-2xl">🌙</span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Power Down & Unplug Digital Detox</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your evening wind-down and nervous system regulation co-guide for restorative sleep and overnight
                hormone repair.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Woman relaxing in evening"
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="space-y-3">
                <a
                  href="https://chatgpt.com/g/g-67f1cf8ddcec819182f60ca639d3a6ab-plan-your-digital-detox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white font-semibold">
                    Plan Your Digital Detox
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wellness Tracking Dashboard */}
      <div id="wellness-dashboard" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Wellness Tracking Dashboard</h2>
          <p className="text-lg text-gray-600">Monitor and optimize your daily wellness habits</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-2 border-[#7FB069]/30 hover:border-[#7FB069] transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[#7FB069]">Workout Planner</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Track your 30-minute workday workout sessions. Plan, schedule, and monitor your movement and energy
                optimization journey.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Target className="w-4 h-4 text-[#7FB069]" />
                  Weekly workout goals and progress tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-[#7FB069]" />
                  Date-specific workout scheduling
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="w-4 h-4 text-[#7FB069]" />
                  Monthly progress overview
                </div>
              </div>
              <Link href="/workout-planner">
                <Button className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white">
                  Open Workout Planner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#E26C73]/30 hover:border-[#E26C73] transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center">
                  <Moon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[#E26C73]">Sleep Tracker</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Monitor your power down and unplug evening routine. Track sleep quality, duration, and digital detox
                habits.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Target className="w-4 h-4 text-[#E26C73]" />
                  Sleep quality and duration goals
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-[#E26C73]" />
                  Daily sleep log with dates
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="w-4 h-4 text-[#E26C73]" />
                  Weekly sleep pattern analysis
                </div>
              </div>
              <Link href="/sleep-tracker">
                <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white">
                  Open Sleep Tracker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Complete Wellness Tracking Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Date Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Every workout and sleep entry includes specific dates for accurate progress monitoring.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Progress Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Comprehensive weekly and monthly progress tracking with visual charts and insights.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Goal Setting</h4>
                  <p className="text-sm text-gray-600">
                    Set and track weekly goals for both movement and sleep optimization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Habit Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Build and maintain healthy habits with our comprehensive tracking system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Energy Optimization</h4>
                  <p className="text-sm text-gray-600">
                    Track your energy levels throughout the day and optimize your schedule accordingly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Moon className="h-5 w-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Wellness Insights</h4>
                  <p className="text-sm text-gray-600">
                    Get personalized insights and recommendations based on your wellness data.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facebook Group CTA Section */}
      <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  M
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[#E26C73] mb-6">Join Our Facebook Community</h2>
              <p className="text-lg text-gray-600 mb-8">
                Connect with like-minded women on their work-life balance journey. Share experiences, get support,
                celebrate wins together, and share pics and videos of you making time for more.
              </p>
              <img
                src="/placeholder.svg?height=400&width=800"
                alt="Diverse community of women"
                className="w-full h-auto object-cover rounded-2xl shadow-2xl mb-8"
              />
              <a
                href="https://www.facebook.com/groups/maketimeformore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold px-8 py-4 text-lg"
                >
                  Join Our Facebook Group
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rest, Recover & Recharge Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              M
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] text-white border-0">
              Week 4
            </Badge>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#E26C73] to-[#7FB069] bg-clip-text text-transparent mb-4">
              Rest, Recover & Recharge Unapologetically
            </h3>
            <p className="text-xl text-gray-700 font-medium">
              This is Week 4 of each 28-day cycle - Time to celebrate your transformation and plan your well-deserved
              break
            </p>
          </div>

          <div className="text-center mb-8">
            <div className="max-w-4xl mx-auto">
              <img
                src="/placeholder.svg?height=500&width=1000"
                alt="Three diverse women celebrating together"
                className="w-full h-auto object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            <Card className="border-2 border-[#E26C73]/30 bg-white/80">
              <CardHeader>
                <CardTitle className="text-[#E26C73] flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Share Your Vacation Plans & Pics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  After 3 weeks of transformation, it's time to celebrate your progress with a well-deserved vacation.
                  Use this week to rest, recharge, and reflect on your journey.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Plan restorative vacation activities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Maintain work-life balance during time off</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Reflect on your 28-day transformation</span>
                  </div>
                </div>

                <a
                  href="https://www.facebook.com/groups/maketimeformore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white">
                    Share Your Plans, Pics & Bucket List In Our FB Group
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#E26C73]/30 bg-white/80">
              <CardHeader>
                <CardTitle className="text-[#E26C73] flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Share Your Monthly Success Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Your transformation story can inspire others on their work-life balance journey. Share your experience
                  and celebrate your achievements with our community.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Craft your transformation testimonial</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Celebrate your progress and achievements</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Inspire others in the community</span>
                  </div>
                </div>

                <a
                  href="https://forms.gle/yKRn6Wv4wkZDhoUH7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white">
                    Submit Your 28-Day Testimonial Here
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Ready For More - Pricing Section */}
          <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20 rounded-2xl">
            <div className="max-w-7xl mx-auto px-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white py-12 px-6 rounded-t-2xl text-center mb-0">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    M
                  </div>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready For More? Choose Your Next Level</h2>
                <p className="text-xl text-white/90">
                  Choose Your Work-Life Balance Experience or Business Model & SOP Installation
                </p>
              </div>

              {/* Content Section */}
              <div className="bg-white py-12 px-6 lg:px-12 rounded-b-2xl">
                <div className="max-w-5xl mx-auto space-y-6 mb-12">
                  <h3 className="text-2xl font-bold text-gray-900">
                    How Deeply Will You Root Your New Work-Life Balance Blueprint?
                  </h3>

                  <p className="text-lg text-gray-800 leading-relaxed">
                    Inside Make Time For More™, you aren't just learning about work-life balance.{" "}
                    <span className="font-bold">You're installing it</span> — step by step, layer by layer — until it
                    becomes your new <span className="font-bold">Sustainable Operating Procedure (SOP)</span> for life,
                    business, and leadership.
                  </p>

                  <p className="text-lg text-gray-800 leading-relaxed">
                    You choose your Experience or the Installation level based on the rhythm you're ready to adopt:
                  </p>

                  {/* Three Column Pricing Grid */}
                  <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-12">
                    {/* Column 1 - 7-Day */}
                    <div className="flex flex-col">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border-2 border-gray-200 hover:border-[#7FB069] transition-all">
                        <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
                          <img
                            src="/placeholder.svg?height=400&width=350"
                            alt="7-Day Experience"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-2xl font-bold text-[#7FB069] mb-4">
                            7-Day Work-Life Balance Reset Experience
                          </h3>

                          <p className="text-gray-700 mb-4 italic">
                            Experience the Full Blueprint for One Powerful Week Per Month.
                          </p>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Perfect if you want to reset your rhythms, reclaim your time, and plug into the Make Time
                            For More™ SOP — one powerful week at a time.
                          </p>

                          {/* Pricing Boxes */}
                          <div className="space-y-4 mt-auto">
                            {/* Regular Price */}
                            <a
                              href="https://www.maketimeformore.com/checkout/1-week-hzlvl"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-xl transition-all transform hover:scale-105"
                            >
                              <div className="bg-gradient-to-br from-[#E8F5E8] to-white border-4 border-[#7FB069]/30 rounded-xl p-5 text-center relative shadow-md hover:shadow-2xl transition-all">
                                <div className="font-bold text-gray-900 mb-1 text-lg">7-Day</div>
                                <div className="text-sm text-gray-600 mb-2 font-semibold">
                                  Work-Life Balance Reset Experience
                                </div>
                                <div className="text-sm text-gray-500 italic mb-2">(within 28-Day Cycle)</div>
                                <div className="text-3xl font-bold text-[#7FB069] mb-2">$2,500</div>
                                <div className="mt-2 text-[#7FB069] font-bold text-lg">Click here to upgrade →</div>
                              </div>
                            </a>

                            {/* Installation Price */}
                            <a
                              href="https://www.maketimeformore.com/checkout/7-day-installation"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-xl transition-all transform hover:scale-105"
                            >
                              <div className="bg-gradient-to-br from-[#7FB069] to-[#6FA055] text-white rounded-xl p-5 text-center shadow-lg hover:shadow-2xl transition-all border-4 border-[#7FB069]">
                                <div className="font-bold mb-1 text-lg">7-Day</div>
                                <div className="text-sm mb-2 font-semibold">
                                  Work-Life Balance Business Model & SOP Installation
                                </div>
                                <div className="text-sm italic mb-2">(3 Consecutive Cycles)</div>
                                <div className="text-3xl font-bold mb-2">$7,500</div>
                                <div className="mt-2 text-white font-bold text-lg">Click here to upgrade →</div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 - 14-Day */}
                    <div className="flex flex-col">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border-2 border-gray-200 hover:border-[#E26C73] transition-all">
                        <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
                          <img
                            src="/placeholder.svg?height=400&width=350"
                            alt="14-Day Experience"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-2xl font-bold text-[#E26C73] mb-4">
                            14-Day Work-Life Balance Momentum Building Experience
                          </h3>

                          <p className="text-gray-700 mb-4 italic">
                            Experience the Momentum Builder in Two Weeks Per Month
                          </p>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Perfect if you're ready to deepen the reset — two powerful weeks to shift out of hustle
                            mode, and start building real momentum toward your Desired Work-LifeStyle.
                          </p>

                          {/* Pricing Boxes */}
                          <div className="space-y-4 mt-auto">
                            {/* Regular Price */}
                            <a
                              href="https://www.maketimeformore.com/checkout/14-day-experience"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-xl transition-all transform hover:scale-105"
                            >
                              <div className="bg-gradient-to-br from-[#E8F5E8] to-white border-4 border-[#E26C73]/30 rounded-xl p-5 text-center shadow-md hover:shadow-2xl transition-all">
                                <div className="font-bold text-gray-900 mb-1 text-lg">14-Day</div>
                                <div className="text-sm text-gray-600 mb-2 font-semibold">
                                  Work-Life Balance Momentum Building Experience
                                </div>
                                <div className="text-sm text-gray-500 italic mb-2">(within 28-Day Cycle)</div>
                                <div className="text-3xl font-bold text-[#E26C73] mb-2">$5,000</div>
                                <div className="mt-2 text-[#E26C73] font-bold text-lg">Click here to upgrade →</div>
                              </div>
                            </a>

                            {/* Installation Price */}
                            <a
                              href="https://www.maketimeformore.com/checkout/14-day"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-xl transition-all transform hover:scale-105"
                            >
                              <div className="bg-gradient-to-br from-[#7FB069] to-[#6FA055] text-white rounded-xl p-5 text-center shadow-lg hover:shadow-2xl transition-all border-4 border-[#7FB069]">
                                <div className="font-bold mb-1 text-lg">14-Day</div>
                                <div className="text-sm mb-2 font-semibold">
                                  Work-Life Balance Business Model & SOP Installation
                                </div>
                                <div className="text-sm italic mb-2">(3 Consecutive Cycles)</div>
                                <div className="text-3xl font-bold mb-2">$15,000</div>
                                <div className="mt-2 text-white font-bold text-lg">Click here to upgrade →</div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 - 21-Day */}
                    <div className="flex flex-col">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border-2 border-gray-200 hover:border-[#7FB069] transition-all">
                        <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
                          <img
                            src="/placeholder.svg?height=400&width=350"
                            alt="21-Day Experience"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-2xl font-bold text-[#7FB069] mb-4">21-Day Habit Building Experience</h3>

                          <p className="text-gray-700 mb-4 italic">
                            Break Unhealthy Hustle Habits, Build New Ones in (3) 28-Day Cycles
                          </p>

                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Perfect if you are truly ready to disrupt hustle culture, install your new work-lifestyle
                            and reset your work-life balance habits for sustainable success.
                          </p>

                          {/* Pricing Boxes */}
                          <div className="space-y-4 mt-auto">
                            {/* Regular Price */}
                            <a
                              href="https://www.maketimeformore.com/checkout/21-day"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-xl transition-all transform hover:scale-105"
                            >
                              <div className="bg-gradient-to-br from-[#E8F5E8] to-white border-4 border-[#7FB069]/30 rounded-xl p-5 text-center relative shadow-md hover:shadow-2xl transition-all">
                                <div className="font-bold text-gray-900 mb-1 text-lg">21-Day</div>
                                <div className="text-sm text-gray-600 mb-2 font-semibold">
                                  Work-Life Balance Habit Building Experience
                                </div>
                                <div className="text-sm text-gray-500 italic mb-2">(within 28-Day Cycle)</div>
                                <div className="text-3xl font-bold text-[#7FB069] mb-2">$7,500</div>
                                <div className="mt-2 text-[#7FB069] font-bold text-lg">Click here to upgrade →</div>
                              </div>
                            </a>

                            {/* Installation Price */}
                            <a
                              href="https://www.maketimeformore.com/checkout/21-day-installation"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-xl transition-all transform hover:scale-105"
                            >
                              <div className="bg-gradient-to-br from-[#7FB069] to-[#6FA055] text-white rounded-xl p-5 text-center shadow-lg hover:shadow-2xl transition-all border-4 border-[#7FB069]">
                                <div className="font-bold mb-1 text-lg">21-Day</div>
                                <div className="text-sm mb-2 font-semibold">
                                  Work-Life Balance Business Model & SOP Installation
                                </div>
                                <div className="text-sm italic mb-2">(3 Consecutive Cycles)</div>
                                <div className="text-3xl font-bold mb-2">$22,500</div>
                                <div className="mt-2 text-white font-bold text-lg">Click here to upgrade →</div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            © 2025 Make Time For More™. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}