"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, Sparkles } from "lucide-react"
import CherryBlossomGPTSuite from "./cherry-blossom-gpt-suite"

interface CherryBlossomSuiteButtonProps {
  className?: string
  variant?: "floating" | "inline"
  initialSpecialist?: string
}

export default function CherryBlossomSuiteButton({
  className = "",
  variant = "floating",
  initialSpecialist,
}: CherryBlossomSuiteButtonProps) {
  const [isSuiteOpen, setIsSuiteOpen] = useState(false)

  if (variant === "floating") {
    return (
      <>
        <Button
          onClick={() => setIsSuiteOpen(true)}
          className={`fixed bottom-24 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white shadow-lg hover:shadow-xl transition-all duration-300 z-40 ${className}`}
          size="lg"
        >
          <div className="flex flex-col items-center">
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs">Suite</span>
          </div>
        </Button>

        <CherryBlossomGPTSuite
          isOpen={isSuiteOpen}
          onClose={() => setIsSuiteOpen(false)}
          initialSpecialist={initialSpecialist}
        />
      </>
    )
  }

  return (
    <>
      <Button
        onClick={() => setIsSuiteOpen(true)}
        className={`bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white ${className}`}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Cherry Blossom GPT Suite
      </Button>

      <CherryBlossomGPTSuite
        isOpen={isSuiteOpen}
        onClose={() => setIsSuiteOpen(false)}
        initialSpecialist={initialSpecialist}
      />
    </>
  )
}
