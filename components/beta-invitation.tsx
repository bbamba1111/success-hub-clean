"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { ExternalLink, ArrowLeft, Flower, Globe } from 'lucide-react'
import { useRouter } from "next/navigation"
import type { Category, Result } from "./work-life-balance-audit"
import { ButtonLink } from "./ui/button-link"

// More concise description that emphasizes spiritual co-creation
const improvedDescription = `
At Make Time For More™, we help high-achieving women entrepreneurs like you tap into the spiritual side of the Business and life success equation through:

1. The Work-Life Balance Experience™ - Reset your rhythms and reclaim your time through our transformative immersion.

2. The Work-Life Balance Business Model & SOP Installation™ - Replace hustle culture with a sustainable, life-first structure designed specifically for women who want both business success AND quality of life.

Both pathways reveal The Sacred Secret to Success that the top 5% of entrepreneurs use to break free from burnout cycles and finally enjoy the freedom you built your business for.
`

interface BetaInvitationProps {
  onBack: () => void
  overallScore: number
  name?: string
  email?: string
  results?: Result[]
  categoryLabels?: Record<Category, string>
  personalizedFeedback?: { category: Category; feedback: string }[]
}

export default function BetaInvitation({
  onBack,
  overallScore,
  name = "",
  email = "",
  results = [],
  categoryLabels = {},
  personalizedFeedback = [],
}: BetaInvitationProps) {
  const router = useRouter()
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isCherryPromptCopied, setIsCherryPromptCopied] = useState(false)
  const cherryBlossomPromptRef = useRef<HTMLTextAreaElement>(null)

  // Function to navigate to join us page
  const goToJoinUs = () => {
    router.push("/join-us")
  }

  const goToWebsite = () => {
    window.open("https://www.maketimeformore.com", "_blank")
  }

  return (
    <div className="space-y-6 w-full">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <Image
            src="/images/logo.png"
            alt="Make Time For More Logo"
            width={120}
            height={120}
            className="rounded-full shadow-lg"
          />
        </div>
        <h3 className="text-2xl font-bold text-[#E26C73] mb-2 break-words">Make Time For More™</h3>
        <p className="text-gray-600 mb-4 break-words">The Top 5%'s Sacred Secret to Work-Lifestyle Success</p>
      </div>

      <div className="text-center mb-6">
        <h4 className="text-xl font-semibold text-black break-words">Join Us For Our Next Sunday Kick-Off Celebration!</h4>
        <p className="text-gray-600 mt-2">
          <span className="font-medium">May 20, 2024 @ 9:00 AM EST</span>
        </p>
      </div>

      <Card className="border-[#E26C73] bg-[#f5f0e6] w-full">
        <CardContent className="space-y-4 pt-6">
          {improvedDescription.split("\n\n").map((paragraph, index) => (
            <p key={index} className={`${index === 0 ? "font-medium" : ""} break-words`}>
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4 mt-6 w-full">
        <Button onClick={goToJoinUs} className="w-full bg-[#E26C73] hover:bg-[#d15964] text-white">
          <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
          Join Us
        </Button>

        <Button
          onClick={() => router.push("/learn-more")}
          className="w-full bg-[#5D9D61] hover:bg-[#4c8050] text-white"
        >
          <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
          Learn More
        </Button>

        <Button
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSeYa2yNmiIOXykp3Kd5Xts0jDPe96NJ4adWhFYEwi5GXZ3Ilw/viewform?usp=header",
              "_blank"
            )
          }
          className="w-full bg-[#5D9D61] hover:bg-[#4c8050] text-white font-bold"
        >
          <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
          APPLY NOW!
        </Button>

        <Button onClick={goToWebsite} className="w-full bg-[#5D9D61] hover:bg-[#4c8050] text-white">
          <Globe className="mr-2 h-4 w-4 flex-shrink-0" />
          Visit Our Website
        </Button>

        <ButtonLink
          href="https://chatgpt.com/g/g-67f5422677308191aa28a86d8ae5084e-free-work-life-balance-audit-for-women-founders"
          className="w-full bg-[#E26C73] hover:bg-[#d15964] text-white flex items-center justify-center"
        >
          <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="break-words">Chat with Cherry Blossom</span>
          <Flower className="ml-2 h-4 w-4 text-pink-300 font-extrabold flex-shrink-0" />
        </ButtonLink>
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
        Back to Your Results
      </Button>
    </div>
  )
}
