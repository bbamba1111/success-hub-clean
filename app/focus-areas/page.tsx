"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR, { mutate as globalMutate } from "swr"
import Link from "next/link"
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { updateRealityCheck } from "@/utils/reality-check-storage"
import { loadWeeklyAudit, setWeeklyPriorities } from "@/lib/boundary-report/weekly-actions"
import { CURRENT_PRIORITY_FOCUS_KEY } from "@/lib/boundary-report/use-current-priority-focus"
import { MAX_WEEKLY_PRIORITIES } from "@/lib/boundary-report/weekly-types"
import { formatAuditDate } from "@/components/weekly-audit/weekly-results"

const DECIDE_DESIGN_HREF = "/#priority-focus-areas"

const AREA_DESCRIPTIONS: Record<string, string> = {
  spiritual: "Enhance spiritual connection and mental health",
  mental: "Improve focus, clarity, decision making and mental wellness",
  physicalMovement: "Increase physical activity and exercise",
  physicalNourishment: "Improve nutrition and healthy eating habits",
  physicalSleep: "Develop better sleep habits and routines",
  emotional: "Develop emotional awareness and balance",
  personal: "Focus on personal interests and self-development",
  intellectual: "Engage in learning and intellectual growth",
  professional: "Improve work boundaries and satisfaction",
  financial: "Enhance financial security and planning",
  environmental: "Create a more supportive living and working environment",
  relational: "Strengthen family and close relationships",
  social: "Build and maintain social connections",
  recreational: "Increase fun and recreational activities",
  charitable: "Expand charitable giving and community involvement",
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-[#5B835F]"
  if (score >= 60) return "text-yellow-600"
  if (score >= 40) return "text-orange-600"
  return "text-red-600"
}

function getProgressColor(score: number) {
  if (score >= 80) return "bg-[#7FB069]"
  if (score >= 60) return "bg-gradient-to-r from-[#E26C73] to-[#7FB069]"
  if (score >= 40) return "bg-[#E26C73]"
  return "bg-red-500"
}

export default function FocusAreasPage() {
  const router = useRouter()
  const { data, isLoading } = useSWR("focus-areas-weekly-audit", () => loadWeeklyAudit(), {
    revalidateOnFocus: false,
  })
  const latest = data?.latest ?? null
  const areas = latest?.report.areas ?? []

  const [selected, setSelected] = useState<string[]>([])
  const [initializedFor, setInitializedFor] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill with this week's saved choice so members can revise it.
  useEffect(() => {
    if (latest && initializedFor !== latest.id) {
      setSelected((latest.report.priorityAreas ?? []).map((a) => a.key))
      setInitializedFor(latest.id)
    }
  }, [latest, initializedFor])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const atLimit = selected.length >= MAX_WEEKLY_PRIORITIES

  const toggle = (key: string) => {
    setError(null)
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key)
      if (prev.length >= MAX_WEEKLY_PRIORITIES) return prev
      return [...prev, key]
    })
  }

  const confirm = async () => {
    if (!latest || selected.length < 1 || selected.length > MAX_WEEKLY_PRIORITIES) return
    setSaving(true)
    setError(null)
    const res = await setWeeklyPriorities(latest.id, selected)
    if (!res.ok) {
      setSaving(false)
      setError(res.error ?? "We couldn't save your priorities. Please try again.")
      return
    }
    // Legacy mirrors kept for existing readers of the weekly Reality Check row.
    localStorage.setItem("focusAreas", JSON.stringify(selected))
    void updateRealityCheck({ selectedPriorityAreas: selected })
    await globalMutate(CURRENT_PRIORITY_FOCUS_KEY)
    router.push(DECIDE_DESIGN_HREF)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="mb-3 font-display text-3xl font-bold tracking-tight text-brand-ink text-balance">
            Choose Your Priority Focus Areas&trade;
          </h1>
          {latest && (
            <p className="font-sans text-sm text-gray-600">
              Scores from your Weekly 7-Day Work-Life Balance Audit&trade;, completed{" "}
              {formatAuditDate(latest.report.completedAt ?? "")}.
            </p>
          )}
        </div>

        {isLoading ? (
          <p className="mb-8 text-center font-sans text-sm text-gray-600">Loading your latest results…</p>
        ) : !data?.signedIn ? (
          <Card className="mb-8 border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <p className="mb-6 text-gray-600">Sign in to choose your Priority Focus Areas&trade;.</p>
              <Link href="/login">
                <Button className="bg-[#7FB069] hover:bg-[#5B835F] text-white px-8 py-3">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        ) : !latest ? (
          <Card className="mb-8 border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Take your 7-day audit first</h2>
              <p className="text-gray-600 mb-6">
                Your Priority Focus Areas&trade; are chosen from your latest Weekly 7-Day Work-Life Balance Audit&trade;.
                Complete it on Monday in Decide &amp; Design&trade;, then come back here.
              </p>
              <Link href="/#weekly-reality-check">
                <Button className="bg-[#7FB069] hover:bg-[#5B835F] text-white px-8 py-3">Take My 7-Day Audit&trade;</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div
              className="mb-8 rounded-xl border border-brand-green/30 bg-brand-green/10 p-4 text-center"
              aria-live="polite"
            >
              <p className="font-medium text-brand-green-dark">
                <span className="font-bold">
                  Selected: {selected.length}/{MAX_WEEKLY_PRIORITIES}
                </span>{" "}
                {atLimit
                  ? "— you've reached the limit. Deselect one to choose another."
                  : "— choose one to three areas to nurture this week."}
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8" role="group" aria-label="Priority Focus Areas">
              {areas.map((area) => {
                const isSelected = selected.includes(area.key)
                const disabled = !isSelected && atLimit
                const score = Math.round(area.score)
                return (
                  <Card
                    key={area.key}
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-disabled={disabled}
                    tabIndex={0}
                    onClick={() => toggle(area.key)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault()
                        toggle(area.key)
                      }
                    }}
                    className={`cursor-pointer transition-all border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069] ${
                      isSelected
                        ? "border-[#7FB069] bg-[#7FB069]/5 shadow-md"
                        : disabled
                          ? "border-gray-200 opacity-60"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          {isSelected ? (
                            <CheckCircle2 className="w-6 h-6 shrink-0 text-[#7FB069]" aria-hidden />
                          ) : (
                            <Circle className="w-6 h-6 shrink-0 text-gray-400" aria-hidden />
                          )}
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{area.label}</h3>
                            <p className="text-gray-600">
                              {AREA_DESCRIPTIONS[area.key] ?? "Focus on improvement in this area"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</div>
                          <p className="text-sm text-gray-500">This Week</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${getProgressColor(score)}`} style={{ width: `${score}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}

        {error && (
          <p role="alert" className="mb-4 text-center font-sans text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {latest && (
            <Button
              size="lg"
              onClick={confirm}
              disabled={saving || selected.length < 1}
              className="bg-[#7FB069] hover:bg-[#5B835F] text-white px-8 py-3"
            >
              {saving ? "Saving…" : "Continue to Decide & Design™"}
              <CheckCircle2 className="ml-2 h-5 w-5" aria-hidden />
            </Button>
          )}
          <Link href="/my-results">
            <Button variant="outline" size="lg" className="w-full px-8 py-3 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Back to Audit Results
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
