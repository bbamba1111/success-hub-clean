"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { WorkoutPlannerWidget } from "@/components/planners/workout-planner-widget"

export default function WorkoutPlannerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white py-12">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        <WorkoutPlannerWidget />

        {/* Back to home */}
        <div className="flex justify-center">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white px-8 py-5"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
