"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SimpleChatModal from "@/components/simple-chat-modal"
import {
  Target,
  Heart,
  Brain,
  Dumbbell,
  Apple,
  Moon,
  Smile,
  User,
  BookOpen,
  Briefcase,
  DollarSign,
  TreePine,
  Users,
  Gamepad2,
  Users2,
  Gift,
  Edit,
  Check,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { getAuditResults } from "@/utils/audit-storage"
import { updateRealityCheck } from "@/utils/reality-check-storage"

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
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Weekly Operating Declaration capture (persists to reality_checks).
  const [declaration, setDeclaration] = useState("")
  const [savingDeclaration, setSavingDeclaration] = useState(false)
  const [declarationSaved, setDeclarationSaved] = useState(false)

  useEffect(() => {
    const data = getAuditResults()
    if (data) setAuditData(data)

    const savedName = localStorage.getItem("userName")
    if (savedName) setUserName(savedName)

    const focusAreas = localStorage.getItem("focusAreas")
    if (focusAreas) {
      try {
        setSelectedFocusAreas(JSON.parse(focusAreas))
      } catch (error) {
        console.error("Error parsing focus areas:", error)
      }
    }

    const savedDeclaration = localStorage.getItem("weeklyOperatingDeclaration")
    if (savedDeclaration) setDeclaration(savedDeclaration)
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setUserName(name)
    localStorage.setItem("userName", name)
  }

  const handleSaveDeclaration = async () => {
    const trimmed = declaration.trim()
    if (!trimmed) return
    setSavingDeclaration(true)
    // Instant local persistence (source of truth for UX)
    localStorage.setItem("weeklyOperatingDeclaration", trimmed)
    // Mirror to this week's Reality Check record so Cherry Blossom remembers it
    await updateRealityCheck({ operatingDeclaration: trimmed })
    setSavingDeclaration(false)
    setDeclarationSaved(true)
    setTimeout(() => setDeclarationSaved(false), 2500)
  }

  if (!auditData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Reality Check Found</h1>
            <p className="text-gray-600 mb-8">
              Please complete your Weekly Reality Check first to set your intentions.
            </p>
            <Link href="/audit">
              <Button className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white">
                Begin Weekly Reality Check
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const selectedAreas = selectedFocusAreas.map((areaId) => {
    const result = auditData.results.find((r) => r.category === areaId)
    return {
      id: areaId,
      name: categoryLabels[areaId as keyof typeof categoryLabels],
      score: result?.percentage || 0,
      icon: categoryIcons[areaId as keyof typeof categoryIcons],
    }
  })

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

      {/* Pink Header Section */}
      <div className="bg-[#E26C73] text-white text-center py-9 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Your Weekly Operating Declaration</h1>
          <p className="text-xl opacity-90">
            Cherry Blossom already knows your Reality Check scores and focus areas. Set your intention together, then
            lock it in — she&apos;ll coach you around it all week.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 -mt-8">
        {/* Focus Areas Section */}
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
            <p className="text-gray-700 mb-6">These are the areas you&apos;ll be working on with Cherry Blossom</p>

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
                  Please go back and select 1-3 focus areas to create your personalized transformation plan.
                </p>
                <Link href="/focus-areas">
                  <Button className="bg-[#E26C73] hover:bg-[#D55A60] text-white px-8 py-3">Select Focus Areas</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedAreas.length > 0 && (
          <>
            {/* Craft with Cherry Blossom */}
            <Card className="bg-white rounded-2xl mb-8">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/images/logo.png"
                    alt="Make Time For More Logo"
                    width={48}
                    height={48}
                    className="rounded-full shadow-lg"
                  />
                  <h2 className="text-2xl font-bold text-[#E26C73]">Craft Your Intention with Cherry Blossom</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Open the conversation and Cherry Blossom will guide you through the GIVEN framework using the focus
                  areas and scores she already has — no copying or pasting.
                </p>

                {/* Optional name personalization */}
                <div className="mb-6">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Your first name (optional)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={handleNameChange}
                    className="w-full max-w-sm"
                  />
                </div>

                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Set Your Intention with Cherry Blossom
                </Button>
              </CardContent>
            </Card>

            {/* Lock in the Weekly Operating Declaration */}
            <Card className="bg-white rounded-2xl mb-8 border-[#7FB069]/40">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#7FB069] mb-2">Lock In Your Weekly Intention Declaration</h2>
                <p className="text-gray-600 mb-4">
                  Once you and Cherry Blossom have crafted your one-sentence Weekly Intention Declaration, save it here.
                  She&apos;ll remember it and coach you around it throughout your Work-Life Balance Business Week.
                </p>
                <Textarea
                  value={declaration}
                  onChange={(e) => setDeclaration(e.target.value)}
                  placeholder="e.g. I protect my energy so I can lead with excellence."
                  className="w-full min-h-[90px] border-[#7FB069]/40 focus:border-[#7FB069] mb-4"
                />
                <Button
                  onClick={handleSaveDeclaration}
                  disabled={!declaration.trim() || savingDeclaration}
                  className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-6 py-2 flex items-center gap-2"
                >
                  {declarationSaved ? <Check className="w-4 h-4" /> : null}
                  {savingDeclaration ? "Saving..." : declarationSaved ? "Saved!" : "Save My Weekly Intention"}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Navigation */}
        <div className="mt-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/focus-areas">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-[#E26C73] text-[#E26C73] hover:bg-[#E26C73] hover:text-white bg-white px-6 py-2"
              >
                Back to Focus Areas
              </Button>
            </Link>
            <Link href="/my-results">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white bg-white px-6 py-2"
              >
                Back to My Results
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-gray-800 bg-white px-6 py-2"
              >
                Enter the Success Hub
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <SimpleChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context="intention-setting"
        title="Set Your Weekly Intention"
      />
    </div>
  )
}
