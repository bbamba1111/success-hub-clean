"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from 'lucide-react'
import { useChat } from 'ai/react'

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
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const previousTitleRef = useRef<string>("")

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput } = useChat({
    api: '/api/chat/cherry-blossom',
    body: {
      conversationId,
      executiveRole
    },
    onFinish: async (message) => {
      // Save AI response to database
      if (conversationId) {
        await fetch(`/api/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'assistant',
            content: message.content
          })
        })
      }
    },
    onError: (error) => {
      console.error("Chat error:", error)
    }
  })

  // Initialize conversation when modal opens OR when conversation title changes
  useEffect(() => {
    const initConversation = async () => {
      // Check if we need a new conversation (modal opened OR title changed)
      const titleChanged = previousTitleRef.current !== conversationTitle
      const needsNewConversation = isOpen && (!conversationId || titleChanged) && !isInitializing

      if (needsNewConversation && isAuthenticated) {
        setIsInitializing(true)
        try {
          // Create new conversation
          const response = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              executive_role: executiveRole,
              title: conversationTitle
            })
          })

          if (response.ok) {
            const conversation = await response.json()
            setConversationId(conversation.id)
            previousTitleRef.current = conversationTitle

            // Load previous messages
            const messagesResponse = await fetch(`/api/conversations/${conversation.id}/messages`)
            if (messagesResponse.ok) {
              const previousMessages = await messagesResponse.json()
              if (previousMessages.length > 0) {
                setMessages(previousMessages.map((msg: any) => ({
                  id: msg.id,
                  role: msg.role,
                  content: msg.content
                })))
              }
            }
          }
        } catch (error) {
          console.error('Error initializing conversation:', error)
        } finally {
          setIsInitializing(false)
        }
      }
    }

    initConversation()
  }, [isOpen, conversationId, executiveRole, conversationTitle, setMessages, isInitializing, isAuthenticated])

  // Auto-submit prefill message
  useEffect(() => {
    if (isOpen && prefillMessage && messages.length === 0 && !isInitializing && conversationId) {
      setInput(prefillMessage)
      setTimeout(() => {
        const form = document.querySelector('form[data-chat-form]') as HTMLFormElement
        if (form) {
          form.requestSubmit()
        }
      }, 100)
    }
  }, [isOpen, prefillMessage, messages.length, setInput, isInitializing, conversationId])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setConversationId(null)
      setMessages([])
      previousTitleRef.current = ""
    }
  }, [isOpen, setMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Save user message to database before sending to AI
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!input.trim() || !conversationId) return

    // Save user message to database
    await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'user',
        content: input
      })
    })

    // Let useChat handle the AI request
    handleSubmit(e)
  }

  // Show login prompt if not authenticated
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
              onClick={() => window.location.href = '/api/auth/login'}
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
            {isInitializing && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#E26C73] mx-auto mb-4" />
                <p className="text-gray-600">Loading conversation...</p>
              </div>
            )}

            {!isInitializing && messages.length === 0 && (
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

        <form onSubmit={handleFormSubmit} data-chat-form className="flex gap-2 pt-4 border-t">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleFormSubmit(e as any)
              }
            }}
            placeholder="Type your message here..."
            className="min-h-[80px] text-lg"
            disabled={isLoading || isInitializing}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim() || isInitializing}
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
