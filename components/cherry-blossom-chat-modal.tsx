"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, X } from 'lucide-react'
import { renderMarkdown } from "@/lib/utils/markdown-renderer"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

interface CherryBlossomChatModalProps {
  isOpen: boolean
  onClose: () => void
  prefillMessage?: string
  conversationTitle?: string
  executiveRole?: string
  isAuthenticated?: boolean
  isLoadingAuth?: boolean
}

export function CherryBlossomChatModal({
  isOpen,
  onClose,
  prefillMessage = "",
  conversationTitle = "Cherry Blossom Coaching Session",
  executiveRole = "Work-Life Balance Coach",
  isAuthenticated = true,
  isLoadingAuth = false,
}: CherryBlossomChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !hasStarted) {
      setHasStarted(true)
      handleWelcome()
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleWelcome = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/human-zone-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isWelcome: true }),
      })

      if (!response.ok) throw new Error("Failed to get welcome")

      const data = await response.json()
      setMessages([{ role: "assistant", content: data.message, id: "welcome" }])

      if (prefillMessage) {
        setTimeout(() => {
          handleSubmit(null, prefillMessage)
        }, 500)
      }
    } catch (error) {
      console.error("Welcome error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent | null, messageOverride?: string) => {
    if (e) e.preventDefault()
    const messageToSend = messageOverride || input.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: messageToSend,
      id: `user-${Date.now()}`,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/human-zone-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          id: `assistant-${Date.now()}`,
        },
      ])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, I'm having trouble responding. Please try again.",
          id: `error-${Date.now()}`,
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

  if (!isAuthenticated && !isLoadingAuth) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#E26C73]">Sign In Required</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-lg text-gray-700 mb-6">
              Please sign in to start your coaching session with Cherry Blossom
            </p>
            <Button size="lg" className="bg-[#E26C73] hover:bg-[#E26C73]/90 text-white">
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 bg-[#FDF9F5]">
        {/* Header with soft pink background */}
        <div className="bg-[#FCF2F3] border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Cherry blossom icon */}
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#E26C73]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🌸</span>
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
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 py-6">
            {messages.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <p className="text-gray-900 text-lg leading-relaxed">
                  The Success Hub is closed for the night. Business Hours: 7 AM - 11 PM ET. Remember: Work-Life Balance
                  means rest too! 💚
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
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
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} data-chat-form className="px-6 py-5 border-t border-gray-200">
          <div className="flex gap-3 items-end">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Type your message..."
              className="flex-1 h-14 text-base px-5 border-2 border-gray-300 rounded-xl focus:border-[#E26C73] bg-white"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="lg"
              className="h-14 w-14 bg-gradient-to-r from-[#5D9D61] to-[#E26C73] hover:from-[#5D9D61]/90 hover:to-[#E26C73]/90 text-white rounded-xl flex-shrink-0"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CherryBlossomChatModal
