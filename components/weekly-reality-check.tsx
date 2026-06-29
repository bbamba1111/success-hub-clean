"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, ChevronDown } from "lucide-react"

type StepId = "audit" | "intention" | "environment"

const STORAGE_KEY = "weeklyRealityCheck"

// Returns the Monday (start) of the current week as a YYYY-MM-DD string.
// This is used as the weekly reset key — when the stored week differs from the
// current week's Monday, the experience automatically expands and resets.
function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday, 1 = Monday, ...
  const diff = (day + 6) % 7 // days since Monday
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function formatCompletedAt(iso: string): string {
  const d = new Date(iso)
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" })
  const month = d.toLocaleDateString("en-US", { month: "long" })
  const day = d.getDate()
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  return `${weekday}, ${month} ${day} • ${time}`
}

interface StoredState {
  weekKey: string
  steps: Record<StepId, boolean>
  completedAt: string | null
}

const EMPTY_STEPS: Record<StepId, boolean> = {
  audit: false,
  intention: false,
  environment: false,
}

export function WeeklyRealityCheck() {
  const [steps, setSteps] = useState<Record<StepId, boolean>>(EMPTY_STEPS)
  const [completedAt, setCompletedAt] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  // Load persisted state and apply weekly reset logic on mount.
  useEffect(() => {
    const currentWeek = getWeekKey()
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as StoredState
        if (parsed.weekKey === currentWeek) {
          setSteps({ ...EMPTY_STEPS, ...parsed.steps })
          setCompletedAt(parsed.completedAt)
          // Collapse if this week was already completed.
          setExpanded(!parsed.completedAt)
          setHydrated(true)
          return
        }
      }
    } catch {
      // ignore malformed storage
    }
    // New week (or first visit): reset and expand.
    const fresh: StoredState = { weekKey: currentWeek, steps: EMPTY_STEPS, completedAt: null }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    setSteps(EMPTY_STEPS)
    setCompletedAt(null)
    setExpanded(true)
    setHydrated(true)
  }, [])

  const persist = (next: Partial<StoredState>) => {
    const current: StoredState = {
      weekKey: getWeekKey(),
      steps,
      completedAt,
      ...next,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  }

  const toggleStep = (id: StepId) => {
    const nextSteps = { ...steps, [id]: !steps[id] }
    const allDone = nextSteps.audit && nextSteps.intention && nextSteps.environment
    const nextCompletedAt = allDone ? new Date().toISOString() : null
    setSteps(nextSteps)
    setCompletedAt(nextCompletedAt)
    persist({ steps: nextSteps, completedAt: nextCompletedAt })
    if (allDone) {
      // Smoothly collapse once all three steps are complete.
      setTimeout(() => setExpanded(false), 700)
    }
  }

  const reopen = () => setExpanded(true)

  const isComplete = Boolean(completedAt) && !expanded

  // Avoid hydration mismatch — render the expanded shell until client state loads.
  if (!hydrated) {
    return <div className="min-h-[400px] bg-gradient-to-br from-[#F5F1E8] to-white" aria-hidden />
  }

  return (
    <section className="w-full bg-gradient-to-br from-[#F5F1E8] to-white">
      <AnimatePresence mode="wait" initial={false}>
        {isComplete ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="rounded-2xl border border-[#7FB069]/30 bg-white shadow-md px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                {/* Status + title */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/images/logo.png"
                    alt="Make Time For More Logo"
                    width={44}
                    height={44}
                    className="rounded-full shadow-md flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#7FB069] truncate">
                        Weekly Work-Life Balance Reality Check™
                      </h2>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7FB069]">
                        <CheckCircle className="w-4 h-4" /> Complete
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      Your Official Entry Into The Work-Life Balance Business Week™
                    </p>
                    {completedAt && (
                      <p className="text-xs text-gray-500 mt-0.5">Completed: {formatCompletedAt(completedAt)}</p>
                    )}
                  </div>
                </div>

                {/* Checklist summary */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 lg:ml-auto">
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#7FB069]" /> Work-Life Balance Audit Completed
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#7FB069]" /> Weekly Intention Set
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#7FB069]" /> Operating Environment Prepared
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    onClick={reopen}
                    size="sm"
                    variant="outline"
                    className="border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069]/10 bg-transparent"
                  >
                    View Results
                  </Button>
                  <Button
                    onClick={reopen}
                    size="sm"
                    className="bg-[#E26C73] hover:bg-[#c95a61] text-white"
                  >
                    Update Weekly Intention
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative overflow-hidden"
          >
            {/* Wall-to-wall zen background */}
            <div className="absolute inset-0">
              <img
                src="/images/reality-check-zen-bg.png"
                alt="Cherry blossom zen garden with balanced stones and calm water"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="relative z-10 py-16 lg:py-20">
              {/* Full-width header on a blurred glass panel */}
              <div className="max-w-4xl mx-auto px-6">
                <div className="rounded-3xl border border-white/15 bg-black/20 p-8 backdrop-blur-md sm:p-10 text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <img
                      src="/images/logo.png"
                      alt="Make Time For More Logo"
                      width={72}
                      height={72}
                      className="rounded-full shadow-lg"
                    />
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs font-medium uppercase tracking-[0.3em]"
                    >
                      Weekly Ritual
                    </Badge>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 text-balance">
                    Take Your Weekly Work-Life Balance Reality Check™
                  </h2>
                  <p className="text-xl font-semibold text-[#FFD6E0] mb-8 text-pretty">
                    Your Official Entry Into The Work-Life Balance Business Week™
                  </p>

                  <div className="space-y-4 text-left max-w-3xl mx-auto">
                    <p className="text-lg text-white/90 leading-relaxed">
                      Every successful Work-Life Balance Business Week™ begins with reality—not reactivity.
                    </p>
                    <p className="text-lg text-white/90 leading-relaxed">
                      Before you begin Monday&apos;s live experience, complete your Weekly Work-Life Balance Reality
                      Check™.
                    </p>
                    <p className="text-lg text-white/90 leading-relaxed">
                      This simple three-step weekly ritual helps you understand your current reality, intentionally
                      design your week, and prepare your operating environment before your Work-Life Balance Business
                      Week™ begins.
                    </p>
                    <div className="rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-sm">
                      <p className="font-semibold text-white mb-2">Complete this experience:</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#FFD6E0] flex-shrink-0 mt-0.5" />
                          <span className="text-white/90">Immediately after joining (new members)</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#FFD6E0] flex-shrink-0 mt-0.5" />
                          <span className="text-white/90">
                            Then every Sunday evening or before each new Work-Life Balance Business Week™ begins.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three cards on a blurred glass screen */}
              <div className="max-w-6xl mx-auto px-6 mt-12">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                  {/* Step 1 - Audit */}
                  <Card className="bg-[#7FB069]/80 backdrop-blur-md border border-white/20 text-white overflow-hidden flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src="/images/logo.png"
                          alt="Make Time For More Logo"
                          width={48}
                          height={48}
                          className="rounded-full shadow-lg"
                        />
                        <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                          Step 1
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-white">Take Your Work-Life Balance Audit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col flex-1">
                      <p className="text-white/90 leading-relaxed">
                        Gain a clear picture of how you&apos;re currently living, working and leading.
                      </p>
                      <p className="text-white/90 leading-relaxed">
                        Assess your work-life balance, personal capacity, boundaries, recovery, Human Sustainability™,
                        and Time Freedom™ before redesigning your week.
                      </p>

                      <div className="mt-auto flex flex-col gap-3 pt-3">
                        <Link href="/audit" className="block">
                          <Button
                            size="lg"
                            className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold"
                          >
                            Take The Work-Life Balance Audit
                          </Button>
                        </Link>
                        <Button
                          onClick={() => toggleStep("audit")}
                          size="lg"
                          className={`w-full font-semibold ${
                            steps.audit
                              ? "bg-white text-[#7FB069] hover:bg-white/90"
                              : "bg-white/15 text-white hover:bg-white/25 border-2 border-white/40"
                          }`}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {steps.audit ? "Audit Completed" : "Mark Audit Complete"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 2 - Intention */}
                  <Card className="bg-[#E26C73]/80 backdrop-blur-md border border-white/20 text-white overflow-hidden flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src="/images/logo.png"
                          alt="Make Time For More Logo"
                          width={48}
                          height={48}
                          className="rounded-full shadow-lg"
                        />
                        <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                          Step 2
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-white">Set Your Intention for the Week™</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col flex-1">
                      <p className="text-white/90 leading-relaxed">
                        Transform your audit insights into a clear Weekly Work-LifeStyle™ Intention.
                      </p>
                      <p className="text-white/90 leading-relaxed">
                        With guidance from Cherry Blossom, identify your 1–3 highest priorities, define the boundaries
                        you&apos;ll protect, and intentionally design how you want to work and live this week.
                      </p>

                      <div className="mt-auto flex flex-col gap-3 pt-3">
                        <Link href="/focus-areas" className="block">
                          <Button
                            size="lg"
                            className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold"
                          >
                            Choose Your 1-3 Priority Focus Areas
                          </Button>
                        </Link>
                        <a
                          href="https://docs.google.com/document/d/1RtaoYOUQmmPSD2U5EaLPiilQifnSamE5Yo6SaOYf4UM/edit?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
                            <Download className="mr-2 h-4 w-4" />
                            Open The Intention Setting Guide
                          </Button>
                        </a>
                        <Button
                          onClick={() => toggleStep("intention")}
                          size="lg"
                          className={`w-full font-semibold ${
                            steps.intention
                              ? "bg-white text-[#E26C73] hover:bg-white/90"
                              : "bg-white/15 text-white hover:bg-white/25 border-2 border-white/40"
                          }`}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {steps.intention ? "Intention Set" : "Mark Intention Set"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 3 - Operating Environment */}
                  <Card className="bg-gradient-to-br from-[#7FB069]/80 to-[#E26C73]/80 backdrop-blur-md border border-white/20 text-white overflow-hidden flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src="/images/logo.png"
                          alt="Make Time For More Logo"
                          width={48}
                          height={48}
                          className="rounded-full shadow-lg"
                        />
                        <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                          Step 3
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-white">Prepare Your Operating Environment™</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col flex-1">
                      <p className="text-white/90 leading-relaxed">
                        Prepare the conditions that support a successful Work-Life Balance Business Week™.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                          <span className="text-white/90 text-sm">Protect your calendar</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                          <span className="text-white/90 text-sm">Prepare your workspace</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                          <span className="text-white/90 text-sm">Communicate your boundaries</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                          <span className="text-white/90 text-sm">
                            Create an environment that supports sustainable execution before Monday begins
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex flex-col gap-3 pt-3">
                        <a
                          href="https://docs.google.com/document/d/1IZ5qefGnMQpYJP8wMgQS3tVY6sj56CHcCpRBkOGpGjU/edit?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
                            <Download className="mr-2 h-4 w-4" />
                            Open The Preparation Checklist
                          </Button>
                        </a>
                        <Button
                          onClick={() => toggleStep("environment")}
                          size="lg"
                          className={`w-full font-semibold ${
                            steps.environment
                              ? "bg-white text-[#E26C73] hover:bg-white/90"
                              : "bg-white/15 text-white hover:bg-white/25 border-2 border-white/40"
                          }`}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {steps.environment ? "Environment Prepared" : "Mark Environment Prepared"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  </div>
                </div>

                {completedAt && (
                  <div className="text-center mt-10">
                    <Button
                      onClick={() => setExpanded(false)}
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Collapse Reality Check
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
