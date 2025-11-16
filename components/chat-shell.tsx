'use client'

import { useChat } from 'ai/react'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { getExecutive } from '@/lib/executives-config'

interface ChatShellProps {
  executiveId: string
}

export function ChatShell({ executiveId }: ChatShellProps) {
  const executive = getExecutive(executiveId)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chat/${executiveId}`,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!executive) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Executive Not Found</h1>
          <p className="text-gray-600">The requested executive could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${executive.color} flex items-center justify-center text-2xl`}>
            {executive.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{executive.name}</h1>
            <p className="text-sm text-gray-600">{executive.role}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${executive.color} flex items-center justify-center text-4xl mx-auto mb-4`}>
                {executive.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to {executive.name}</h2>
              <p className="text-gray-600 mb-6">{executive.description}</p>
              <p className="text-sm text-gray-500">Start a conversation to get personalized guidance</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-emerald-400 to-pink-400 text-white'
                    : 'bg-white text-gray-900 shadow-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-white text-gray-900 shadow-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={`Ask ${executive.name} for guidance...`}
              className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-8 py-4 bg-gradient-to-br from-emerald-400 to-pink-400 text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
