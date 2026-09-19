import type { Metadata } from "next"
import { Leaf } from "lucide-react"
import { ComingSoon } from "@/components/navigation/coming-soon"

export const metadata: Metadata = {
  title: "Time Freedom™ | Make Time For More™",
  description:
    "The life your business exists to support — celebrate contained work and expanded life.",
}

/**
 * Time Freedom™ — a permanent navigation destination. Placeholder for now
 * (Pass 4A.1); the Time Freedom Moments™ community will move in here in a
 * later pass. Its route and component remain live in the meantime.
 */
export default function TimeFreedomPage() {
  return (
    <ComingSoon
      eyebrow="The Work-Life Balance Operating System™"
      title="Time Freedom™"
      tagline="This is the life your business exists to support. Soon, this becomes your space to protect, plan, and celebrate the freedom you're reclaiming — where presence is the real success."
      icon={Leaf}
      planned={[
        "Time Freedom Moments™ — share and celebrate expanded life with the community",
        "Your weekly Time Freedom Commitment™ from Sunday Design Day™",
        "Cherry Blossom's gentle presence, in context",
      ]}
    />
  )
}
