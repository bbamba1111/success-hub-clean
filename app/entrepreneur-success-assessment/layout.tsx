import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Entrepreneur Success Assessment™ | Harmony Lane™",
  description:
    "Reflect on how your business has been operating over the past 30 days so we can bring both your life and your business together in your Work-Life Balance Reality Check™.",
}

export default function EntrepreneurSuccessAssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
