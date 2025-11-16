"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from 'lucide-react'
import { useChat } from 'ai'

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
  isLoadingAuth = false
}: CherryBlossomChatModalProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/human-zone-chat',
    onError: (error) => {
      console.error("[v0] Chat error:", error)
    }
  })
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && prefillMessage && messages.length === 0) {
      setInput(prefillMessage)
      setTimeout(() => {
        const form = document.querySelector('form[data-chat-form]') as HTMLFormElement
        if (form) {
          form.requestSubmit()
        }
      }, 100)
    }
  }, [isOpen, prefillMessage, messages.length, setInput])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  if (!isAuthenticated && !isLoadingAuth) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#E26C73]">
              Sign In Required
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-lg text-gray-700 mb-6">
              Please sign in to start your coaching session with Cherry Blossom
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white"
            >
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#E26C73] to-[#7FB069] bg-clip-text text-transparent">
            {conversationTitle}
          </DialogTitle>
          <p className="text-sm text-gray-600">with Cherry Blossom, your {executiveRole}</p>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <img
                  src="/images/logo.png"
                  alt="Cherry Blossom"
                  className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg"
                />
                <p className="text-gray-600 text-lg">
                  Hello! I'm Cherry Blossom, your {executiveRole}. How can I support you today?
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

        <form onSubmit={handleSubmit} data-chat-form className="flex gap-2 pt-4 border-t">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Type your message here..."
            className="min-h-[80px] text-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
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
