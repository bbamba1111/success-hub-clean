"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from 'lucide-react'
import { useChat } from 'ai/react'
import type { ExecutiveConfig } from "@/lib/executives-config"

interface ExecutiveChatModalProps {
  isOpen: boolean
  onClose: () => void
  executive: ExecutiveConfig
}

export function ExecutiveChatModal({
  isOpen,
  onClose,
  executive
}: ExecutiveChatModalProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chat/${executive.id}`,
    onError: (error) => {
      console.error(`[v0] ${executive.name} chat error:`, error)
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
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${executive.color} flex items-center justify-center text-2xl shadow-lg`}>
              {executive.icon}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#E26C73] to-[#7FB069] bg-clip-text text-transparent">
                {executive.name}
              </DialogTitle>
              <p className="text-sm text-gray-600">{executive.role}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${executive.color} flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl`}>
                  {executive.icon}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                  Hello! I'm {executive.name}, your {executive.role}. {executive.description}
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
                      ? "bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white"
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
            onChange={handleInputChange as any}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder={`Ask ${executive.name} anything...`}
            className="min-h-[80px] text-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input?.trim()}
            size="lg"
            className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white"
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
