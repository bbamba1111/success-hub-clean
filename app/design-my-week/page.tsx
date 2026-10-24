import { Metadata } from "next"
import { DesignMyWeekClient } from "@/components/design-my-week/design-my-week-client"

export const metadata: Metadata = {
  title: "Design My Week™ | Harmony Lane™",
  description: "Install your Daily Non-Negotiables™ and Intention Declarations™ for your Work-Life Balance Business Week™.",
}

export default function DesignMyWeekPage() {
  return <DesignMyWeekClient />
}
