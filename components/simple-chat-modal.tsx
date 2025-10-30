"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import type { JSX } from "react/jsx-runtime"

interface SimpleChatModalProps {
  isOpen: boolean
  onClose: () => void
  context: string
  title: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

function formatMessage(content: string) {
  // Split into lines
  const lines = content.split("\n")
  const formatted: JSX.Element[] = []

  lines.forEach((line, index) => {
    // Skip empty lines
    if (!line.trim()) {
      formatted.push(<br key={`br-${index}`} />)
      return
    }

    // Format bold text (**text** -> <strong>text</strong>)
    const parts = line.split(/(\*\*.*?\*\*)/)
    const formattedLine = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={`bold-${index}-${i}`}>{part.slice(2, -2)}</strong>
      }
      return part
    })

    // Check if it's a numbered list item
    if (/^\d+\./.test(line.trim())) {
      formatted.push(
        <div key={`line-${index}`} className="mb-3">
          {formattedLine}
        </div>,
      )
    } else {
      formatted.push(
        <div key={`line-${index}`} className="mb-2">
          {formattedLine}
        </div>,
      )
    }
  })

  return <div>{formatted}</div>
}

export function SimpleChatModal({ isOpen, onClose, context, title }: SimpleChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setMessages([])
      setInput("")
    }
  }, [isOpen, context])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      console.log("[v0] Sending message to API:", { message: input, context })

      const response = await fetch("/api/cherry-blossom-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", response.headers.get("content-type"))

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] Non-JSON response:", text)
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()
      console.log("[v0] Response data:", data)

      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
      } else if (data.error) {
        console.error("[v0] API error:", data.error)
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }])
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that request." }])
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, there was an error." }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{title}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>Start a conversation about {context}</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-[#E26C73] text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                {formatMessage(message.content)}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Type your message..."
              className="flex-1 min-h-[60px]"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-[#E26C73] hover:bg-[#D55A60]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SimpleChatModal
