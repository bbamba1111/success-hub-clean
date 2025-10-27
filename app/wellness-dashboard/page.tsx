"use client"

import WellnessPlannerDashboard from "@/components/wellness-planner-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function WellnessDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={40}
                height={40}
                className="rounded-full shadow-lg"
              />
              <h1 className="text-xl font-bold text-gray-900">Wellness Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <WellnessPlannerDashboard />
      </div>
    </div>
  )
}
