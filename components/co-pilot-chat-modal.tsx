"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Sparkles } from 'lucide-react'
import { useChat } from 'ai/react'

interface CoPilotChatModalProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated?: boolean
  isLoadingAuth?: boolean
}

export function CoPilotChatModal({
  isOpen,
  onClose,
  isAuthenticated = true,
  isLoadingAuth = false
}: CoPilotChatModalProps) {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat/co-pilot',
    body: {
      conversationId
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
      console.error("Co-Pilot chat error:", error)
    }
  })

  // Initialize conversation when modal opens
  useEffect(() => {
    const initConversation = async () => {
      if (isOpen && !conversationId && !isInitializing && isAuthenticated) {
        setIsInitializing(true)
        try {
          // Create new conversation
          const response = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              executive_role: 'Co-Pilot Master Coach',
              title: 'Co-Pilot: Master Strategy Session'
            })
          })

          if (response.ok) {
            const conversation = await response.json()
            setConversationId(conversation.id)

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
          console.error('Error initializing Co-Pilot conversation:', error)
        } finally {
          setIsInitializing(false)
        }
      }
    }

    initConversation()
  }, [isOpen, conversationId, setMessages, isInitializing, isAuthenticated])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setConversationId(null)
      setMessages([])
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
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#E26C73] to-[#5D9D61] bg-clip-text text-transparent">
              Sign In Required
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-[#E26C73]" />
            <p className="text-lg text-gray-700 mb-6">
              Please sign in to access your Co-Pilot Master Coach
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/auth/login'}
              className="bg-gradient-to-r from-[#5D9D61] to-[#E26C73] hover:from-[#4D8D51] hover:to-[#D25C63] text-white"
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
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-10 w-10 text-[#E26C73]" />
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#E26C73] to-[#5D9D61] bg-clip-text text-transparent">
                Co-Pilot Master Coach
              </DialogTitle>
              <p className="text-sm text-gray-600">Synthesizing insights from all 25 AI executives</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {isInitializing && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#E26C73] mx-auto mb-4" />
                <p className="text-gray-600">Initializing Co-Pilot...</p>
              </div>
            )}

            {!isInitializing && messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-[#E26C73]" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to Your Co-Pilot!</h3>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  I'm your master AI coach with complete access to all your conversations across all 25 executives. 
                  I synthesize insights, identify patterns, and provide strategic guidance based on everything you've discussed.
                </p>
                <div className="mt-6 p-4 bg-gradient-to-r from-[#F9EFE3] to-[#E8F5E9] rounded-lg max-w-xl mx-auto">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Pro Tip:</strong> Ask me to summarize your progress, identify priorities, or connect dots across different areas of your business!
                  </p>
                </div>
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

        <form onSubmit={handleFormSubmit} className="flex gap-2 pt-4 border-t">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleFormSubmit(e as any)
              }
            }}
            placeholder="Ask me anything about your business strategy..."
            className="min-h-[80px] text-lg"
            disabled={isLoading || isInitializing}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim() || isInitializing}
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
