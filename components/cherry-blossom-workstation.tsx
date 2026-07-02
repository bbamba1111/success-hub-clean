"use client"

import { useState, useEffect, useRef } from "react"
import type { JSX } from "react/jsx-runtime"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

interface CherryBlossomWorkstationProps {
  /** Chat context key understood by /api/cherry-blossom-chat (e.g. "lunch-break"). */
  context: string
  /** When true, the workstation lazily loads the welcome message (once). */
  active: boolean
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
 * Fire-and-forget: after a genuine exchange, ask the server to quietly extract
 * any meaningful long-term memories into Cherry Blossom's Memory Vault™. Never
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
  const lines = content.split("\n")
  const formatted: JSX.Element[] = []

  lines.forEach((line, index) => {
    if (!line.trim()) {
      formatted.push(<br key={`br-${index}`} />)
      return
    }

    const parts = line.split(/(\*\*.*?\*\*)/)
    const formattedLine = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={`bold-${index}-${i}`}>{part.slice(2, -2)}</strong>
      }
      return part
    })

    formatted.push(
      <div key={`line-${index}`} className={/^\d+\./.test(line.trim()) ? "mb-3" : "mb-2"}>
        {formattedLine}
      </div>,
    )
  })

  return <div>{formatted}</div>
}

/**
 * CherryBlossomWorkstation — an inline (non-modal) planning workstation that
 * expands directly below the current activity card. Mirrors SimpleChatModal's
 * behavior (welcome message, universal planning choices, Memory Vault™) but is
 * laid out to live inside a card rather than a centered overlay.
 */
export function CherryBlossomWorkstation({ context, active }: CherryBlossomWorkstationProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPlanning, setShowPlanning] = useState(false)
  const [closedForNight, setClosedForNight] = useState(false)
  const hasLoadedRef = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Lazily load the welcome message the first time the workstation is opened.
  useEffect(() => {
    if (!active || hasLoadedRef.current) return
    hasLoadedRef.current = true

    if (!isWithinBusinessHours()) {
      setClosedForNight(true)
      return
    }

    const sendWelcomeMessage = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/cherry-blossom-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "WELCOME_MESSAGE", messages: [], context }),
        })
        const data = await response.json()
        if (data.message) {
          setMessages([{ role: "assistant", content: data.message }])
          if (PLANNING_CONTEXTS.has(context)) setShowPlanning(true)
        }
      } catch (error) {
        console.error("[v0] Workstation welcome error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    sendWelcomeMessage()
  }, [active, context])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [messages, isLoading, showPlanning])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowPlanning(false)

    try {
      const response = await fetch("/api/cherry-blossom-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      })
      const data = await response.json()
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
        rememberExchange(userMessage.content, data.message)
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error ? `Error: ${data.error}` : "Sorry, I couldn't process that." },
        ])
      }
    } catch (error) {
      console.error("[v0] Workstation chat error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, there was an error." }])
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Sends one of the universal planning choices. Choice is never removed —
   * members can pick a different level of support on any day.
   */
  const sendPlanningChoice = async (option: (typeof PLANNING_OPTIONS)[number]) => {
    if (isLoading) return
    setShowPlanning(false)

    const priorMessages = messages
    setMessages((prev) => [...prev, { role: "user", content: option.label }])
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message ?? (data.error ? `Error: ${data.error}` : "Sorry, I couldn't process that."),
        },
      ])
    } catch (error) {
      console.error("[v0] Workstation planning error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, there was an error." }])
    } finally {
      setIsLoading(false)
    }
  }

  if (closedForNight) {
    return (
      <div className="rounded-2xl border border-[#7FB069]/20 bg-white/70 p-5 text-center text-sm text-[#6B5860]">
        The Success Hub is resting for the night (11 PM – 7 AM ET). Cherry Blossom will be here to help you plan
        tomorrow. 🌙
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#7FB069]/25 bg-white/80 shadow-inner backdrop-blur-sm">
      {/* Workstation header */}
      <div className="flex items-center gap-3 border-b border-[#7FB069]/15 bg-gradient-to-r from-[#7FB069]/12 to-[#E26C73]/12 px-4 py-3">
        <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-sm">
          <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#3A2E33]">Plan with Cherry Blossom 🌸</p>
          <p className="text-xs text-[#6B5860]">Your Work-Life Balance planning workstation</p>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex max-h-[420px] min-h-[180px] flex-col gap-3 overflow-y-auto bg-gradient-to-b from-[#7FB069]/5 to-white p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
                message.role === "user"
                  ? "bg-gradient-to-r from-[#7FB069]/80 to-[#E26C73]/80 text-white"
                  : "border border-[#E26C73]/20 bg-white text-gray-900"
              }`}
            >
              {formatMessage(message.content)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-[#E26C73]/20 bg-white p-3 shadow-sm">
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
                  size="sm"
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
      </div>

      {/* Composer */}
      <div className="flex gap-2 border-t border-[#7FB069]/15 bg-white p-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Type your message..."
          className="min-h-[48px] flex-1 border-[#E26C73]/30 focus:border-[#7FB069]/50"
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-[#7FB069]/80 to-[#E26C73]/80 shadow-md hover:from-[#7FB069] hover:to-[#E26C73]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default CherryBlossomWorkstation
