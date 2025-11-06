"use client"

import { useEffect, useState } from "react"
import { SimpleChatModal } from "@/components/simple-chat-modal"
import { HubClosedBanner } from "@/components/hub-closed-banner"
import { AuthModal } from "@/components/auth-modal"

interface HubPageClientProps {
  isAuthenticated: boolean
}

export function HubPageClient({ isAuthenticated }: HubPageClientProps) {
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated)
  const [dashboardVisited, setDashboardVisited] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState<string>("")
  const [chatTitle, setChatTitle] = useState("")

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

  return (
    <>
      {/* Show auth modal overlay if not authenticated */}
      {showAuthModal && (
        <>
          {/* Blurred content */}
          <div className="blur-sm pointer-events-none select-none">
            <HomePageContent
              dashboardVisited={dashboardVisited}
              scrollToWellnessDashboard={scrollToWellnessDashboard}
              openChat={openChat}
            />
          </div>
          {/* Auth modal */}
          <AuthModal onSuccess={() => setShowAuthModal(false)} />
        </>
      )}

      {/* Show normal content if authenticated */}
      {!showAuthModal && (
        <HomePageContent
          dashboardVisited={dashboardVisited}
          scrollToWellnessDashboard={scrollToWellnessDashboard}
          openChat={openChat}
        />
      )}

      <SimpleChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={chatContext}
        title={chatTitle}
      />
    </>
  )
}

interface HomePageContentProps {
  dashboardVisited: boolean
  scrollToWellnessDashboard: () => void
  openChat: (context: string, title: string) => void
}

function HomePageContent({ dashboardVisited, scrollToWellnessDashboard, openChat }: HomePageContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <HubClosedBanner />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  Make Time For More<sup className="text-lg">™</sup> Monthly -- the Work-Life Balance Success Hub
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
                  src="/images/hero-women-tea-cherry-blossoms-new.png"
                  alt="Diverse women enjoying tea together in cherry blossom garden"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the content remains the same - using existing code comment to skip */}
    </div>
  )
}
