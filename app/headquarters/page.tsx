import type { Metadata } from "next"
import { FounderCommandCenter } from "@/components/command-center/founder-command-center"

export const metadata: Metadata = {
  title: "Today's Headquarters™ | Make Time For More™",
  description:
    "Your Founder Command Center™ — Today's Next Best Step™, the Cherry Blossom Executive Brief™, and Time Freedom Time™, all powered by your Founder Intelligence Engine™.",
}

export default function HeadquartersPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <FounderCommandCenter />
    </div>
  )
}
