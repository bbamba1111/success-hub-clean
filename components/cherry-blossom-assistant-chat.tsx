"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Copy, ExternalLink } from "lucide-react"

interface CherryBlossomAssistantChatProps {
  isOpen: boolean
  onClose: () => void
  assistantType: string
  title: string
  initialMessage: string
  userName: string
}

export default function CherryBlossomAssistantChat({
  isOpen,
  onClose,
  assistantType,
  title,
  initialMessage,
  userName,
}: CherryBlossomAssistantChatProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(initialMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const openCherryBlossomGPT = () => {
    window.open(
      "https://chatgpt.com/g/g-68d2da76c4d881919bf0ff4131ac8ca8-your-work-life-balance-audit-review-2-0",
      "_blank",
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E26C73]/20">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E26C73]/30 shadow-md">
                <img src="/images/logo.png" alt="Cherry Blossom" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#E26C73] flex items-center gap-2">
                  {title}
                  <span>🌸</span>
                </h3>
                <p className="text-sm text-gray-600">Chat & Plan with Cherry Blossom</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 hover:bg-[#E26C73]/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4 bg-gradient-to-b from-[#7FB069]/5 to-white p-4 rounded-lg">
            <p className="text-gray-600">Your personalized intention prompt is ready! Follow these steps:</p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#E26C73]/80 to-[#7FB069]/80 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-gray-700">Copy your intention prompt below</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#E26C73]/80 to-[#7FB069]/80 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-gray-700">Click "Open Cherry Blossom" to launch the AI assistant</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#E26C73]/80 to-[#7FB069]/80 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-gray-700">Paste your prompt and start your 28-day transformation journey</p>
              </div>
            </div>

            <div className="border border-[#E26C73]/30 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[#E26C73]">Your Intention Prompt:</h4>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white border-[#7FB069]/30 hover:bg-[#7FB069]/10"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="bg-gradient-to-br from-[#7FB069]/5 to-[#E26C73]/5 p-3 rounded border border-[#E26C73]/20 text-sm max-h-48 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">{initialMessage}</pre>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={openCherryBlossomGPT}
                className="flex-1 bg-gradient-to-r from-[#7FB069]/80 to-[#E26C73]/80 hover:from-[#7FB069] hover:to-[#E26C73] text-white shadow-md"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Cherry Blossom
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="px-6 bg-white border-[#E26C73]/30 hover:bg-[#E26C73]/10"
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
