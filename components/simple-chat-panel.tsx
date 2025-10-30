"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface SimpleChatPanelProps {
  isOpen: boolean
  onClose: () => void
  context: string
  title?: string
}

export function SimpleChatPanel({
  isOpen,
  onClose,
  context,
  title = "Chat & Plan with Cherry Blossom",
}: SimpleChatPanelProps) {
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

  // Send initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getGreeting(context)
      setMessages([{ role: "assistant", content: greeting }])
    }
  }, [isOpen, context])

  const getGreeting = (ctx: string) => {
    const greetings: Record<string, string> = {
      "morning-routine":
        "Hello! Let's design your GIV•EN Morning Routine together. Tell me about your current morning and what you'd like to improve.",
      "workout-window": "Hi! Let's plan your 30-Minute Workout Window. What type of movement energizes you most?",
      "lunch-break":
        "Welcome! Let's create your Extended Lunch Break plan. How do you currently spend your lunch time?",
      "ceo-workday": "Hello! Let's structure your 4-Hour CEO Workday. What are your most important priorities?",
      "lifestyle-experiences": "Hi! Let's plan Quality Lifestyle Experiences. What brings you joy and fulfillment?",
      "digital-detox":
        "Welcome! Let's design your Digital Detox routine. When do you find yourself most distracted by technology?",
      "audit-review": "Hello! Let's review your Work-Life Balance Audit results. What stood out to you most?",
      "intention-setting":
        "Hi! Let's set your 28-Day Intention. What area of your life needs the most attention right now?",
      sabbatical:
        "Welcome! Let's plan your 1-Week Sabbatical or Break. What would true rest and recovery look like for you?",
    }
    return greetings[ctx] || "Hello! How can I help you today?"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(`/api/cherry-blossom/${context}/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user" ? "bg-[#7FB069] text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB069]"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-[#7FB069] hover:bg-[#6fa059]">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
