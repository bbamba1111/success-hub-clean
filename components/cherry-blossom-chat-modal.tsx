"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { renderMarkdown } from "@/lib/utils/markdown-renderer"

interface CherryBlossomChatModalProps {
  isOpen: boolean
  onClose: () => void
  prefillMessage?: string
  conversationTitle?: string
  executiveRole?: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function CherryBlossomChatModal({
  isOpen,
  onClose,
  prefillMessage = "",
  conversationTitle = "Cherry Blossom Chat",
  executiveRole = "Human Zone of Genius Guide",
}: CherryBlossomChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleWelcomeMessage()
    }
  }, [isOpen])

  const handleWelcomeMessage = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/chat/cherry-blossom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isWelcome: true }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API returned non-JSON response")
      }

      if (!response.ok) {
        throw new Error("Failed to get welcome message")
      }

      const data = await response.json()
      
      if (!data.message) {
        throw new Error("No message in response")
      }

      setMessages([{ role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error fetching welcome message:", error)
      setMessages([
        {
          role: "assistant",
          content: "Welcome! I'm here to help you design your 4-Hour CEO Workday. How can I assist you today?",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat/cherry-blossom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API returned non-JSON response")
      }

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      
      if (!data.message) {
        throw new Error("No message in response")
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && prefillMessage && messages.length === 1) {
      setInput(prefillMessage)
    }
  }, [isOpen, prefillMessage, messages.length])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header with soft pink background */}
        <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border-b border-pink-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <span className="text-2xl">🌸</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {conversationTitle} <span className="text-xl">🌸</span>
            </h2>
            <p className="text-sm text-gray-600">{executiveRole}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-white/50"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-pink-50/30 to-white">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-[#5D9D61] to-[#4a7d4e] text-white"
                    : "bg-white border border-pink-100"
                }`}
              >
                <div
                  className={`prose prose-sm max-w-none ${
                    message.role === "user" ? "prose-invert" : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(message.content),
                  }}
                />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-pink-100 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[#E26C73] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-[#E26C73] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-[#E26C73] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-6 border-t bg-white">
          <div className="flex gap-3 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 h-14 px-5 text-base rounded-xl border-gray-200 focus:border-[#E26C73] focus:ring-[#E26C73]"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#5D9D61] to-[#E26C73] hover:from-[#4a7d4e] hover:to-[#d45c63] disabled:opacity-50 shadow-md"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
