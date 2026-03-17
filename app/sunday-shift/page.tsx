"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, CheckCircle, Download, Video } from "lucide-react"
import CherryBlossomCountdown from "@/components/cherry-blossom-countdown"
import { SimpleChatModal } from "@/components/simple-chat-modal"
import { CherryBlossomCoGuide } from "@/components/cherry-blossom-co-guide"
import { createBrowserClient } from "@supabase/ssr"

// Configurable Zoom URL - Update this when you have your Zoom link
const SUNDAY_ZOOM_URL = "https://join.butter.us/make-time-for-more/sunday-shift"

export default function SundayShiftPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState<string>("")
  const [chatTitle, setChatTitle] = useState("")
  const [isCoGuideOpen, setIsCoGuideOpen] = useState(false)
  const [userId, setUserId] = useState<string | undefined>()

  useEffect(() => {
    const getUserId = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
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

  const openChat = (context: string, title: string) => {
    setChatContext(context)
    setChatTitle(title)
    setIsChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Make The Sunday Shift Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-[#7FB069] mb-4">
              Start Your Week with Clarity Instead of Chaos
            </h2>

            <h1 className="text-6xl lg:text-6xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
              Make The Sunday Shift<sup className="text-2xl">™</sup>
            </h1>

            <h2 className="text-3xl font-medium text-[#7FB069] mb-4">
              Design Your Week On Sunday & Make Time For More On Monday
            </h2>

            <p className="text-xl text-gray-700 font-medium">
              {"Adopt The Work-Life Balance Business Model & SOP™ -- the \"Sustainable\" Operating Procedure"}
            </p>
          </div>

          <div className="text-center mb-12">
            <CherryBlossomCountdown />
          </div>

          <div className="flex justify-center">
            <div className="space-y-4 flex flex-col max-w-6xl w-full bg-white/80 rounded-2xl shadow-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700 bg-white/80 p-3 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-[#7FB069] flex-shrink-0" />
                  <span className="font-semibold text-lg">Design Your Week with Barbara — Sunday 1–3 PM ET</span>
                </div>

                <a
                  href={SUNDAY_ZOOM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full h-full bg-white hover:bg-gray-50 text-[#7FB069] border-2 border-[#7FB069] font-semibold py-3 text-lg">
                    <Video className="mr-2 h-5 w-5" />
                    Enter Here to Make The Sunday Shift
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Onboarding Section */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <p
              className="text-[40px] text-gray-700 mb-4"
              style={{ fontFamily: "'Playfair Display'", fontWeight: 400 }}
            >
              In the Hustle Lane, the week begins in reaction and survival mode.
            </p>
            <h2 className="text-3xl font-medium text-[#7FB069] mb-4">
              In the Harmony Lane, you intentionally prepare how the week begins.
            </h2>
          </div>

          {/* Barbara Image & Quote */}
          <div className="bg-gradient-to-r from-[#F9F6F1] via-[#FAF7F2] to-[#F9F6F1] rounded-2xl overflow-hidden shadow-xl mb-12 border border-gray-200">
            <div className="grid md:grid-cols-[320px,1fr] gap-0">
              <div className="relative h-full min-h-[280px] bg-[#F9F6F1] flex items-center justify-center py-6 px-8">
                <div className="relative flex items-center justify-center">
                  <img
                    src="/images/barbara-cherry-garden.jpg"
                    alt="Barbara"
                    className="w-[270px] h-[270px] rounded-full object-cover shadow-2xl"
                  />
                </div>
              </div>

              <div className="py-6 px-8 flex flex-col justify-center bg-white">
                <p
                  className="text-[33px] text-gray-700 text-center italic leading-relaxed"
                  style={{ fontFamily: "'Playfair Display'", fontWeight: 400 }}
                >
                  {"\"How you enter the week determines how you live, work and lead the week.\" — B. Bamba"}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-xl text-gray-900">
              Complete these three steps to assess where you are, set your intention, and prepare to live in The Harmony Lane.
            </p>
          </div>

          {/* Three Steps Grid - Audit, Intention, Prep */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Step 1 - Audit Card */}
            <Card className="bg-[#7FB069] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/images/logo.png" alt="Make Time For More Logo" width={48} height={48} className="rounded-full shadow-lg" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 1</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">Take The Work-Life Balance Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Discover exactly where you stand across 15 key life areas with our comprehensive assessment. Get personalized insights and identify your biggest opportunities for growth.
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
                  <Link href="/sunday-shift/audit" className="block">
                    <Button size="lg" className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
                      Take The Work-Life Balance Audit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 - Intention Setting Card */}
            <Card className="bg-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/images/logo.png" alt="Make Time For More Logo" width={48} height={48} className="rounded-full shadow-lg" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 2</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Set Your Desired Work-LifeStyle Intention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Transform your audit insights into powerful, actionable intentions. Choose 1-3 focus areas and let Cherry Blossom guide you through creating your personalized 7-day transformation plan.
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
                    <span className="text-white/90 text-sm">{"Personalized daily practices & action plan"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-3">
                  <Link href="/sunday-shift/intention-setter" className="block">
                    <Button size="lg" className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
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

            {/* Step 3 - Preparation Checklist Card */}
            <Card className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/images/logo.png" alt="Make Time For More Logo" width={48} height={48} className="rounded-full shadow-lg" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 3</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Prepare For Your Experience: Download Your Preparation Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Get ready for your transformation with our comprehensive preparation checklist. Complete these steps to create the optimal environment for your work-life balance journey.
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
                    <span className="text-white/90 text-sm">{"Notify your family & team"}</span>
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
                <Link href="/sunday-shift/prep-sheet" className="block mt-3">
                  <Button className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
                    <Download className="mr-2 h-4 w-4" />
                    View Preparation Checklist
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {/* Work With Me Live Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Work With Me Live on Sundays
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join the Sunday session for focused support and guided implementation. 
              This is where you come to co-work and design your week with intention.
            </p>
          </div>

          <Card className="border-0 bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Sunday Session: Design Your Week
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Every Sunday</span> | 1:00 PM - 3:00 PM ET
                  </p>
                  <p className="text-gray-500 text-sm">
                    Live guided session with Barbara to help you enter the week with clarity and intention.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href={SUNDAY_ZOOM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white font-semibold">
                      <Video className="mr-2 h-5 w-5" />
                      Join Sunday Session
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cherry Blossom Chat */}
      <SimpleChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title={chatTitle}
        context={chatContext}
      />

      {/* Cherry Blossom Co-Guide */}
      <CherryBlossomCoGuide
        isOpen={isCoGuideOpen}
        onClose={() => setIsCoGuideOpen(false)}
        userId={userId}
      />
    </div>
  )
}
