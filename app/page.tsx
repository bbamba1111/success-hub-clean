"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Target, TrendingUp, Calendar, Zap, Moon, CheckCircle, Star, Download, CheckCircle2, Sparkles, Heart, Users } from "lucide-react"
import CherryBlossomCountdown from "@/components/cherry-blossom-countdown"
import WorkLifeBalanceSchedule from "@/components/work-life-balance-schedule"
import { SimpleChatModal } from "@/components/simple-chat-modal"
import { CherryBlossomCoGuide } from "@/components/cherry-blossom-co-guide"
import { BusinessDayHero } from "@/components/business-day-hero"
import { BarbaraWelcome } from "@/components/barbara-welcome"
import { DailyDeclaration } from "@/components/daily-declaration"
import { BusinessDaySchedule } from "@/components/business-day-schedule"
import { OperatingPlannerSection } from "@/components/operating-planner/operating-planner-section"
import { DeveloperToolbar } from "@/components/developer-toolbar"
import { createBrowserClient } from "@supabase/ssr"

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
      {/* Operating Engine providers now live at root layout — no per-page wrapper
          needed. Components read useOperatingEngine() and useHarmonyWeek() freely. */}

      {/* 1. Hero — orientation */}
      <BusinessDayHero />

      {/* 2. Barbara Welcome — the WHY */}
      <BarbaraWelcome />

      {/* Today's Declaration™ — set during Morning GIV•EN™, persistent
          reminder above the rest of the Work-Life Balance Business Day™. */}
      <DailyDeclaration />

      {/* 3. Operating Planner™ — hidden during Time Freedom™ window. */}
      <OperatingPlannerSection />

      {/* 5. Today's Segments — the HOW (detailed cards) */}
      <BusinessDaySchedule />

      {/* Admin-only Developer Toolbar */}
      <DeveloperToolbar />

      {/* Chat + Co-Guide modals retained so members can still launch guidance */}
      <SimpleChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={chatContext}
        title={chatTitle}
      />
      <CherryBlossomCoGuide isOpen={isCoGuideOpen} onClose={() => setIsCoGuideOpen(false)} userId={userId} />
    </div>
  )
}
