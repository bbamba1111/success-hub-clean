"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Sparkles } from 'lucide-react'
import { useChat } from 'ai/react'

interface ZoneOfGeniusChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ZoneOfGeniusChatModal({
  isOpen,
  onClose
}: ZoneOfGeniusChatModalProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat/zone-of-genius',
    onError: (error) => {
      console.error("[v0] Zone of Genius chat error:", error)
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-amber-600">
                Zone of Genius Assessment
              </DialogTitle>
              <p className="text-sm text-gray-600">Discover your 2-3 core human-only skills</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                  I'll guide you through a comprehensive assessment to discover your unique Zone of Genius—the 2-3 core human-only skills from our 8 categories that you'll develop daily to build your 6, 7, 8 figure+ coaching or consulting business.
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
                      : "bg-amber-50 text-gray-900 border border-amber-200"
                  }`}
                >
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
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
            placeholder="Type your response here..."
            className="min-h-[80px] text-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input?.trim()}
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white"
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
