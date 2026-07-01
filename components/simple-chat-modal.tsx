"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, Loader2 } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import type { JSX } from "react/jsx-runtime"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

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

/**
 * The Work-Life Balance Business Day™ experiences that support planning. The
 * universal three-choice offer appears only for these activity contexts.
 */
const PLANNING_CONTEXTS = new Set([
  "morning-routine",
  "workout-window",
  "lunch-break",
  "ceo-workday",
  "lifestyle-experiences",
  "digital-detox",
])

/** Universal planning choices — three levels of coaching, same everywhere. */
const PLANNING_OPTIONS = [
  { id: "lets-plan-together", label: "Let's Plan Together", emoji: "✨" },
  { id: "give-me-ideas", label: "Give Me a Few Ideas", emoji: "🌸" },
  { id: "im-all-set", label: "No Thanks, I'm All Set", emoji: "✓" },
] as const

/**
 * Fire-and-forget: after a real exchange, ask the server to quietly extract any
 * meaningful long-term memories into Cherry Blossom's Memory Vault™. Never
 * blocks the conversation and silently ignores failures.
 */
function rememberExchange(userMessage: string, assistantMessage: string) {
  try {
    void fetch("/api/cherry-blossom/remember", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, assistantMessage }),
    }).catch(() => {})
  } catch {
    // ignore — memory is best-effort
  }
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
  const [showPlanning, setShowPlanning] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastAssistantMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (!isWithinBusinessHours()) {
        alert("The Success Hub is closed for the night (11 PM - 7 AM ET). We'll see you tomorrow!")
        onClose()
        return
      }

      setMessages([])
      setInput("")
      setShowPlanning(false)

      // Send automatic welcome message
      const sendWelcomeMessage = async () => {
        setIsLoading(true)
        try {
          const response = await fetch("/api/cherry-blossom-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "WELCOME_MESSAGE", // Special trigger for welcome
              messages: [],
              context,
            }),
          })

          const data = await response.json()
          if (data.message) {
            setMessages([{ role: "assistant", content: data.message }])
            // Offer the universal planning choices for activity experiences.
            if (PLANNING_CONTEXTS.has(context)) {
              setShowPlanning(true)
            }
          }
        } catch (error) {
          console.error("[v0] Welcome message error:", error)
        } finally {
          setIsLoading(false)
        }
      }

      sendWelcomeMessage()
    }
  }, [isOpen, context])

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      lastAssistantMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowPlanning(false)

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
        // Quietly grow the Memory Vault™ from this genuine exchange.
        rememberExchange(userMessage.content, data.message)
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

  /**
   * Sends one of the universal planning choices. Shows a friendly user bubble,
   * asks the API to steer coaching accordingly, and persists the member's
   * preferred style server-side. Choice is never removed — members can pick a
   * different level on any day.
   */
  const sendPlanningChoice = async (option: (typeof PLANNING_OPTIONS)[number]) => {
    if (isLoading) return
    setShowPlanning(false)

    const userBubble: Message = { role: "user", content: option.label }
    const priorMessages = messages
    setMessages((prev) => [...prev, userBubble])
    setIsLoading(true)

    try {
      const response = await fetch("/api/cherry-blossom-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[PLANNING_CHOICE: ${option.id}]`,
          messages: priorMessages.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      })

      const data = await response.json()
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
      } else if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }])
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that request." }])
      }
    } catch (error) {
      console.error("[v0] Planning choice error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, there was an error." }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="border-b border-[#E26C73]/20 bg-gradient-to-r from-[#E26C73]/20 to-[#7FB069]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src="/images/logo.png" alt="Cherry Blossom" className="w-full h-full object-cover" />
              </div>
              <CardTitle className="text-xl flex items-center gap-2">
                {title}
                <span className="text-[#E26C73]">🌸</span>
              </CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/50">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#7FB069]/5 to-white">
          {messages.map((message, index) => {
            const isLastAssistantMessage = message.role === "assistant" && index === messages.length - 1

            return (
              <div
                key={index}
                ref={isLastAssistantMessage ? lastAssistantMessageRef : null}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#7FB069]/80 to-[#E26C73]/80 text-white"
                      : "bg-white border border-[#E26C73]/20 text-gray-900"
                  }`}
                >
                  {formatMessage(message.content)}
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E26C73]/20 rounded-lg p-3 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-[#E26C73]" />
              </div>
            </div>
          )}

          {showPlanning && !isLoading && (
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-sm font-medium text-[#5A4A52]">
                Would you like a little help planning today&apos;s experience?
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {PLANNING_OPTIONS.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => sendPlanningChoice(option)}
                    variant="outline"
                    className="justify-start border-[#7FB069]/40 bg-white text-[#4A6B38] hover:bg-[#7FB069]/10 hover:text-[#4A6B38] sm:flex-1"
                  >
                    <span aria-hidden className="mr-2">
                      {option.emoji}
                    </span>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t border-[#E26C73]/20 p-4 bg-white">
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
              className="flex-1 min-h-[60px] border-[#E26C73]/30 focus:border-[#7FB069]/50"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-[#7FB069]/80 to-[#E26C73]/80 hover:from-[#7FB069] hover:to-[#E26C73] shadow-md"
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
