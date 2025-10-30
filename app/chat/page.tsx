"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import CherryBlossomChat from "@/components/cherry-blossom-chat"

function ChatContent() {
  const searchParams = useSearchParams()
  const context = searchParams.get("context") || "general"

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <CherryBlossomChat isOpen={true} onClose={() => window.history.back()} title="Chat & Plan with Cherry Blossom" />
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  )
}
