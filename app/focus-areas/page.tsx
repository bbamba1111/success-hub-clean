"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAuditResults } from "@/utils/audit-storage"
import { categoryLabels } from "@/components/work-life-balance-audit"

interface FocusArea {
  id: string
  name: string
  description: string
  score: number
  selected: boolean
}

export default function FocusAreasPage() {
  const [selectedCount, setSelectedCount] = useState(0)
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([])

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0)

    // Load audit results and filter for scores below 80%
    const auditData = getAuditResults()
    if (auditData) {
      const lowScoringAreas = auditData.results
        .filter((result) => result.percentage < 80)
        .map((result) => ({
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
            return area // Don't select if already at limit
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
    if (score >= 60) return "text-yellow-600"
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Select Your Priority Areas For Your 28-Day Transformation
          </h1>
          <p className="text-gray-600 mb-6">
            Choose 1-3 areas from your lowest scoring areas (below 80%) to focus on improving over the next 28-30 days.
            These will become your personalized intention setting areas for maximum transformation impact.
          </p>

          {/* Selection Counter */}
          <div className="bg-[#7FB069]/10 border border-[#7FB069] rounded-lg p-4 mb-8">
            <p className="text-[#7FB069] font-medium">
              <span className="text-[#7FB069] font-bold">Selected: {selectedCount}/3</span> - You can select up to 3
              focus areas for your 28-day intention setting cycle.
            </p>
          </div>
        </div>

        {/* Focus Areas Grid */}
        <div className="space-y-4 mb-8">
          {focusAreas.length === 0 ? (
            <Card className="border-2 border-gray-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellent Work!</h3>
                <p className="text-gray-600 mb-6">
                  All your life areas scored 80% or above. You have a strong foundation in work-life balance! Consider
                  reviewing your results or exploring our wellness tracking tools to maintain your success.
                </p>
                <Link href="/my-results">
                  <Button className="bg-[#7FB069] hover:bg-[#E26C73] text-white px-8 py-3">View Your Results</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            focusAreas.map((area) => (
              <Card
                key={area.id}
                className={`cursor-pointer transition-all border-2 ${
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {selectedCount > 0 && (
            <Link href="/cherry-blossom-intentions" onClick={saveFocusAreas}>
              <Button size="lg" className="bg-[#7FB069] hover:bg-[#E26C73] text-white px-8 py-3">
                Continue to Intention Setting
                <CheckCircle2 className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link href="/my-results">
            <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scores
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
