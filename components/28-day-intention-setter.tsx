"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target, Sparkles, CheckCircle } from "lucide-react"

interface Intention {
  id: string
  title: string
  description: string
  category: string
  targetDate: Date
  completed: boolean
}

export default function TwentyEightDayIntentionSetter() {
  const [intentions, setIntentions] = useState<Intention[]>([])
  const [newIntention, setNewIntention] = useState({
    title: "",
    description: "",
    category: "personal",
  })
  const [showForm, setShowForm] = useState(false)

  const categories = [
    { value: "personal", label: "Personal Growth", color: "bg-purple-100 text-purple-800" },
    { value: "health", label: "Health & Wellness", color: "bg-green-100 text-green-800" },
    { value: "career", label: "Career & Professional", color: "bg-blue-100 text-blue-800" },
    { value: "relationships", label: "Relationships", color: "bg-pink-100 text-pink-800" },
    { value: "spiritual", label: "Spiritual", color: "bg-yellow-100 text-yellow-800" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newIntention.title.trim()) {
      const intention: Intention = {
        id: Date.now().toString(),
        title: newIntention.title,
        description: newIntention.description,
        category: newIntention.category,
        targetDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
        completed: false,
      }
      setIntentions([...intentions, intention])
      setNewIntention({ title: "", description: "", category: "personal" })
      setShowForm(false)
    }
  }

  const toggleCompletion = (id: string) => {
    setIntentions(
      intentions.map((intention) =>
        intention.id === id ? { ...intention, completed: !intention.completed } : intention,
      ),
    )
  }

  const getCategoryStyle = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat?.color || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">28-Day Intention Setter</CardTitle>
          <p className="text-gray-600">Set meaningful intentions and track your progress over the next 28 days</p>
        </CardHeader>
        <CardContent className="text-center">
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Set New Intention
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <Input
                placeholder="What do you intend to achieve?"
                value={newIntention.title}
                onChange={(e) => setNewIntention({ ...newIntention, title: e.target.value })}
                required
              />
              <Textarea
                placeholder="Describe your intention in detail..."
                value={newIntention.description}
                onChange={(e) => setNewIntention({ ...newIntention, description: e.target.value })}
                rows={3}
              />
              <select
                value={newIntention.category}
                onChange={(e) => setNewIntention({ ...newIntention, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-[#7FB069] hover:bg-[#6FA055] text-white">
                  Set Intention
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {intentions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#7FB069]" />
              Your 28-Day Intentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {intentions.map((intention) => (
                <div
                  key={intention.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    intention.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200 hover:border-[#7FB069]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3
                          className={`font-semibold ${intention.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                        >
                          {intention.title}
                        </h3>
                        <Badge className={getCategoryStyle(intention.category)}>
                          {categories.find((c) => c.value === intention.category)?.label}
                        </Badge>
                      </div>
                      {intention.description && (
                        <p className={`text-sm mb-2 ${intention.completed ? "text-gray-400" : "text-gray-600"}`}>
                          {intention.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Target: {intention.targetDate.toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      onClick={() => toggleCompletion(intention.id)}
                      variant={intention.completed ? "default" : "outline"}
                      size="sm"
                      className={intention.completed ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {intentions.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Target className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No intentions set yet</h3>
            <p className="text-gray-600 mb-4">
              Start your 28-day transformation journey by setting your first intention
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Set Your First Intention
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
