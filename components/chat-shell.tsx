"use client"

import { useChat } from "ai/react"
import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from 'lucide-react'
import type { ExecutiveConfig } from "@/lib/executives-config"

interface ChatShellProps {
  executive: ExecutiveConfig
}

export default function ChatShell({ executive }: ChatShellProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chat/${executive.id}`,
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm ${executive.name}, your ${executive.role}. How can I help you today?`
      }
    ]
  })

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col">
      <CardHeader className={`border-b bg-gradient-to-br ${executive.color.replace('from-', 'from-').replace('to-', 'to-')}/10`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${executive.color} flex items-center justify-center text-2xl`}>
            {executive.icon}
          </div>
          <div>
            <CardTitle className="text-2xl">{executive.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{executive.role}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-[#E26C73] text-white"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-base whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
              placeholder={`Ask ${executive.name} anything...`}
              className="min-h-[60px] text-lg resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="lg"
              className="bg-[#E26C73] hover:bg-[#D55A60]"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
