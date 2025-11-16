"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, Heart, Brain, Dumbbell, Apple, Moon, Smile, User, BookOpen, Briefcase, DollarSign, TreePine, Users, Gamepad2, Users2, Gift, Copy, Edit } from 'lucide-react'
import Link from "next/link"
import { getAuditResults } from "@/utils/audit-storage"

interface AuditResult {
  category: string
  percentage: number
  label: string
}

interface AuditData {
  overallScore: number
  results: AuditResult[]
  timestamp: number
}

const categoryLabels = {
  spiritual: "Spiritual Well-being",
  mental: "Mental Health",
  physicalMovement: "Physical Movement",
  physicalNourishment: "Physical Nourishment",
  physicalSleep: "Physical Sleep",
  emotional: "Emotional Health",
  personal: "Personal Growth",
  intellectual: "Intellectual Development",
  professional: "Professional Life",
  financial: "Financial Health",
  environmental: "Environmental Wellness",
  relational: "Relationships",
  social: "Social Connections",
  recreational: "Recreation & Fun",
  charitable: "Charitable Giving",
}

const categoryIcons = {
  spiritual: Heart,
  mental: Brain,
  physicalMovement: Dumbbell,
  physicalNourishment: Apple,
  physicalSleep: Moon,
  emotional: Smile,
  personal: User,
  intellectual: BookOpen,
  professional: Briefcase,
  financial: DollarSign,
  environmental: TreePine,
  relational: Users2,
  social: Users,
  recreational: Gamepad2,
  charitable: Gift,
}

