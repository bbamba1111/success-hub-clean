import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Entrepreneur Success Assessment™ | Harmony Lane™",
  description:
    "Establish your operating baseline across the Eight Operating Pillars™. No right or wrong answers — we are simply establishing your starting point.",
}

export default function EntrepreneurSuccessAssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
