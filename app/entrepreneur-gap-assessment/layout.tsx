import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Entrepreneur Gap Assessment™ | Harmony Lane™",
  description:
    "What is getting in your way? Recognize the problem, diagnose the obstacle, and see the gap it points to — the first step before mapping a solution.",
}

export default function EntrepreneurGapAssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
