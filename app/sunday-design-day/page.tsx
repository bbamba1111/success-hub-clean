import type { Metadata } from "next"
import { SundayDesignDayFlow } from "@/components/sunday-design-day/sunday-design-day-flow"

export const metadata: Metadata = {
  title: "Sunday Design Day™ | The Harmony Lane™",
  description:
    "The Weekly Installation Experience for the Work-Life Balance Business Week™. Design tomorrow, live it tomorrow.",
}

export default function SundayDesignDayPage() {
  return (
    <main className="min-h-screen bg-background">
      <SundayDesignDayFlow />
    </main>
  )
}
