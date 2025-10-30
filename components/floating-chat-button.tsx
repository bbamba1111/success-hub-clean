"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"

export function FloatingChatButton() {
  return (
    <Link
      href="/test-chat"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#E26C73] to-[#F4A6AC] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
      aria-label="Open chat"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  )
}

export { FloatingChatButton as default }
