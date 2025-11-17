"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from 'lucide-react'
import { useChat } from 'ai'

interface ExecutiveChatModalProps {
  isOpen: boolean
  onClose: () => void
  executiveId: string
  executiveName: string
  executiveRole: string
  executiveIcon: string
}

export function ExecutiveChatModal({
  isOpen,
  onClose,
  executiveId,
  executiveName,
  executiveRole,
  executiveIcon
}: ExecutiveChatModalProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: `/api/executive-chat/${executiveId}`,
    onError: (error) => {
      console.error("Chat error:", error)
    }
  })
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">{executiveIcon}</div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#E26C73] to-[#5D9D61] bg-clip-text text-transparent">
                {executiveName}
              </DialogTitle>
              <p className="text-sm text-gray-600">{executiveRole}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">{executiveIcon}</div>
                <p className="text-gray-600 text-lg">
                  Hello! I'm {executiveName}, your {executiveRole}. How can I help you today?
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#5D9D61] to-[#E26C73] text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-[#E26C73]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Type your message..."
            className="min-h-[80px] text-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="lg"
            className="bg-gradient-to-r from-[#5D9D61] to-[#E26C73] hover:from-[#4D8D51] hover:to-[#D25C63] text-white"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
