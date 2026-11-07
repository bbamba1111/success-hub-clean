"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CherryBlossomGuidance } from "@/components/cherry-blossom/cherry-blossom-guidance"
import { CherryBlossomConversation } from "@/components/cherry-blossom/cherry-blossom-conversation"
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
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-3xl pt-12">
          <CherryBlossomGuidance
            greeting="Let&apos;s start with your Reality Check&trade;."
            primaryAction={{ label: "Begin Weekly Reality Check", href: "/audit" }}
          >
            <p>
              Before we can design your intention, I need to understand where your life feels balanced right now.
              Let&apos;s complete your Reality Check&trade; first, and then we&apos;ll craft this together.
            </p>
          </CherryBlossomGuidance>
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

  const focusAreaNames = selectedAreas.map((a) => a.name)
  const focusList =
    focusAreaNames.length <= 1
      ? focusAreaNames[0]
      : `${focusAreaNames.slice(0, -1).join(", ")} and ${focusAreaNames[focusAreaNames.length - 1]}`

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <div className="pt-10 text-center">
        <div className="flex justify-center">
          <img
            src="/images/logo.png"
            alt="Make Time For More Logo"
            width={72}
            height={72}
            className="rounded-full shadow-lg"
          />
        </div>
        <h1 className="mx-auto mt-6 max-w-2xl px-4 font-display text-4xl font-bold tracking-tight text-brand-ink text-balance">
          Your Weekly Operating Declaration&trade;
        </h1>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 p-4 pb-16 pt-8">
        {/* Cherry Blossom opens from context — no generic greeting. */}
        <CherryBlossomGuidance greeting={userName ? `Welcome back, ${userName}.` : "Welcome back."}>
          <p>I&apos;ve already reviewed your Reality Check&trade; and the Focus Areas&trade; you selected.</p>
          <p>
            Today we&apos;ll craft one simple intention that supports the areas you chose. Let&apos;s take this one step
            at a time.
          </p>
        </CherryBlossomGuidance>

        {/* Selected Focus Areas */}
        <Card className="rounded-2xl border-brand-blush bg-card shadow-ds">
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-semibold tracking-tight text-brand-ink">
                Your Focus Areas&trade;
              </h2>
              <Link href="/focus-areas">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-brand-coral/40 bg-transparent text-brand-coral-dark hover:bg-brand-blush/50"
                >
                  <Edit className="h-4 w-4" />
                  Change
                </Button>
              </Link>
            </div>

            {selectedAreas.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedAreas.map((area) => {
                  const IconComponent = area.icon
                  return (
                    <div key={area.id} className="rounded-xl border border-brand-blush bg-background p-4">
                      <div className="mb-2 flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-brand-coral" />
                        <h3 className="font-semibold text-brand-ink">{area.name}</h3>
                      </div>
                      <div className="inline-block rounded-full border border-brand-coral/30 bg-brand-coral/10 px-3 py-1 text-sm font-medium text-brand-coral-dark">
                        Current Score: {area.score}%
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Target className="mx-auto mb-4 h-16 w-16 text-brand-coral/40" />
                <h3 className="mb-4 text-xl font-semibold text-brand-ink">No Focus Areas selected yet</h3>
                <p className="mx-auto mb-6 max-w-md leading-relaxed text-brand-ink-soft">
                  Choose one to three focus areas and I&apos;ll build your intention around them.
                </p>
                <Link href="/focus-areas">
                  <Button className="bg-brand-green px-8 py-3 text-white hover:bg-brand-green-dark">
                    Select Focus Areas
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedAreas.length > 0 && (
          <>
            {/* Cherry Blossom leads into the conversation from context. */}
            <CherryBlossomGuidance greeting="Let&apos;s design your intention together.">
              <p>
                I&apos;ll guide you through the GIV&bull;EN&trade; framework using {focusList} &mdash; the focus areas I
                already have. There&apos;s nothing to copy or paste. Just talk with me below, and we&apos;ll shape a
                Weekly Intention&trade; that feels like yours.
              </p>
            </CherryBlossomGuidance>

            {/* Optional name personalization */}
            <div className="max-w-sm">
              <Label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-ink-soft">
                <User className="h-4 w-4" />
                Your first name (optional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={handleNameChange}
                className="w-full border-brand-blush focus:border-brand-green/50"
              />
            </div>

            {/* The page itself is the conversation — no popup window. */}
            <CherryBlossomConversation context="intention-setting" />

            {/* Lock in the Weekly Operating Declaration */}
            <Card className="rounded-2xl border-brand-green/40 bg-card shadow-ds">
              <CardContent className="p-6 sm:p-8">
                <h2 className="mb-2 font-display text-xl font-semibold tracking-tight text-brand-green-dark">
                  Lock In Your Weekly Intention&trade;
                </h2>
                <p className="mb-4 leading-relaxed text-brand-ink-soft">
                  When your intention feels right, capture it here in one sentence. I&apos;ll remember it and coach you
                  around it all week &mdash; and you can always refine it or generate a fresh one with me above.
                </p>
                <Textarea
                  value={declaration}
                  onChange={(e) => setDeclaration(e.target.value)}
                  placeholder="e.g. I protect my energy so I can lead with excellence."
                  className="mb-4 min-h-[90px] w-full border-brand-green/40 focus:border-brand-green"
                  aria-label="Your Weekly Intention declaration"
                />
                <Button
                  onClick={handleSaveDeclaration}
                  disabled={!declaration.trim() || savingDeclaration}
                  className="flex items-center gap-2 bg-brand-green px-6 py-2 text-white hover:bg-brand-green-dark"
                >
                  {declarationSaved ? <Check className="h-4 w-4" /> : null}
                  {savingDeclaration ? "Saving..." : declarationSaved ? "Saved!" : "Accept & Save My Intention"}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Navigation */}
        <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
          <Link href="/focus-areas">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-brand-coral/40 bg-card px-6 py-2 text-brand-coral-dark hover:bg-brand-blush/50"
            >
              Back to Focus Areas
            </Button>
          </Link>
          <Link href="/my-results">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-brand-green/40 bg-card px-6 py-2 text-brand-green-dark hover:bg-brand-green/10"
            >
              Back to My Results
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-black/10 bg-card px-6 py-2 text-brand-ink-soft hover:bg-black/5"
            >
              Enter the Success Hub
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
