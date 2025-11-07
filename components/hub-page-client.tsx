"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Calendar, Target, Sparkles, Activity } from "lucide-react"
import { SimpleChatModal } from "@/components/simple-chat-modal"
import { HubClosedBanner } from "@/components/hub-closed-banner"
import WellnessPlannerDashboard from "@/components/wellness-planner-dashboard"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface HubPageProps {
  user: User
}

export default function HubPageClient({ user }: HubPageProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState<string>("")
  const [chatTitle, setChatTitle] = useState("")
  const router = useRouter()

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
      <HubClosedBanner />

      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={50}
                height={50}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Success Hub</h1>
                <p className="text-sm text-gray-600">Welcome, {user.email}</p>
              </div>
            </div>
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
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid md:grid-cols-4 gap-4">
          <Link href="/audit">
            <div className="p-6 bg-white rounded-lg border-2 border-[#7FB069]/30 hover:border-[#7FB069] transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7FB069] to-[#7FB069]/70 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Work-Life Audit</h3>
                  <p className="text-sm text-gray-600 mt-1">Assess your balance</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/cherry-blossom-intentions">
            <div className="p-6 bg-white rounded-lg border-2 border-[#E26C73]/30 hover:border-[#E26C73] transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E26C73] to-[#E26C73]/70 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Intention Setter</h3>
                  <p className="text-sm text-gray-600 mt-1">Set 28-day goals</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/cherry-blossom">
            <div className="p-6 bg-white rounded-lg border-2 border-[#7FB069]/30 hover:border-[#7FB069] transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cherry Blossom AI</h3>
                  <p className="text-sm text-gray-600 mt-1">Your AI co-guide</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/make-time-for-more-mondays">
            <div className="p-6 bg-white rounded-lg border-2 border-[#E26C73]/30 hover:border-[#E26C73] transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E26C73] to-[#E26C73]/70 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Monday Sessions</h3>
                  <p className="text-sm text-gray-600 mt-1">Weekly coaching</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <WellnessPlannerDashboard />
        </div>
      </div>

      <SimpleChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={chatContext}
        title={chatTitle}
      />
    </div>
  )
}
