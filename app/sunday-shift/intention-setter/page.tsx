"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, Download } from "lucide-react"
import Link from "next/link"
import { getAuditResults } from "@/utils/audit-storage"

interface FocusArea {
  id: string
  name: string
  description: string
  score: number
  selected: boolean
}

const categoryLabels: Record<string, string> = {
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

export default function SundayShiftIntentionSetterPage() {
  const [selectedCount, setSelectedCount] = useState(0)
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([])
  const [hasAuditResults, setHasAuditResults] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    const auditData = getAuditResults()
    if (auditData) {
      setHasAuditResults(true)
      const lowScoringAreas = auditData.results
        .filter((result: { percentage: number }) => result.percentage < 80)
        .map((result: { category: string; percentage: number }) => ({
          id: result.category,
          name: categoryLabels[result.category] || result.category,
          description: getAreaDescription(result.category),
          score: Math.round(result.percentage),
          selected: false,
        }))
      setFocusAreas(lowScoringAreas)
    }
  }, [])

  const getAreaDescription = (categoryId: string): string => {
    const descriptions: Record<string, string> = {
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
    return descriptions[categoryId] || "Focus on improvement in this area"
  }

  const handleAreaToggle = (areaId: string) => {
    setFocusAreas((prev) =>
      prev.map((area) => {
        if (area.id === areaId) {
          const newSelected = !area.selected
          if (newSelected && selectedCount >= 3) {
            return area
          }
          return { ...area, selected: newSelected }
        }
        return area
      }),
    )
  }

  useEffect(() => {
    const count = focusAreas.filter((area) => area.selected).length
    setSelectedCount(count)
  }, [focusAreas])

  const getScoreColor = (score: number) => {
    if (score >= 60) return "text-amber-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 60) return "bg-gradient-to-r from-[#E26C73] to-[#7FB069]"
    if (score >= 40) return "bg-[#E26C73]"
    return "bg-red-500"
  }

  const saveFocusAreas = () => {
    const selectedAreas = focusAreas.filter((area) => area.selected).map((area) => area.id)
    localStorage.setItem("focusAreas", JSON.stringify(selectedAreas))
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Links */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Link
            href="/sunday-shift"
            className="inline-flex items-center gap-2 text-[#7FB069] hover:text-[#E26C73] transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sunday Shift
          </Link>
          <Link
            href="/sunday-shift/my-results"
            className="inline-flex items-center gap-2 text-[#E26C73] hover:text-[#7FB069] transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Audit Scores
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Set Your Desired Work-LifeStyle Intention
          </h1>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Choose 1-3 focus areas from your lowest scoring areas to prioritize over the next 7-28 days. 
            These will become your personalized intention setting areas for maximum transformation impact.
          </p>
        </div>

        {/* Need to take audit first */}
        {!hasAuditResults && (
          <Card className="border-2 border-[#E26C73]/30 bg-white shadow-lg mb-8">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Take the Audit First</h3>
              <p className="text-gray-600 mb-6">
                Before setting your intentions, complete the Work-Life Balance Audit to identify your focus areas.
              </p>
              <Link href="/sunday-shift/audit">
                <Button size="lg" className="bg-[#7FB069] hover:bg-[#E26C73] text-white px-8 py-3">
                  Take The Audit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Selection Counter */}
        {hasAuditResults && focusAreas.length > 0 && (
          <div className="bg-[#7FB069]/10 border border-[#7FB069] rounded-lg p-4 mb-8">
            <p className="text-[#7FB069] font-medium text-center">
              <span className="font-bold">Selected: {selectedCount}/3</span> — You can select up to 3 focus areas for your intention setting.
            </p>
          </div>
        )}

        {/* Focus Areas Grid */}
        {hasAuditResults && (
          <div className="space-y-4 mb-8">
            {focusAreas.length === 0 ? (
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellent Work!</h3>
                  <p className="text-gray-600 mb-6">
                    All your life areas scored 80% or above. You have a strong foundation in work-life balance!
                  </p>
                  <Link href="/sunday-shift">
                    <Button className="bg-[#7FB069] hover:bg-[#E26C73] text-white px-8 py-3">
                      Return to Sunday Shift
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              focusAreas.map((area) => (
                <Card
                  key={area.id}
                  className={`cursor-pointer transition-all border-2 bg-white ${
                    area.selected
                      ? "border-[#7FB069] bg-[#7FB069]/5 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onClick={() => handleAreaToggle(area.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          {area.selected ? (
                            <CheckCircle2 className="w-6 h-6 text-[#7FB069]" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{area.name}</h3>
                          <p className="text-gray-600">{area.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(area.score)}`}>{area.score}%</div>
                        <p className="text-sm text-gray-500">Current Score</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className={`text-sm font-medium ${getScoreColor(area.score)}`}>{area.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(area.score)}`}
                          style={{ width: `${area.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Action Buttons */}
        {hasAuditResults && focusAreas.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {selectedCount > 0 && (
              <Link href="/cherry-blossom-intentions" onClick={saveFocusAreas}>
                <Button size="lg" className="bg-[#7FB069] hover:bg-[#E26C73] text-white px-8 py-3">
                  Continue to Intention Setting
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Intention Setting Guide */}
        <Card className="border-0 bg-gradient-to-br from-[#E26C73]/10 to-[#7FB069]/10 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help Setting Intentions?</h3>
            <p className="text-gray-600 mb-6">
              Download our comprehensive Intention Setting Guide for step-by-step guidance on crafting powerful, 
              actionable intentions for your transformation journey.
            </p>
            <a
              href="https://docs.google.com/document/d/1RtaoYOUQmmPSD2U5EaLPiilQifnSamE5Yo6SaOYf4UM/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#E26C73] hover:bg-[#7FB069] text-white px-8 py-3">
                <Download className="mr-2 h-4 w-4" />
                Open The Intention Setting Guide
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
