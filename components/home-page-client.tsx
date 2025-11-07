"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { SimpleChatModal } from "@/components/simple-chat-modal"
import { HubClosedBanner } from "@/components/hub-closed-banner"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface HomePageProps {
  user: User
}

export default function HomePage({ user }: HomePageProps) {
  const [dashboardVisited, setDashboardVisited] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState<string>("")
  const [chatTitle, setChatTitle] = useState("")
  const router = useRouter()

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

  const openChat = (context: string, title: string) => {
    setChatContext(context)
    setChatTitle(title)
    setIsChatOpen(true)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/welcome")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="flex justify-end items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, {user.email}</span>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-900 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        <HubClosedBanner />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">{/* ... existing code ... */}</div>

      {/* Onboarding Section */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20">{/* ... existing code ... */}</div>

      {/* Sunday Shift Section */}
      <div className="relative overflow-hidden py-20">{/* ... existing code ... */}</div>

      {/* Co-Working Section */}
      <div className="bg-white py-20">{/* ... existing code ... */}</div>

      {/* Cherry Blossom AI Suite */}
      <div className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 pt-20 pb-25">
        {/* ... existing code ... */}
      </div>

      {/* Wellness Dashboard */}
      <div id="wellness-dashboard" className="max-w-6xl mx-auto px-6 py-16">
        {/* ... existing code ... */}
      </div>

      {/* Facebook Group */}
      <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 py-24">{/* ... existing code ... */}</div>

      {/* Rest & Recharge */}
      <div className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 pt-20 pb-8">{/* ... existing code ... */}</div>

      {/* Book Barbara */}
      <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 py-8 pb-24">{/* ... existing code ... */}</div>

      <SimpleChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={chatContext}
        title={chatTitle}
      />
    </div>
  )
}
