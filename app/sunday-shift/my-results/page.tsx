"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
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

const categoryIcons: Record<string, React.ElementType> = {
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

export default function SundayShiftResultsPage() {
  const [auditData, setAuditData] = useState<AuditData | null>(null)

  useEffect(() => {
    const data = getAuditResults()
    if (data) {
      setAuditData(data)
    }
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#7FB069]"
    if (score >= 60) return "text-amber-500"
    if (score >= 40) return "text-orange-500"
    return "text-[#E26C73]"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-[#7FB069]"
    if (score >= 60) return "bg-amber-500"
    if (score >= 40) return "bg-orange-500"
    return "bg-[#E26C73]"
  }

  if (!auditData) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <Link
              href="/sunday-shift"
              className="inline-flex items-center gap-2 text-[#7FB069] hover:text-[#E26C73] transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sunday Shift
            </Link>
          </div>
          <Card className="border-0 bg-white shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
            <p className="text-gray-600 mb-6">
              You have not taken the Work-Life Balance Audit yet. Complete the audit first to see your results.
            </p>
            <Link href="/sunday-shift/audit">
              <Button className="bg-[#7FB069] hover:bg-[#E26C73] text-white">
                Take The Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/sunday-shift"
            className="inline-flex items-center gap-2 text-[#7FB069] hover:text-[#E26C73] transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sunday Shift
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Work-Life Balance Results</h1>
          <p className="text-gray-600">Review your scores and identify areas for improvement</p>
        </div>

        {/* Overall Score Card */}
        <Card className="border-0 bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 shadow-lg mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Overall Balance Score</h2>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(auditData.overallScore)}`}>
              {auditData.overallScore}%
            </div>
            <p className="text-gray-600 max-w-xl mx-auto">
              {auditData.overallScore >= 80
                ? "Excellent work-life balance! Keep maintaining these healthy habits."
                : auditData.overallScore >= 60
                  ? "Good foundation! There are opportunities to strengthen your balance."
                  : "Great awareness! Let's focus on improving your key areas."}
            </p>
          </CardContent>
        </Card>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {auditData.results
            .sort((a, b) => a.percentage - b.percentage)
            .map((result) => {
              const IconComponent = categoryIcons[result.category] || Heart
              return (
                <Card key={result.category} className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getProgressColor(result.percentage)} bg-opacity-20`}>
                        <IconComponent className={`w-5 h-5 ${getScoreColor(result.percentage)}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{result.label}</h3>
                      </div>
                      <div className={`text-xl font-bold ${getScoreColor(result.percentage)}`}>
                        {result.percentage}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(result.percentage)}`}
                        style={{ width: `${result.percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sunday-shift/intention-setter">
            <Button size="lg" className="bg-[#7FB069] hover:bg-[#E26C73] text-white px-8">
              Set Your Intentions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/sunday-shift/audit">
            <Button variant="outline" size="lg" className="border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069]/10">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake Audit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
