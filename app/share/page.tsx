import type { Metadata } from "next"
import { SectionHub } from "@/components/navigation/section-hub"

export const metadata: Metadata = {
  title: "Share | Make Time For More™",
  description:
    "The Time Freedom™ community — celebrate contained work and expanded life in the Cherry Blossom Garden™.",
}

export default function SharePage() {
  return <SectionHub sectionId="share" />
}
