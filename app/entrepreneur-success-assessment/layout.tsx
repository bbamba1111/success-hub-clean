import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Business Bottleneck Audit™ | Harmony Lane™",
  description:
    "Establish your one-time Business Bottleneck Audit™ baseline across 15 business areas, then keep it current with a lightweight Monday Weekly Business Measurement™.",
}

export default function EntrepreneurSuccessAssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
