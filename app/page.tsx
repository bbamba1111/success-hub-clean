"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Target, TrendingUp, Calendar, Zap, Moon, CheckCircle, Star, Download, Brain, Users, Sparkles } from 'lucide-react'
import CherryBlossomCountdown from "@/components/cherry-blossom-countdown"
import WorkLifeBalanceSchedule from "@/components/work-life-balance-schedule"
import { SimpleChatModal } from "@/components/simple-chat-modal"
import { AIBusinessAudit } from "@/components/ai-business-audit"
import { CoPilotTraining } from "@/components/co-pilot-training"
import { CherryBlossomCoGuide } from "@/components/cherry-blossom-co-guide"
import { createBrowserClient } from "@supabase/ssr"
import { BarbaraChiefOfStaff } from "@/components/barbara-chief-of-staff"
import { ClientCoGuideChat } from "@/components/client-co-guide-chat"

export default function HomePage() {
  const [dashboardVisited, setDashboardVisited] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState<string>("")
  const [chatTitle, setChatTitle] = useState("")
  const [isCoGuideOpen, setIsCoGuideOpen] = useState(false)
  const [userId, setUserId] = useState<string | undefined>()
  const [isBarbaraStaffOpen, setIsBarbaraStaffOpen] = useState(false)

  useEffect(() => {
    // Check if user has visited dashboard from planner/tracker
    const visited = localStorage.getItem("dashboardVisited")
    if (visited === "true") {
      setDashboardVisited(true)
    }
  }, [])

  useEffect(() => {
    // Get user ID from Supabase auth
    const getUserId = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.log("[v0] Supabase env vars not available, skipping user ID fetch")
        return
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUserId()
  }, [])

  const scrollToWellnessDashboard = () => {
    const element = document.getElementById("wellness-dashboard")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const openChat = (context: string, title: string) => {
    setChatContext(context)
    setChatTitle(title)
    setIsChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="flex justify-center mb-6">
                <img
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={104}
                  height={104}
                  className="rounded-full shadow-lg"
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    Make Time For More<sup className="text-lg">™</sup> Monthly
                  </h1>
                  <p className="text-lg text-gray-600 font-normal">
                    Installing The Work-Life Balance Business Model & SOP
                  </p>
                </div>
                {/* </CHANGE> */}

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

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-women-tea-cherry-blossoms-new.png"
                  alt="Diverse women enjoying tea together in cherry blossom garden"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Section - Complete Onboarding */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Step 1 Badge and Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
            <Badge variant="secondary" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Step 1
            </Badge>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#7FB069] mb-4">
              Complete Onboarding: Your First 3-Steps to Balance, Freedom & Success
            </h2>
            <p
              className="text-[39px] text-gray-700 mt-6"
              style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}
            >
              Live with Thought Leader Barbara
            </p>
          </div>

          {/* Live Onboarding Schedule - Compact Rectangular Banner */}
          <div className="bg-gradient-to-r from-[#F9F6F1] via-[#FAF7F2] to-[#F9F6F1] rounded-2xl overflow-hidden shadow-xl mb-12 border border-gray-200">
            <div className="grid md:grid-cols-[320px,1fr] gap-0">
              {/* Left: Barbara's Image with Shadow */}
              <div className="relative h-full min-h-[280px] bg-[#F9F6F1] flex items-center justify-center py-6 px-8">
                <div className="relative flex items-center justify-center">
                  {/* Barbara's image - increased by 20% with shadow */}
                  <img
                    src="/images/barbara-cherry-garden.jpg"
                    alt="Barbara"
                    className="w-[270px] h-[270px] rounded-full object-cover shadow-2xl"
                  />
                </div>
              </div>

              {/* Right: Onboarding Info */}
              <div className="py-6 px-8 flex flex-col justify-center bg-white">
                {/* Header */}
                <div className="mb-6 text-center">
                  <p className="text-sm text-gray-600 font-medium">Choose the option that fits your rhythm:</p>
                </div>

                {/* Stacked Options */}
                <div className="space-y-4 max-w-xl mx-auto">
                  {/* Option 1 */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-lg text-gray-800 mb-3">
                        <span className="font-semibold">Take The Audit:</span> Monday OR Wednesday | 7:00 - 8:30 PM ET
                      </p>
                    </div>
                    <a
                      href="https://join.butter.us/make-time-for-more/audit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-[#7FB069]/80 hover:bg-[#7FB069] text-white rounded-lg text-base font-bold py-3">
                        Enter Audit Onboarding
                      </Button>
                    </a>
                  </div>

                  {/* Option 2 */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-lg text-gray-800 mb-3">
                        <span className="font-semibold">Set Your Intention:</span> Tuesday OR Thursday | 7:00 - 8:30 PM
                        ET
                      </p>
                    </div>
                    <a
                      href="https://join.butter.us/make-time-for-more/onboarding"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-[#E26C73]/80 hover:bg-[#E26C73] text-white rounded-lg text-base font-bold py-3">
                        Enter Intention Onboarding
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Footer Note */}
                <p className="text-[15px] text-gray-600 italic text-center mt-6">
                  No reminders will be sent — this is your monthly alignment assignment.
                </p>
              </div>
            </div>
          </div>

          {/* Description Text - Moved Here */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              Complete these three essential steps to prepare for your transformation journey
            </p>
          </div>

          {/* Three Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Step 1.1 - Audit Card */}
            <Card className="bg-[#7FB069] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="/images/logo.png"
                    alt="Make Time For More Logo"
                    width={48}
                    height={48}
                    className="rounded-full shadow-lg"
                  />
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

                <div className="h-9"></div>

                <div className="flex flex-col gap-3 mt-3">
                  <Link href="/audit" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold"
                    >
                      Take The Work-Life Balance Audit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

        {/* Step 1.2 - Intention Setting Card */}
<Card className="bg-[#E26C73] border-0 text-white overflow-hidden">
  <CardHeader className="pb-4">
    <div className="flex items-center gap-3 mb-3">
      <img
        src="/images/logo.png"
        alt="Make Time For More Logo"
        width={48}
        height={48}
        className="rounded-full shadow-lg"
      />
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

    <div className="flex flex-col gap-3 mt-3">
      <Link href="/focus-areas" className="block">
        <Button
          size="lg"
          className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold"
        >
          Choose Your 1-3 Priority Focus Areas
        </Button>
      </Link>

      <a
        href="https://docs.google.com/document/d/1RtaoYOUQmmPSD2U5EaLPiilQifnSamE5Yo6SaOYf4UM/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
          <Download className="mr-2 h-4 w-4" />
          Open The Intention Setting Guide
        </Button>
      </a>
    </div>
  </CardContent>
</Card>
            {/* Step 1.3 - Preparation Checklist Card */}
            <Card className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="/images/logo.png"
                    alt="Make Time For More Logo"
                    width={48}
                    height={48}
                    className="rounded-full shadow-lg"
                  />
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

                <a
                  href="https://docs.google.com/document/d/1IZ5qefGnMQpYJP8wMgQS3tVY6sj56CHcCpRBkOGpGjU/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3"
                >
                  <Button className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
                    <Download className="mr-2 h-4 w-4" />
                    Open The Preparation Checklist
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Important Note */}
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
          {/* Step 2 Badge at Top */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
            <Badge variant="secondary" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Step 2
            </Badge>
          </div>

          {/* Header Text Above Image */}
          <div className="text-center mb-8">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
              Make The Sunday Shift
            </h3>
            <p className="text-xl text-gray-700 font-medium">
              Adopt The Work-Life Balance Business Model & SOP™ -- the "Sustainable" Operating Procedure
            </p>
          </div>

          {/* Cherry Blossom Countdown Component */}
          <div className="text-center mb-12">
            <CherryBlossomCountdown />
          </div>

          {/* Content Grid with rounded corners and shadow */}
          <div className="flex justify-center">
            <div className="space-y-4 flex flex-col max-w-4xl w-full bg-white/80 rounded-2xl shadow-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700 bg-white/80 p-3 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-[#7FB069] flex-shrink-0" />
                  <span className="font-semibold text-lg">Join Us Live: Sunday @ 1:00–2:00 PM ET</span>
                </div>

                <a
                  href="https://join.butter.us/make-time-for-more/sunday-shift"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full h-full bg-white hover:bg-gray-50 text-[#7FB069] border-2 border-[#7FB069] font-semibold py-3 text-lg">
                    Enter Here to Make The Sunday Shift
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 - Co-Working Non-Negotiables Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Step 3 Badge at Top */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
            <Badge variant="secondary" className="bg-[#7FB069] text-white border-0">
              Step 3
            </Badge>
          </div>

          {/* Header Text Above Image */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#7FB069] mb-4">
              Break The Hustle Habit — Co-Work Your Non-Negotiables™
            </h3>
          </div>

          {/* New Co-Working Women Image */}
          <div className="text-center mb-8">
            <div className="max-w-6xl mx-auto">
              <img
                src="/images/design-mode/00000000000001step4.png"
                alt="Diverse professional women in co-working environments with cherry blossoms"
                className="w-full h-auto object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Green Banner */}
          <div className="max-w-6xl mx-auto mb-8 -mt-4">
            <div className="bg-[#7FB069] text-white p-4 rounded-b-2xl shadow-lg text-center">
              <p className="text-lg lg:text-2xl font-medium leading-relaxed">
                You'll Practice, Embody & Live This Schedule with Us — 4 Days a Week
              </p>
            </div>
          </div>

          {/* Interactive Schedule Component */}
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
              <img
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={80}
                height={80}
                className="rounded-full shadow-lg"
              />
            </div>
            <img
              src="/images/cherry-blossom-suite-new.png"
              alt="Cherry Blossom Suite"
              className="w-full h-auto object-contain mx-auto mb-6 rounded-2xl"
            />
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
          {/* Card 1 - Morning GIV•EN™ Routine */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/tea-cup-icon.png"
                    alt="Morning GIV•EN™ Routine"
                    className="w-8 h-8 object-contain"
                  />
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
                  src="/images/morning-routine-pink-meditation.webp"
                  alt="Woman meditating in pink attire"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("morning-routine", "Morning GIV•EN™ Routine")}
                className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold"
              >
                Plan Your Morning Routine
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 - 30-Minute Workday Workout Window */}
          <Card className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 border-2 border-[#7FB069]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/yoga-meditation-icon.png"
                    alt="30-Minute Workday Workout Window"
                    className="w-8 h-8 object-contain"
                  />
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
                  src="/images/workout-window-screen.webp"
                  alt="Woman viewing virtual workout class"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("workout-window", "30-Minute Workday Workout Window")}
                className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white font-semibold"
              >
                Plan Your Workout Window
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 - Extended Healthy Hybrid Lunch Break */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/tea-cup-icon.png"
                    alt="Extended Healthy Hybrid Lunch Break"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                Extended Healthy Hybrid Lunch Break
              </CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your nourishment and activity-stacking co-guide for combining social connections, business meetings, and
                healthy eating in beautiful settings.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/images/hybrid-lunch-outdoor.png"
                  alt="Woman enjoying healthy salad outdoors"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("lunch-break", "Extended Healthy Hybrid Lunch Break")}
                className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold"
              >
                Plan Your Lunch Break
              </Button>
            </CardContent>
          </Card>

          {/* Card 4 - 4-Hour Focused CEO Workday */}
          <Card className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 border-2 border-[#7FB069]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/ceo-presentation-cherry-blossom-icon.png"
                    alt="4-Hour Focused CEO Workday"
                    className="w-8 h-8 object-contain"
                  />
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
                  src="/images/ceo-workday-focused.png"
                  alt="Professional woman working at desk"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Link href="/human-zone-of-genius-team">
                <Button
                  className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white font-semibold"
                >
                  Plan Your CEO Workday
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 5 - Quality of Lifestyle Experiences */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/family-vacation-icon.png"
                    alt="Quality of Lifestyle Experiences"
                    className="w-8 h-8 object-contain"
                  />
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
                  src="/images/family-lifestyle-experiences.png"
                  alt="Woman enjoying quality time with family"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("lifestyle-experiences", "Quality of Lifestyle Experiences")}
                className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold"
              >
                Plan Your Lifestyle Experiences
              </Button>
            </CardContent>
          </Card>

          {/* Card 6 - Power Down & Unplug Digital Detox */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/power-down-moon-cherry-blossom-icon.png"
                    alt="Power Down & Unplug Digital Detox"
                    className="w-8 h-8 object-contain"
                  />
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
                  src="/images/power-down-reading-night.png"
                  alt="Woman reading in cozy evening setting"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("digital-detox", "Power Down & Unplug Digital Detox")}
                className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold"
              >
                Plan Your Digital Detox
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wellness Tracking Dashboard */}
      <div id="wellness-dashboard" className="max-w-6xl mx-auto px-16 py-16">
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
                <img
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={80}
                  height={80}
                  className="rounded-full shadow-lg"
                />
              </div>
              <h2 className="text-3xl font-bold text-[#E26C73] mb-6">Join Our Facebook Community</h2>
              <p className="text-lg text-gray-600 mb-8">
                Connect with like-minded women on their work-life balance journey. Share experiences, get support,
                celebrate wins together, and share pics and videos of you making time for more.
              </p>
              <img
                src="/images/facebook-group-community.jpg"
                alt="Diverse community of women in cherry blossom setting"
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
                  <ArrowRight className="ml-2 h-4 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rest, Recover & Recharge Section */}
      <div className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
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
                src="/images/vacation-celebration-women-cherry-blossoms.png"
                alt="Three diverse women celebrating together in cherry blossom setting"
                className="w-full h-auto object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* The Button for Sabbatical Planning was updated here */}
          <div className="max-w-4xl mx-auto mb-8">
            <Button
              onClick={() => openChat("sabbatical-planning", "Plan Your Sabbatical or 1-Week Break")}
              size="lg"
              className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-bold px-12 py-6 text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Plan Your Sabbatical or 1-Week Break
            </Button>
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
          <div className="py-20 rounded-2xl">
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] text-white py-12 px-6 rounded-t-2xl text-center mb-0">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <img
                    src="/images/logo.png"
                    alt="Make Time For More Logo"
                    width={80}
                    height={80}
                    className="rounded-full shadow-lg"
                  />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready For More? Choose Your Next Level</h2>
                <p className="text-xl text-white/90">
                  Founding Member Scholarship: 50% Credit on All Experiences Through March 31, 2026
                </p>
              </div>

              {/* Content Section - Cream/beige background */}
              <div className="bg-[#F5F1E8] py-12 px-6 lg:px-12 rounded-b-2xl">
                <div className="max-w-5xl mx-auto space-y-6 mb-12">
                  <h3 className="text-2xl font-bold text-gray-900">
                    How Deeply Will You Root Your New Work-Life Balance Blueprint?
                  </h3>

                  <p className="text-lg text-gray-800 leading-relaxed">
                    Choose your experience level based on the transformation you're ready for. Each includes our
                    complete Make Time For More™ SOP with co-working sessions (Mon-Thu 1-5pm ET) plus independent
                    practice days.
                  </p>

                  <div className="bg-white rounded-2xl p-6 border border-[#7FB069]/20">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🌸</span> 2026 Community Sabbaticals & Schedule
                    </h4>
                    <p className="text-gray-700 mb-4">
                      We run <strong>(8) 28-Day Cycles per year</strong> during January - June and September - October.
                      If you're planning the 90-Day Full Installation, choose 3 consecutive months when we're in
                      session.
                    </p>
                    <p className="text-gray-700 mb-4">
                      As a member, you'll also join us for two annual sabbaticals where the entire community takes
                      intentional time off together:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-[#F5F1E8] rounded-xl p-4 shadow-sm">
                        <p className="font-semibold text-[#7FB069]">Summer Sabbatical</p>
                        <p className="text-gray-600">July - August 2026</p>
                        <p className="text-sm text-gray-500 mt-1">8 weeks of rest, travel & family time</p>
                      </div>
                      <div className="bg-[#F5F1E8] rounded-xl p-4 shadow-sm">
                        <p className="font-semibold text-[#E26C73]">Winter Holiday Sabbatical</p>
                        <p className="text-gray-600">November - December 2026</p>
                        <p className="text-sm text-gray-500 mt-1">8 weeks of celebration & reflection</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-12">
                    {/* Column 1 - 7-Day Reset */}
                    <div className="flex flex-col">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border border-gray-100 hover:shadow-xl transition-all">
                        <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
                          <img
                            src="/images/7-day-work-life-balance.png"
                            alt="Professional woman working on laptop at outdoor cafe with cherry blossoms"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">
                            <strong>7-Day Work-Life Balance Reset</strong>
                          </h3>

                          <p className="text-gray-700 mb-4 italic">
                            Experience the Full Blueprint for One Powerful Week.
                          </p>

                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Perfect if you want to test-drive the transformation, reset your rhythms, and experience
                            what's possible in just one week.
                          </p>

                          <div className="bg-[#F5F1E8] rounded-xl p-5 mb-6">
                            <p className="font-semibold text-lg text-gray-800 mb-4">Your 7-Day Experience Includes:</p>
                            <ul className="space-y-3 text-base text-gray-600">
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <strong>2-Part Onboarding: Work-Life Balance Audit & 28-Day Intention Setting</strong>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <strong>A 4-Day Workweek with A 3-Day Weekend</strong>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>
                                  (4) <strong>4-Hour Focused CEO Workdays</strong>
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <strong>152 Hours of Weekly Time Freedom</strong>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Expansion in 13 Core Life Value Areas</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(4) Morning GIV•EN™ Routines</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(4) 30-Minute Workday Workout Windows</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(4) Extended Healthy Hybrid Lunch Breaks</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(4) Power Down & Unplug Digital Detoxes</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Quality of Lifestyle Experiences</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(1) Sunday Shift</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Cherry Blossom Suite: 6 AI-Powered Planners</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Workout Planner & Sleep Tracker Access</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>15 AI Executive Team Access</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Facebook Community Access</span>
                              </li>
                            </ul>
                          </div>

                          <div className="space-y-4 mt-auto">
                            <a
                              href="https://www.maketimeformore.com/checkout/7-day-black-friday"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                            >
                              <div className="bg-[#E26C73] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                                <div className="font-bold text-sm tracking-wide mb-3">
                                  <strong>BLACK FRIDAY SPECIAL</strong>
                                </div>
                                <div className="font-bold mb-1 text-lg">
                                  <strong>7-Day Reset</strong>
                                </div>
                                <div className="text-xs text-white/80 italic mb-3">(Now - December 31)</div>
                                <div className="text-xl font-bold mb-1">
                                  <strong>$997</strong>
                                </div>
                                <div className="text-white/80 text-sm mb-4">
                                  Reg <span className="line-through">$2,500</span>
                                </div>
                                <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                                  <strong>Click here to upgrade →</strong>
                                </div>
                              </div>
                            </a>

                            <a
                              href="https://www.maketimeformore.com/checkout/7-day-founding"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                            >
                              <div className="bg-[#7FB069] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                                <div className="font-bold text-sm tracking-wide mb-3">
                                  <strong>FOUNDING MEMBER</strong>
                                </div>
                                <div className="font-bold mb-1 text-lg">
                                  <strong>7-Day Reset</strong>
                                </div>
                                <div className="text-xs text-white/80 italic mb-3">(Jan 1 - March 31)</div>
                                <div className="text-xl font-bold mb-1">
                                  <strong>$1,250</strong>
                                </div>
                                <div className="text-white/80 text-sm mb-4">
                                  Reg <span className="line-through">$2,500</span>
                                </div>
                                <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                                  <strong>Click here to upgrade →</strong>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 - 28-Day Habit Builder */}
                    <div className="flex flex-col">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border border-gray-100 hover:shadow-xl transition-all">
                        <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
                          <img
                            src="/images/14-day-momentum-builder.png"
                            alt="Woman in peaceful meditation in serene room with cherry blossoms"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">
                            <strong>28-Day Habit Builder</strong>
                          </h3>

                          <p className="text-gray-700 mb-4 italic">
                            Full Habit Transformation Cycle: 21 Days + 7-Day Integration Break.
                          </p>

                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Perfect if you're ready to commit to real change—replace 6 hustle habits and install the
                            Work-Life Balance rhythm as your new normal.
                          </p>

                          <div className="bg-[#F5F1E8] rounded-xl p-5 mb-6">
                            <p className="font-semibold text-lg text-gray-800 mb-4">Your 28-Day Experience Includes:</p>
                            <ul className="space-y-3 text-base text-gray-600">
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <strong>2-Part Onboarding: Work-Life Balance Audit & 28-Day Intention Setting</strong>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>
                                  (3) <strong>4-Day Workweeks</strong> with (3) <strong>3-Day Weekends</strong>
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>
                                  (12) <strong>4-Hour Focused CEO Workdays</strong>
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <strong>152 Hours of Weekly Time Freedom (x3 weeks)</strong>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Expansion in 13 Core Life Value Areas</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(12) Morning GIV•EN™ Routines</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(12) 30-Minute Workday Workout Windows</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(12) Extended Healthy Hybrid Lunch Breaks</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(12) Power Down & Unplug Digital Detoxes</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Quality of Lifestyle Experiences</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(3) Sunday Shifts</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(1) Intention Setting Ceremony (GIVEN)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>6 Hustle Habit Replacements</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(1) Week Rest, Recover & Recharge Break</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Cherry Blossom Suite: 6 AI-Powered Planners</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Workout Planner & Sleep Tracker Access</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Full AI Executive Team Access</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Facebook Community Access</span>
                              </li>
                            </ul>
                          </div>

                          <div className="space-y-4 mt-auto">
                            <a
                              href="https://www.maketimeformore.com/checkout/28-day-black-friday"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                            >
                              <div className="bg-[#E26C73] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                                <div className="font-bold text-sm tracking-wide mb-3">
                                  <strong>BLACK FRIDAY SPECIAL</strong>
                                </div>
                                <div className="font-bold mb-1 text-lg">
                                  <strong>28-Day Habit Builder</strong>
                                </div>
                                <div className="text-xs text-white/80 italic mb-3">(Now - December 31)</div>
                                <div className="text-xl font-bold mb-1">
                                  <strong>$2,997</strong>
                                </div>
                                <div className="text-white/80 text-sm mb-4">
                                  Reg <span className="line-through">$7,500</span>
                                </div>
                                <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                                  <strong>Click here to upgrade →</strong>
                                </div>
                              </div>
                            </a>

                            <a
                              href="https://www.maketimeformore.com/checkout/28-day-founding"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                            >
                              <div className="bg-[#7FB069] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                                <div className="font-bold text-sm tracking-wide mb-3">
                                  <strong>FOUNDING MEMBER</strong>
                                </div>
                                <div className="font-bold mb-1 text-lg">
                                  <strong>28-Day Habit Builder</strong>
                                </div>
                                <div className="text-xs text-white/80 italic mb-3">(Jan 1 - March 31)</div>
                                <div className="text-xl font-bold mb-1">
                                  <strong>$3,750</strong>
                                </div>
                                <div className="text-white/80 text-sm mb-4">
                                  Reg <span className="line-through">$7,500</span>
                                </div>
                                <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                                  <strong>Click here to upgrade →</strong>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 - 90-Day Installation */}
                    <div className="flex flex-col">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border border-gray-100 hover:shadow-xl transition-all">
                        <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
                          <img
                            src="/images/21-day-habit-builder.png"
                            alt="Woman in luxury airplane seat with cherry blossom design"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">
                            <strong>90-Day Full Installation</strong>
                          </h3>

                          <p className="text-gray-700 mb-4 italic">
                            Permanently Install the Work-Life Balance Business Model as Your Operating System.
                          </p>

                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Perfect if you're all-in on transformation—3 consecutive 28-day cycles to make the 4-day
                            workweek and 4-hour workday automatic.
                          </p>

                          <div className="bg-[#F5F1E8] rounded-xl p-5 mb-6">
                            <p className="font-semibold text-lg text-gray-800 mb-4">Your 90-Day Experience Includes:</p>
                            <ul className="space-y-3 text-base text-gray-600">
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <strong>2-Part Onboarding: Work-Life Balance Audit & 28-Day Intention Setting</strong>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>
                                  (9) <strong>4-Day Workweeks</strong> with (9) <strong>3-Day Weekends</strong>
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>
                                  (36) <strong>4-Hour Focused CEO Workdays</strong>
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <strong>152 Hours of Weekly Time Freedom (x9 weeks)</strong>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Expansion in 13 Core Life Value Areas</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(36) Morning GIV•EN™ Routines</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(36) 30-Minute Workday Workout Windows</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(36) Extended Healthy Hybrid Lunch Breaks</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(36) Power Down & Unplug Digital Detoxes</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Quality of Lifestyle Experiences</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(9) Sunday Shifts</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(3) Intention Setting Ceremonies (GIVEN)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>6 Hustle Habit Replacements (Mastered)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(3) Weeks Rest, Recover & Recharge Breaks</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Cherry Blossom Suite: 6 AI-Powered Planners</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Workout Planner & Sleep Tracker Access</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Advanced AI Executive Workflows</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Priority Support & 1:1 Check-ins</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Facebook Community Access</span>
                              </li>
                            </ul>
                          </div>

                          <div className="space-y-4 mt-auto">
                            <a
                              href="https://www.maketimeformore.com/checkout/90-day-black-friday"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                            >
                              <div className="bg-[#E26C73] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                                <div className="font-bold text-sm tracking-wide mb-3">
                                  <strong>BLACK FRIDAY SPECIAL</strong>
                                </div>
                                <div className="font-bold mb-1 text-lg">
                                  <strong>90-Day Installation</strong>
                                </div>
                                <div className="text-xs text-white/80 italic mb-3">(Now - December 31)</div>
                                <div className="text-xl font-bold mb-1">
                                  <strong>$8,997</strong>
                                </div>
                                <div className="text-white/80 text-sm mb-4">
                                  Reg <span className="line-through">$22,500</span>
                                </div>
                                <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                                  <strong>Click here to upgrade →</strong>
                                </div>
                              </div>
                            </a>

                            <a
                              href="https://www.maketimeformore.com/checkout/90-day-founding"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                            >
                              <div className="bg-[#7FB069] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                                <div className="font-bold text-sm tracking-wide mb-3">
                                  <strong>FOUNDING MEMBER</strong>
                                </div>
                                <div className="font-bold mb-1 text-lg">
                                  <strong>90-Day Installation</strong>
                                </div>
                                <div className="text-xs text-white/80 italic mb-3">(Jan 1 - March 31)</div>
                                <div className="text-xl font-bold mb-1">
                                  <strong>$11,250</strong>
                                </div>
                                <div className="text-white/80 text-sm mb-4">
                                  Reg <span className="line-through">$22,500</span>
                                </div>
                                <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                                  <strong>Click here to upgrade →</strong>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Make Time For More On Mondays - Gradient pink/green */}
                  <div className="mt-16 bg-gradient-to-r from-[#E26C73] to-[#7FB069] rounded-2xl p-8 shadow-lg">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="lg:w-2/3 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                          <strong>Make Time For More On Mondays</strong>
                        </h3>
                        <p className="mb-4 italic text-white/90">Stay Connected with 3 Mondays Per Month</p>
                        <p className="mb-4 leading-relaxed text-white/90">
                          Perfect if you want to maintain your connection to the community, keep your rhythms steady, or
                          need a lighter commitment after completing an experience. Join us for 3 powerful Mondays each
                          month during the habit-building weeks.
                        </p>
                        <ul className="grid md:grid-cols-2 gap-3 text-base text-white/90">
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>(3) Monday Co-Working Sessions (1-5pm ET)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>Morning GIV•EN™ Routine Access</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>SOP Access on Mondays</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>AI Executive Team Demos</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>Facebook Community Access</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>Upgrade Anytime</span>
                          </li>
                        </ul>
                      </div>
                      <div className="lg:w-1/3 flex flex-col gap-4">
                        <a
                          href="https://www.maketimeformore.com/checkout/mondays-membership"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                        >
                          <div className="bg-white text-[#2F4F4F] rounded-2xl p-6 text-center shadow-lg transition-all">
                            <div className="font-bold text-sm tracking-wide mb-3">
                              <strong>MONTHLY MEMBERSHIP</strong>
                            </div>
                            <div className="font-bold mb-1 text-lg">
                              <strong>Mondays Only</strong>
                            </div>
                            <div className="text-xs text-gray-500 italic mb-3">Cancel Anytime</div>
                            <div className="text-xl font-bold mb-1">
                              <strong>$297/mo</strong>
                            </div>
                            <div className="mt-3 bg-gradient-to-r from-[#E26C73] to-[#7FB069] rounded-full py-2 px-4 text-white font-bold text-sm">
                              <strong>Click here to join →</strong>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Book Thought Leader Barbara section */}
      {/* Book Thought Leader Barbara Section */}
      <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 py-8 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-8">
                <img
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={80}
                  height={80}
                  className="rounded-full shadow-lg"
                />
              </div>
              <h2
                className="text-4xl text-[#E26C73] mb-8"
                style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}
              >
                Book Thought Leader Barbara
              </h2>
              <div className="flex justify-center mb-8">
                <img
                  src="/images/barbara-cherry-garden.jpg"
                  alt="Barbara"
                  className="w-64 h-64 rounded-full object-cover shadow-2xl"
                />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To learn more about Barbara's availability for speaking engagements and interviews, or to schedule
                private coaching sessions or VIP DAYs, email Barbara:{" "}
                <a
                  href="mailto:coachbarbara@maketimeformore.com"
                  className="text-[#7FB069] hover:text-[#6FA055] font-semibold underline"
                >
                  coachbarbara@maketimeformore.com
                </a>
              </p>
              <p className="text-base text-gray-600 italic">
                Put <span className="font-bold">SPEAKING</span>, <span className="font-bold">INTERVIEW</span>,{" "}
                <span className="font-bold">COACHING</span>, <span className="font-bold">VIP DAY</span> in the subject
                line in all caps.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SimpleChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={chatContext}
        title={chatTitle}
      />

      {/* Removed FloatingChatButton component */}

      <CherryBlossomCoGuide isOpen={isCoGuideOpen} onClose={() => setIsCoGuideOpen(false)} userId={userId} />
    </div>
  )
}
