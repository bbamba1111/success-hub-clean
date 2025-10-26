"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CherryBlossomCountdown from "@/components/cherry-blossom-countdown"
import WorkLifeBalanceSchedule from "@/components/work-life-balance-schedule"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                M
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Make Time For More<sup className="text-lg">™</sup> Monthly Success Hub
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Your comprehensive work-life balance experience with countdown timers, schedules, and community connections.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Section */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Step 2
            </Badge>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
              Make The Sunday Shift
            </h3>
            <p className="text-xl text-gray-700 font-medium">
              Adopt The Work-Life Balance Business Model & SOP™
            </p>
          </div>

          <div className="text-center mb-12">
            <CherryBlossomCountdown />
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Badge variant="secondary" className="bg-[#7FB069] text-white border-0">
              Step 3
            </Badge>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#7FB069] mb-4">
              Break The Hustle Habit — Co-Work Your Non-Negotiables™
            </h3>
          </div>

          <div className="rounded-2xl overflow-hidden mt-4">
            <WorkLifeBalanceSchedule />
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