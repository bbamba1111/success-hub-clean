import type { Metadata } from "next"
import { OperatingCenter } from "@/components/operating-center/operating-center"

export const metadata: Metadata = {
  title: "My Work-Life Balance Dashboard™ | Make Time For More™",
  description:
    "Your Weekly Operating Center™ — your current Reality Check score, Weekly Intention, Priority Focus Areas, and progress over time.",
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F0]">
      <OperatingCenter />
    </main>
  )
}
