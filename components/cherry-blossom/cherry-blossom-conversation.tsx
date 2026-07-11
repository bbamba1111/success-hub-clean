"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import type { JSX } from "react/jsx-runtime"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

/**
 * Cherry Blossom Conversation™ — the inline coaching surface.
 *
 * Phase 6.0: Cherry Blossom no longer lives inside a floating popup. The page
 * itself becomes the conversation. This embeds the same coaching engine
 * (/api/cherry-blossom-chat) directly into the page as a calm, editorial panel
 * — she opens from context, the founder responds, and the exchange continues
 * inline. All existing chat + Memory Vault™ architecture is reused unchanged.
 */

interface Message {
  role: "user" | "assistant"
  content: string
}

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

export function CherryBlossomConversation({
  context,
  avatarSrc = "/images/logo.png",
}: {
  /** Coaching context passed to the API (e.g. "intention-setting"). */
  context: string
  avatarSrc?: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const withinHours = isWithinBusinessHours()

  // Open the conversation from context as soon as the panel is available.
  useEffect(() => {
    if (!withinHours) return
    let cancelled = false

    const openConversation = async () => {
      setIsOpen(true)
      setIsLoading(true)
      try {
        const response = await fetch("/api/cherry-blossom-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "WELCOME_MESSAGE", messages: [], context }),
        })
        const data = await response.json()
        if (!cancelled && data.message) {
          setMessages([{ role: "assistant", content: data.message }])
        }
      } catch (error) {
        console.error("[v0] Conversation welcome error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    openConversation()
    return () => {
      cancelled = true
    }
  }, [context, withinHours])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    const priorMessages = messages
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/cherry-blossom-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          messages: priorMessages.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

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
      console.error("[v0] Conversation error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, there was an error." }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!withinHours) {
    return (
      <div className="rounded-2xl border border-brand-blush bg-card p-6 shadow-ds">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 overflow-hidden rounded-full border border-brand-blush shadow-sm">
            <img src={avatarSrc || "/placeholder.svg"} alt="Cherry Blossom" className="h-full w-full object-cover" />
          </span>
          <span className="ds-eyebrow text-brand-coral-dark">Cherry Blossom&trade;</span>
        </div>
        <p className="mt-4 font-serif italic leading-relaxed text-brand-ink-soft text-pretty">
          The Success Hub rests between 11 PM and 7 AM ET. When you return in the morning, I&apos;ll be right here to
          craft your Weekly Intention&trade; with you.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-blush bg-card shadow-ds">
      {/* Conversation header — Cherry Blossom is present, not in a window. */}
      <div className="flex items-center gap-3 border-b border-brand-blush bg-brand-blush/30 px-6 py-4">
        <span className="inline-flex h-10 w-10 overflow-hidden rounded-full border border-white shadow-sm">
          <img src={avatarSrc || "/placeholder.svg"} alt="Cherry Blossom" className="h-full w-full object-cover" />
        </span>
        <div>
          <p className="ds-eyebrow text-brand-coral-dark">Cherry Blossom&trade;</p>
          <p className="text-sm leading-relaxed text-brand-ink-soft">Crafting your Weekly Intention&trade; together</p>
        </div>
      </div>

      {/* Transcript */}
      <div className="max-h-[26rem] space-y-4 overflow-y-auto px-6 py-5">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                message.role === "user"
                  ? "bg-brand-green text-white"
                  : "border border-brand-blush bg-card text-brand-ink"
              }`}
            >
              {formatMessage(message.content)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-brand-blush bg-card p-3 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-brand-coral" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-brand-blush bg-card p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Share your thoughts with Cherry Blossom..."
            className="min-h-[60px] flex-1 border-brand-blush focus:border-brand-green/50"
            disabled={isLoading || !isOpen}
            aria-label="Your message to Cherry Blossom"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="self-end bg-brand-green text-white shadow-ds hover:bg-brand-green-dark"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CherryBlossomConversation
