"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Send, Copy, Trash2, MessageCircle } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface CherryBlossomChatProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

export default function CherryBlossomChat({
  isOpen,
  onClose,
  title = "Chat & Plan with Cherry Blossom",
}: CherryBlossomChatProps) {
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
      // Add welcome message when chat opens
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "🌸 Hello! I'm Cherry Blossom, your AI work-life balance companion. I'm here to help you create more harmony, intention, and joy in your daily life. How can I support you today?",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/cherry-blossom-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "🌸 Hello! I'm Cherry Blossom, your AI work-life balance companion. I'm here to help you create more harmony, intention, and joy in your daily life. How can I support you today?",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col bg-white shadow-2xl">
        <CardHeader className="flex-shrink-0 bg-gradient-to-r from-[#E26C73]/20 to-[#7FB069]/20 border-b border-[#E26C73]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src="/images/logo.png" alt="Cherry Blossom" className="w-full h-full object-cover" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {title}
                  <span className="text-[#E26C73]">🌸</span>
                </CardTitle>
                <Badge variant="secondary" className="mt-1 bg-[#7FB069]/30 text-[#7FB069] border-[#7FB069]/20">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Available 24/7
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="text-gray-600 bg-white/50 hover:bg-white border-[#E26C73]/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-gray-600 bg-white/50 hover:bg-white border-[#E26C73]/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#7FB069]/5 to-white">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[#7FB069]/80 to-[#E26C73]/80 text-white"
                        : "bg-white border border-[#E26C73]/20 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className={`text-xs ${message.role === "user" ? "text-white/70" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                        className={`h-6 w-6 p-0 ${
                          message.role === "user"
                            ? "text-white/70 hover:text-white"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E26C73]/20 rounded-lg p-4 max-w-[80%] shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#E26C73]/60 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#7FB069]/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#E26C73]/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0 border-t border-[#E26C73]/20 p-4 bg-white">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Cherry Blossom anything about work-life balance..."
                  disabled={isLoading}
                  className="flex-1 border-[#E26C73]/30 focus:border-[#7FB069]/50"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-[#7FB069]/80 to-[#E26C73]/80 hover:from-[#7FB069] hover:to-[#E26C73] text-white shadow-md"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
