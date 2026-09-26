import type { Metadata } from "next"
import { SectionHub } from "@/components/navigation/section-hub"

export const metadata: Metadata = {
  title: "Grow | Make Time For More™",
  description:
    "Your profile, results, progress, Cherry Blossom Memory Vault™, and long-term growth in one place.",
}

export default function GrowPage() {
  return <SectionHub sectionId="grow" />
}
