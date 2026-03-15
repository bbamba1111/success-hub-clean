"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  RotateCcw,
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
} from "lucide-react"
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

const categoryIcons: Record<string, any> = {
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

export default function MyResultsPage() {
  const [auditData, setAuditData] = useState<AuditData | null>(null)

  useEffect(() => {
    const data = getAuditResults()
    setAuditData(data)
  }, [])

  if (!auditData) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Results Found</h1>
            <p className="text-gray-600 mb-8">Please take the audit first to see your results.</p>
            <Link href="/audit">
              <Button className="bg-[#7FB069] hover:bg-[#6FA055] text-white">Take Audit</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const sortedResults = [...auditData.results].sort((a, b) => b.percentage - a.percentage)
  const recommendations = [...auditData.results]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)
    .map((result) => ({
      ...result,
      name: categoryLabels[result.category],
      icon: categoryIcons[result.category],
    }))

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent balance"
    if (score >= 70) return "Good balance"
    if (score >= 60) return "Fair balance"
    return "Needs attention"
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/audit">
            <Button className="bg-[#7FB069] hover:bg-[#6FA055] text-white flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake The Audit
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Work-Life Balance Results</h1>
          <p className="text-gray-600">Completed on {new Date(auditData.timestamp).toLocaleDateString()}</p>
        </div>

        {/* Overall Score */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gray-900 mb-2">Overall Score: {auditData.overallScore}%</div>
          <p className="text-lg text-gray-600 mb-2">{getScoreMessage(auditData.overallScore)}</p>
        </div>

        {/* Category Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Breakdown</h2>
          <div className="space-y-4">
            {sortedResults.map((result) => {
              const IconComponent = categoryIcons[result.category]
              const categoryName = categoryLabels[result.category]

              return (
                <div key={result.category} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{categoryName}</span>
                      <span className="font-bold text-gray-900">{result.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-[#E26C73] to-[#7FB069]"
                        style={{ width: `${result.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top 3 Recommendations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 3 Focus Areas</h2>
          <div className="space-y-6">
            {recommendations.map((rec) => {
              const IconComponent = rec.icon
              return (
                <Card key={rec.category} className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-[#7FB069]">
                      <IconComponent className="w-6 h-6" />
                      Focus on Your {rec.name}
                    </CardTitle>
                    <p className="text-[#E26C73]">Current score: {rec.percentage}%</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      This is one of your lowest scoring areas. Consider setting an intention to improve in this area over the next 28 days.
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8 bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Set Your Intentions?</h3>
          <p className="text-gray-600 mb-6">Choose 1-3 focus areas and create your 28-day transformation plan.</p>
          <Link href="/focus-areas">
            <Button size="lg" className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-8 py-3">
              Choose Your Focus Areas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
