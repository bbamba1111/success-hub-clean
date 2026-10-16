import type { Metadata } from "next"
import { SectionHub } from "@/components/navigation/section-hub"

export const metadata: Metadata = {
  title: "Lead | Make Time For More™",
  description:
    "Your business execution workspaces — the 4-Hour Focused CEO Workday™, AI Executive Team™, and more.",
}

export default function LeadPage() {
  return <SectionHub sectionId="lead" />
}
