"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Send, Copy, Sparkles, Brain, Target, Users, BookOpen } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface CoGuideProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
}

export function CherryBlossomCoGuide({ isOpen, onClose, userId }: CoGuideProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load user data and assessment when chat opens
  useEffect(() => {
    if (isOpen && userId) {
      loadUserData()
    }
  }, [isOpen, userId])

  const loadUserData = async () => {
    if (!userId) return

    try {
      // Get user profile
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      // Get latest assessment
      const { data: assessment } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setUserProfile(profile)
      setAssessmentData(assessment)

      // Add welcome message with personalization
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `🌸 Hello${profile?.name ? ` ${profile.name}` : ""}! I'm your Cherry Blossom Co-Guide - your AI-powered strategic partner, business educator, and virtual team manager.

I'm here to help you:
✨ Build your AI-First business while working just 4 hours/day
📚 Learn business concepts at YOUR comprehension level
👥 Manage your virtual executive team (COO, CFO, CMO, etc.)
🎯 Stay in your zone of genius while AI handles everything else
🌸 Live the Make Time For More™ model every day
📊 Track your growth in both business AND life

I know your values, goals, and dreams from your assessment. I'm trained on the Work-Life Balance Business Model & SOP, and I'll help you install it layer by layer.

What would you like to work on today?`,
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/co-guide-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          userProfile,
          assessmentData,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Save to chat history
      if (userId) {
        await supabase.from("chat_history").insert({
          user_id: userId,
          role: "user",
          message: userMessage.content,
          chat_context: "co-guide",
          context_data: { userProfile, assessmentData },
        })

        await supabase.from("chat_history").insert({
          user_id: userId,
          role: "assistant",
          message: assistantMessage.content,
          chat_context: "co-guide",
          context_data: { userProfile, assessmentData },
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[85vh] flex flex-col bg-white shadow-2xl">
        <CardHeader className="flex-shrink-0 bg-gradient-to-r from-[#E26C73]/20 to-[#7FB069]/20 border-b border-[#E26C73]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src="/images/logo.png" alt="Cherry Blossom Co-Guide" className="w-full h-full object-cover" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Cherry Blossom Co-Guide
                  <span className="text-[#E26C73]">🌸</span>
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-[#7FB069]/30 text-[#7FB069] border-[#7FB069]/20 text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    Adaptive Learning
                  </Badge>
                  <Badge variant="secondary" className="bg-[#E26C73]/30 text-[#E26C73] border-[#E26C73]/20 text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Virtual Team Manager
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-gray-600 bg-white/50 hover:bg-white border-[#E26C73]/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full flex">
            {/* Left Sidebar - Context Panel */}
            <div className="w-64 border-r border-gray-200 bg-gradient-to-b from-[#7FB069]/5 to-white p-4 overflow-y-auto">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#7FB069]" />
                Your Context
              </h3>

              {assessmentData && (
                <div className="space-y-3 text-xs">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-[#7FB069]/20">
                    <div className="font-semibold text-gray-900 mb-1">Business Status</div>
                    <div className="text-gray-600">{assessmentData.entrepreneurial_status}</div>
                  </div>

                  {assessmentData.revenue_target && (
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-[#E26C73]/20">
                      <div className="font-semibold text-gray-900 mb-1">Revenue Goal</div>
                      <div className="text-gray-600">{assessmentData.revenue_target}</div>
                    </div>
                  )}

                  {assessmentData.zone_of_genius && (
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-[#7FB069]/20">
                      <div className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#7FB069]" />
                        Zone of Genius
                      </div>
                      <div className="text-gray-600">{assessmentData.zone_of_genius}</div>
                    </div>
                  )}

                  {userProfile?.current_cycle && (
                    <div className="bg-gradient-to-br from-[#7FB069]/10 to-[#E26C73]/10 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900 mb-1">Current Cycle</div>
                      <div className="text-gray-600">Cycle {userProfile.current_cycle}</div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-3 h-3 text-[#E26C73]" />
                  Quick Actions
                </h4>
                <div className="space-y-2 text-xs">
                  <button className="w-full text-left px-3 py-2 bg-[#7FB069]/10 hover:bg-[#7FB069]/20 rounded-lg text-gray-700 transition-colors">
                    Set Up Virtual Team
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-[#E26C73]/10 hover:bg-[#E26C73]/20 rounded-lg text-gray-700 transition-colors">
                    Plan CEO Workday
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-[#7FB069]/10 hover:bg-[#7FB069]/20 rounded-lg text-gray-700 transition-colors">
                    Learn Business Basics
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-[#E26C73]/10 hover:bg-[#E26C73]/20 rounded-lg text-gray-700 transition-colors">
                    Track Progress
                  </button>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#7FB069]/5 to-white">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-[#7FB069]/80 to-[#E26C73]/80 text-white"
                          : "bg-white border border-[#E26C73]/20 text-gray-900"
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className={`text-xs ${message.role === "user" ? "text-white/70" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessage(message.content)}
                          className={`h-6 w-6 p-0 ${
                            message.role === "user"
                              ? "text-white/70 hover:text-white"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#E26C73]/20 rounded-lg p-4 max-w-[80%] shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#E26C73]/60 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-[#7FB069]/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#E26C73]/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex-shrink-0 border-t border-[#E26C73]/20 p-4 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your business, AI automation, or work-life balance..."
                    disabled={isLoading}
                    className="flex-1 border-[#E26C73]/30 focus:border-[#7FB069]/50"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-[#7FB069]/80 to-[#E26C73]/80 hover:from-[#7FB069] hover:to-[#E26C73] text-white shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  I adapt my language to your comprehension level and teach you business as we build together
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
