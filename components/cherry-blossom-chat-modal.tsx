"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, X } from 'lucide-react'
import { renderMarkdown } from "@/lib/utils/markdown-renderer"
import Image from "next/image"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface CherryBlossomChatModalProps {
  isOpen: boolean
  onClose: () => void
  prefillMessage?: string
  conversationTitle?: string
  executiveRole?: string
}

export function CherryBlossomChatModal({
  isOpen,
  onClose,
  prefillMessage = "",
  conversationTitle = "Cherry Blossom Coaching Session",
  executiveRole = "Work-Life Balance Coach",
}: CherryBlossomChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !hasStarted) {
      setHasStarted(true)
      handleWelcome()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleWelcome = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/chat/cherry-blossom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executiveRole,
          isWelcome: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get welcome message")
      }

      const data = await response.json()

      if (data.message) {
        setMessages([{ role: "assistant", content: data.message }])
      } else {
        setMessages([
          {
            role: "assistant",
            content: "Welcome! I'm here to help you design your 4-Hour CEO Workday. How can I assist you today?",
          },
        ])
      }

      if (prefillMessage) {
        setTimeout(() => {
          setInput(prefillMessage)
        }, 500)
      }
    } catch (error) {
      console.error("Error getting welcome:", error)
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
    const messageToSend = input.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = { role: "user", content: messageToSend }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat/cherry-blossom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          executiveRole,
          isWelcome: false,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()

      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
      } else if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }])
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that request." }])
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setMessages([])
    setInput("")
    setHasStarted(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 bg-[#FDF9F5]">
        {/* Header with soft pink background */}
        <div className="bg-[#FCF2F3] border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#E26C73]/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image src="/images/logo.png" alt="Logo" width={56} height={56} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{conversationTitle}</h2>
              <span className="text-2xl">🌸</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-10 w-10 rounded-full hover:bg-gray-200"
          >
            <X className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* Main chat area */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4 py-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-5 shadow-sm ${
                    message.role === "user"
                      ? "bg-[#5D9D61] text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="text-white leading-relaxed text-base">{message.content}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none [&_p]:text-gray-900 [&_p]:leading-relaxed [&_p]:text-base">
                      {renderMarkdown(message.content)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-[#E26C73]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 border-t border-gray-200">
          <div className="flex gap-3 items-end">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 h-14 text-base px-5 border-2 border-gray-300 rounded-xl focus:border-[#E26C73] bg-white"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="lg"
              className="h-14 px-6 bg-gradient-to-r from-[#5D9D61] to-[#E26C73] hover:from-[#5D9D61]/90 hover:to-[#E26C73]/90 text-white rounded-xl flex-shrink-0 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span className="font-medium">Send</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CherryBlossomChatModal