export default function CherryBlossomIntentions() {
  const [auditData, setAuditData] = useState<AuditData | null>(null)
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([])
  const [userName, setUserName] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Load audit data
    const data = getAuditResults()
    if (data) {
      setAuditData(data)
    }

    // Load user name from localStorage
    const savedName = localStorage.getItem("userName")
    if (savedName) {
      setUserName(savedName)
    }

    // Load selected focus areas from localStorage
    const focusAreas = localStorage.getItem("focusAreas")
    if (focusAreas) {
      try {
        const parsedAreas = JSON.parse(focusAreas)
        setSelectedFocusAreas(parsedAreas)
      } catch (error) {
        console.error("Error parsing focus areas:", error)
      }
    }
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setUserName(name)
    localStorage.setItem("userName", name)
  }

  if (!auditData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Audit Results Found</h1>
            <p className="text-gray-600 mb-8">
              Please complete your work-life balance audit first to set your intentions.
            </p>
            <Link href="/audit">
              <Button className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white">
                Take Audit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Get selected focus area details
  const selectedAreas = selectedFocusAreas.map((areaId) => {
    const result = auditData.results.find((r) => r.category === areaId)
    return {
      id: areaId,
      name: categoryLabels[areaId as keyof typeof categoryLabels],
      score: result?.percentage || 0,
      icon: categoryIcons[areaId as keyof typeof categoryIcons],
    }
  })

  const generateIntentionPrompt = () => {
    const nameText = userName ? `Name: ${userName}` : "Name: Not provided"
    const focusAreasText = selectedAreas.map((area, index) => `${index + 1}. ${area.name}`).join("\n")

    return `Hello Cherry Blossom! I just completed my Work-Life Balance Audit and I'm ready to set powerful 28-day intentions for transformation.

${nameText}
Overall Score: ${auditData.overallScore}%

My ${selectedAreas.length} selected focus areas that I want to focus on:
${focusAreasText}

I'm ready to begin the 6-Step Intention Setting Process! Please guide me step-by-step through:

Step 1: Begin with Gratitude
Step 2: Set my 1st Intention (from my low-scoring areas)
Step 3: Set my 2nd Intention (from my low-scoring areas)
Step 4: Set my 3rd Intention (from my low-scoring areas)
Step 5: Envision the Collective Good (my ripple effect)
Step 6: Combine & Align with Divine Will

Let's create my sacred 28-Day Desired Work-Lifestyle Intention together!`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateIntentionPrompt())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const selectAllText = () => {
    const textArea = document.getElementById("intention-prompt") as HTMLTextAreaElement
    if (textArea) {
      textArea.select()
      textArea.setSelectionRange(0, 99999)
    }
  }

  const openIntentionChat = () => {
    alert("Intention setting chat coming soon!")
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Header with Logo */}
      <div className="text-center mb-8 pt-8">
        <div className="flex justify-center mb-6">
          <img
            src="/images/logo.png"
            alt="Make Time For More Logo"
            width={80}
            height={80}
            className="rounded-full shadow-lg"
          />
        </div>
      </div>

      {/* Pink Header Section - Reduced height by 25% */}
      <div className="bg-[#E26C73] text-white text-center py-9 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h1 className="text-4xl font-bold">Set Your 28-Day Intentions with Cherry Blossom</h1>
          </div>
          <p className="text-xl mb-6 opacity-90">
            Transform your audit insights into powerful, actionable 28-day intentions. Get AI-guided intention crafting
            and personalized daily practices for your transformation journey.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 -mt-8">
        {/* Focus Areas Section - Brand pink and green gradient */}
        <Card className="mb-8 bg-gradient-to-r from-[#E26C73]/20 to-[#7FB069]/20 border-[#E26C73]/30 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-[#E26C73]">Your Selected Focus Areas</h2>
              <Link href="/focus-areas">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-[#E26C73] text-[#E26C73] hover:bg-[#E26C73] hover:text-white bg-transparent"
                >
                  <Edit className="w-4 h-4" />
                  Change Focus Areas
                </Button>
              </Link>
            </div>
            <p className="text-gray-700 mb-6">These are the areas you'll be working on with Cherry Blossom AI</p>

            {selectedAreas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedAreas.map((area) => {
                  const IconComponent = area.icon
                  return (
                    <div key={area.id} className="bg-white rounded-lg p-4 border border-[#E26C73]/20">
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="w-5 h-5 text-[#E26C73]" />
                        <h3 className="font-semibold text-gray-900">{area.name}</h3>
                      </div>
                      <div className="inline-block bg-[#E26C73]/10 text-[#E26C73] px-3 py-1 rounded-full text-sm font-medium border border-[#E26C73]/30">
                        Current Score: {area.score}%
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-16 h-16 text-[#E26C73]/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">No Focus Areas Selected</h3>
                <p className="text-gray-600 mb-6">
                  Please go back and select 1-3 focus areas to create your personalized 28-day transformation plan.
                </p>
                <Link href="/focus-areas">
                  <Button className="bg-[#E26C73] hover:bg-[#D55A60] text-white px-8 py-3">Select Focus Areas</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Card */}
        {selectedAreas.length > 0 && (
          <Card className="bg-white rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={48}
                  height={48}
                  className="rounded-full shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-[#E26C73]">Set Your 28-Day Intentions with Cherry Blossom</h2>
                </div>
              </div>
              <p className="text-gray-600 mb-8">
                Transform your audit insights into powerful, actionable 28-day intentions. Get AI-guided intention
                crafting and personalized daily practices for your transformation journey.
              </p>

              {/* Name Input */}
              <div className="mb-6">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Enter your full name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={userName}
                  onChange={handleNameChange}
                  className="w-full"
                />
              </div>

              {/* Steps List - Black numbers */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white border-2 border-gray-300 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-gray-700">
                    <strong>Copy your intention prompt</strong> using the button below
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white border-2 border-gray-300 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-gray-700">Click "Set Your Intentions" to open Cherry Blossom</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white border-2 border-gray-300 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-gray-700">Paste your prompt and get guided intention setting</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white border-2 border-gray-300 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p className="text-gray-700">Create your personalized 28-day transformation plan</p>
                </div>
              </div>

              {/* Intention Prompt Section */}
              <div className="border border-[#E26C73]/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-[#E26C73]">Your Intention Prompt for Cherry Blossom:</h4>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#E26C73] to-[#7FB069] text-white hover:from-[#D55A60] hover:to-[#6FA055] border-0"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>

                <div className="relative">
                  <textarea
                    id="intention-prompt"
                    value={generateIntentionPrompt()}
                    readOnly
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm resize-none"
                    onClick={selectAllText}
                  />
                  <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    Click to select all
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prepare for the Experience Checklist homework section */}
        {selectedAreas.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 border-[#7FB069]/30 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={48}
                  height={48}
                  className="rounded-full shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-[#7FB069]">Homework: Prepare for Your Experience</h2>
                  <p className="text-gray-600">Get ready for your Sunday Shift and Monday co-working session</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Before You Start Your 28-Day Transformation
                </h3>
                <p className="text-gray-700 mb-6">
                  This is your sacred prep time. Complete this checklist to clear space, time, and energy before your
                  cycle begins.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-[#7FB069] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Clear Physical Space 🧹</h4>
                      <p className="text-sm text-gray-600">Organize your workspace and living areas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-[#7FB069] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Block Calendar 📅</h4>
                      <p className="text-sm text-gray-600">
                        Schedule your 6 Non-Negotiable activities for the next 28 days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-[#7FB069] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Notify Family/Team 💬</h4>
                      <p className="text-sm text-gray-600">
                        Communicate your new schedule and boundaries to those around you
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-[#7FB069] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Delegate or Delay 🔁</h4>
                      <p className="text-sm text-gray-600">
                        Identify tasks to delegate or postpone during your transformation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-[#7FB069] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Prepare Your Spirit 🧘🏾‍♀️</h4>
                      <p className="text-sm text-gray-600">Set your mental and spiritual intention for this journey</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-[#7FB069] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Environment Refresh 🏡</h4>
                      <p className="text-sm text-gray-600">Optional: Plan a stay-cation or refresh your environment</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#7FB069]/10 rounded-lg border border-[#7FB069]/30">
                  <h4 className="font-semibold text-[#7FB069] mb-2">Choose Your Start Type:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-[#7FB069]">•</span>
                      <span>
                        <strong>Monday Only:</strong> Start with just the co-working schedule
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#7FB069]">•</span>
                      <span>
                        <strong>7-Day Reset:</strong> Full week immersion
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#7FB069]">•</span>
                      <span>
                        <strong>14-Day Momentum:</strong> Two weeks to build habits
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#7FB069]">•</span>
                      <span>
                        <strong>21-Day Habit Cycle:</strong> Full habit formation period
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-[#E26C73]/10 rounded-lg border border-[#E26C73]/30">
                  <p className="text-sm text-gray-700 italic mb-2">
                    <strong>Affirmation:</strong> "I make room for what I desire."
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    <strong>Quote:</strong> "Let yourself be silently drawn by the strange pull of what you really
                    love." — Rumi
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-700 mb-4">
                  Complete this checklist before your Sunday Shift to ensure you're fully prepared to start co-working
                  on Monday!
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white px-8 py-3">
                    Return to Success Hub
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Navigation */}
        {selectedAreas.length > 0 && (
          <div className="mt-8 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/focus-areas">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-[#E26C73] text-[#E26C73] hover:bg-[#E26C73] hover:text-white bg-white px-6 py-2"
                >
                  ← Back to Focus Areas
                </Button>
              </Link>
              <Link href="/my-results">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white bg-white px-6 py-2"
                >
                  ← Back to My Results
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-gray-800 bg-white px-6 py-2"
                >
                  ← Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Action Button */}
        {selectedAreas.length > 0 && (
          <div className="mt-8 mb-8">
            <Button
              onClick={openIntentionChat}
              className="w-full bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={24}
                height={24}
                className="rounded-full shadow-lg mr-3"
              />
              Set Your 28-Day Intentions
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
