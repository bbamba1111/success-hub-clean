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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#E26C73]">{title}</h3>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">Your personalized intention prompt is ready! Follow these steps:</p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E26C73] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-gray-700">Copy your intention prompt below</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E26C73] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-gray-700">Click "Open Cherry Blossom" to launch the AI assistant</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#E26C73] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-gray-700">Paste your prompt and start your 28-day transformation journey</p>
              </div>
            </div>

            <div className="border border-[#E26C73]/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[#E26C73]">Your Intention Prompt:</h4>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="bg-gray-50 p-3 rounded border text-sm max-h-48 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">{initialMessage}</pre>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={openCherryBlossomGPT}
                className="flex-1 bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Cherry Blossom
              </Button>
              <Button onClick={onClose} variant="outline" className="px-6 bg-transparent">
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
