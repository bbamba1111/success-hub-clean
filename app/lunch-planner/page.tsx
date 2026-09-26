"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { LunchPlannerWidget } from "@/components/planners/lunch-planner-widget"

export default function LunchPlannerPage() {
  return (
    <div
      className="min-h-screen py-12 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.94)), url('/images/women-tea-cherry-blossoms.png')" }}
    >
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        <LunchPlannerWidget />

        {/* Back to home */}
        <div className="flex justify-center">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-[#E26C73] text-[#E26C73] hover:bg-[#E26C73] hover:text-white px-8 py-5"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
