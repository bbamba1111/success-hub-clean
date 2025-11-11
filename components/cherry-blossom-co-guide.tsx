"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Send,
  Copy,
  Sparkles,
  Brain,
  Target,
  BookOpen,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  Bot,
  Heart,
  Eye,
  DollarSign,
  Award,
  ExternalLink,
} from "lucide-react"
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
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])
  const [completions, setCompletions] = useState<any[]>([])
  const [streaks, setStreaks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"chat" | "today">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = supabaseUrl && supabaseAnonKey ? createBrowserClient(supabaseUrl, supabaseAnonKey) : null

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
    if (!userId || !supabase) return

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

      const today = new Date()
      const dayOfWeek = today.getDay()

      // Load calendar events for today
      const { data: events } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("day_of_week", dayOfWeek)
        .eq("is_active", true)
        .order("start_time")

      if (events) {
        setCalendarEvents(events)
      }

      // Load today's completions
      const todayDate = today.toISOString().split("T")[0]
      const { data: todayCompletions } = await supabase
        .from("activity_completions")
        .select("*")
        .eq("user_id", userId)
        .eq("completion_date", todayDate)

      if (todayCompletions) {
        setCompletions(todayCompletions)
      }

      // Load streaks
      const { data: streaksData } = await supabase.from("activity_streaks").select("*").eq("user_id", userId)

      if (streaksData) {
        setStreaks(streaksData)
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
      if (userId && supabase) {
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

  const handleCompleteActivity = async (eventId: string, activityType: string) => {
    if (!userId || !supabase) return

    const today = new Date().toISOString().split("T")[0]

    const { error } = await supabase.from("activity_completions").insert({
      user_id: userId,
      event_id: eventId,
      activity_type: activityType,
      completion_date: today,
    })

    if (!error) {
      await loadUserData()
    }
  }

  const isActivityCompleted = (eventId: string) => {
    return completions.some((c) => c.event_id === eventId)
  }

  const getCEOWorkdayBreakdown = () => {
    return [
      {
        pillar: "AI & Automation",
        icon: <Bot className="w-5 h-5 text-[#7FB069]" />,
        time: "1:00-2:00 PM",
        description: "Systemize, delegate to virtual team",
        color: "#7FB069",
        tasks: ["Train virtual team", "Set up automations", "Create SOPs"],
      },
      {
        pillar: "Zone of Genius",
        icon: <Heart className="w-5 h-5 text-[#E26C73]" />,
        time: "2:00-3:00 PM",
        description: "Your unique brilliance work",
        color: "#E26C73",
        tasks: ["High-value client work", "Creative thinking", "Strategic planning"],
      },
      {
        pillar: "Visibility & Growth",
        icon: <Eye className="w-5 h-5 text-[#7FB069]" />,
        time: "3:00-4:00 PM",
        description: "1-to-many marketing & reach",
        color: "#7FB069",
        tasks: ["Content creation", "Partnerships", "Public speaking practice"],
      },
      {
        pillar: "Revenue & Delivery",
        icon: <DollarSign className="w-5 h-5 text-[#E26C73]" />,
        time: "4:00-5:00 PM",
        description: "Money-making & service delivery",
        color: "#E26C73",
        tasks: ["Sales activities", "Client delivery", "Financial review"],
      },
    ]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[85vh] flex flex-col bg-white shadow-2xl">
        <CardHeader className="flex-shrink-0 bg-gradient-to-r from-[#E26C73]/20 to-[#7FB069]/20 border-b border-[#E26C73]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  src="/cherry-blossom-ai-logo.jpg"
                  alt="Cherry Blossom Co-Guide"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Cherry Blossom Co-Guide
                  <span className="text-[#E26C73]">🌸</span>
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-[#7FB069]/30 text-[#7FB069] border-[#7FB069]/20 text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    Work Interface
                  </Badge>
                  <Badge variant="secondary" className="bg-[#E26C73]/30 text-[#E26C73] border-[#E26C73]/20 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    1PM-5PM CEO Workday
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

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="chat">Chat & Strategy</TabsTrigger>
              <TabsTrigger value="today">Today's Workday</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          {activeTab === "chat" && (
            <div className="h-full flex">
              {/* Left Sidebar - Context Panel */}
              <div className="w-64 border-r border-gray-200 bg-gradient-to-b from-[#7FB069]/5 to-white p-4 overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#7FB069]" />
                  Your Context
                </h3>

                {streaks.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-[#E26C73]" />
                      Active Streaks
                    </h4>
                    <div className="space-y-2">
                      {streaks.slice(0, 3).map((streak) => (
                        <div
                          key={streak.activity_type}
                          className="bg-gradient-to-br from-[#7FB069]/10 to-[#E26C73]/10 p-2 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-700 capitalize">
                              {streak.activity_type.replace("-", " ")}
                            </span>
                            <div className="flex items-center gap-1">
                              <Award className="w-3 h-3 text-[#7FB069]" />
                              <span className="text-sm font-bold text-[#7FB069]">{streak.current_streak}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-3 h-3 text-[#E26C73]" />
                    Quick Actions
                  </h4>
                  <div className="space-y-2 text-xs">
                    <button className="w-full text-left px-3 py-2 bg-[#7FB069]/10 hover:bg-[#7FB069]/20 rounded-lg text-gray-700 transition-colors">
                      Plan CEO Workday
                    </button>
                    <button className="w-full text-left px-3 py-2 bg-[#E26C73]/10 hover:bg-[#E26C73]/20 rounded-lg text-gray-700 transition-colors">
                      Delegate to Virtual Team
                    </button>
                    <button className="w-full text-left px-3 py-2 bg-[#7FB069]/10 hover:bg-[#7FB069]/20 rounded-lg text-gray-700 transition-colors">
                      Learn Business Basics
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#7FB069]/5 to-white">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
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
                      placeholder="Ask about your 4-hour workday, delegate tasks, or get strategic guidance..."
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
                    Your strategic partner for the 4-hour CEO workday (1PM-5PM)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "today" && (
            <div className="h-full overflow-y-auto p-6 bg-gradient-to-b from-[#7FB069]/5 to-white">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Your 4-Hour CEO Workday</h3>
                  <p className="text-gray-600">1:00 PM - 5:00 PM • 4 Pillars of Business Building</p>
                </div>

                <div className="grid gap-4">
                  {getCEOWorkdayBreakdown().map((pillar, index) => (
                    <Card key={index} className="border-2 border-gray-200 hover:border-[#7FB069] transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                            style={{ backgroundColor: `${pillar.color}20` }}
                          >
                            {pillar.icon}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-bold text-gray-900">{pillar.pillar}</h4>
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {pillar.time}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{pillar.description}</p>

                            <div className="space-y-2">
                              <h5 className="text-xs font-semibold text-gray-700">Today's Focus:</h5>
                              {pillar.tasks.map((task, taskIndex) => (
                                <div key={taskIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle className="w-4 h-4 text-gray-400" />
                                  <span>{task}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {calendarEvents.length > 0 && (
                  <Card className="border-2 border-[#E26C73]/30">
                    <CardHeader>
                      <CardTitle className="text-[#E26C73] flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Today's Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {calendarEvents.map((event) => {
                        const completed = isActivityCompleted(event.id)
                        return (
                          <div
                            key={event.id}
                            className={`p-3 rounded-lg border-2 ${completed ? "border-[#7FB069] bg-[#7FB069]/5" : "border-gray-200"}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-semibold text-gray-900">{event.title}</h5>
                                  {completed && <CheckCircle className="w-4 h-4 text-[#7FB069]" />}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {event.start_time} - {event.end_time}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                {event.butter_link && (
                                  <a href={event.butter_link} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="bg-[#7FB069] hover:bg-[#6FA055] text-white">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Join
                                    </Button>
                                  </a>
                                )}

                                {!completed && !event.is_non_negotiable && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCompleteActivity(event.id, event.event_type)}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Done
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )}

                {streaks.length > 0 && (
                  <Card className="border-2 border-[#7FB069]/30 bg-gradient-to-br from-[#7FB069]/5 to-white">
                    <CardHeader>
                      <CardTitle className="text-[#7FB069] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Your Progress Streaks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {streaks.map((streak) => (
                          <div
                            key={streak.activity_type}
                            className="bg-white p-4 rounded-lg border border-[#7FB069]/20 text-center"
                          >
                            <div className="text-3xl font-bold text-[#7FB069] mb-1">{streak.current_streak}</div>
                            <div className="text-sm text-gray-700 capitalize mb-1">
                              {streak.activity_type.replace("-", " ")}
                            </div>
                            <div className="text-xs text-gray-500">Best: {streak.longest_streak} days</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
