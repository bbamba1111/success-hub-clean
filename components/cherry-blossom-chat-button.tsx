"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import CherryBlossomChat from "./cherry-blossom-chat"

interface CherryBlossomChatButtonProps {
  context?: string
  className?: string
  variant?: "floating" | "inline"
}

export default function CherryBlossomChatButton({
  context,
  className = "",
  variant = "floating",
}: CherryBlossomChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  if (variant === "floating") {
    return (
      <>
        <Button
          onClick={() => setIsChatOpen(true)}
          className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white shadow-lg hover:shadow-xl transition-all duration-300 z-40 ${className}`}
          size="lg"
        >
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">🌸</span>
          </div>
        </Button>

        <CherryBlossomChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialContext={context} />
      </>
    )
  }

  return (
    <>
      <Button
        onClick={() => setIsChatOpen(true)}
        className={`bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white ${className}`}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Chat with Cherry Blossom 🌸
      </Button>

      <CherryBlossomChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialContext={context} />
    </>
  )
}

export { CherryBlossomChatButton }
