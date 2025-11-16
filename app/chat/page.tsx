"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense } from "react"

function ChatContent() {
  const searchParams = useSearchParams()
  const context = searchParams.get("context") || "general"

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white p-8">
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Cherry Blossom Chat</h1>
        <p className="text-xl text-gray-600">Coming soon...</p>
      </div>
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
