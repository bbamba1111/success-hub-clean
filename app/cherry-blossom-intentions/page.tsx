"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Copy,
  Edit,
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
  const [isChatOpen, setIsChatOpen] = useState(false)

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

  return `Hello Cherry Blossom! I just completed my Work-Life Balance Audit and I'm ready to set powerful 28-day intentions for transformation using the GIVEN framework.

${nameText}
Overall Score: ${auditData.overallScore}%

My ${selectedAreas.length} selected focus areas that I want to focus on:
${focusAreasText}

**ABOUT THE INTENTION SETTING PROCESS:**
I will craft my intention with you now, then I'll declare it aloud during the Collective Intention Setting Circle — a spiritual act of asking, witnessed by my mentor and cohort, where I'll plant my intention as a seed into the spiritual realm.

**IMPORTANT INTENTION LANGUAGE GUIDELINES:**
- Eliminate words like "trying," "hoping," "wanting," "to be," and "not"
- Frame everything positively (e.g., instead of "I am not afraid," say "I am courageous")
- Use present tense as if it's already happening
- Speak with clarity, certainty, and faith

**THE GIVEN FRAMEWORK:**
G = Gratitude – the opening frequency
I = Invitation & Intention – the focused direction
V = Vision & Visualization – seeing it clearly with all 5 senses
E = Emotional Embodiment – step into BEING it
N = Nurture – caring for mind, body, emotions and beliefs to sustain the success frequency

I'm ready to begin! Please guide me through each step, then compile everything into ONE short, brief, concise Intention Declaration Statement that I can write down, memorize, and declare in 2 mins or less and bring to the GROUNDING ceremony (Steps 5 & 6 happen live). Make it powerful, clear, and easy to remember!

**STEP-BY-STEP PROCESS:**

${selectedAreas
  .map(
    (area, index) => `**Step ${index + 1}: G (Gratitude) + I (Intention) for ${area.name}**
Craft a combined gratitude and intention declaration specifically for my "${area.name}" focus area. Help me express what I'm grateful for AND my intention in this area. Then have me repeat the declaration aloud.`,
  )
  .join("\n\n")}

**Step ${selectedAreas.length + 1}: V (Visualize) - Envision the Collective Good**
Guide me to visualize and declare how living my Desired Work-Lifestyle creates a ripple effect that uplifts humanity. Craft a powerful visualization declaration starting with: "I see a world where the ripple effect of me living my Desired Work-Lifestyle..." Then have me declare it aloud.

**Step ${selectedAreas.length + 2}: Affirm Divine Alignment**
Guide me to declare this aloud with full presence and certainty:
"I intend that, in order to manifest, all my intentions must be the will of My Creator and serve the Highest Good of the Universe, myself, and everyone concerned."

**IMPORTANT: After completing all the steps above, compile Steps 1 through Step ${selectedAreas.length + 2} into ONE short, brief, concise Intention Declaration Statement that I can write down, memorize, and declare in 2 mins or less that includes:**
- My gratitude for each focus area
- My intentions for each focus area  
- My vision for collective good
- My divine alignment affirmation

**WRITE IT DOWN:**
After you compile my Intention Declaration Statement, please instruct me to write it down in your journal, or on a sheet of paper or on pages 9-10 of the 28-Day Desired Work-Lifestyle Intention Setting Guide (which I can download from the Success Hub). I will bring my written intention to the GROUNDING ceremony to be declared in unison with Thought Leader Barbara and/or other co-hort members.

**GROUNDING CEREMONY OPTIONS - Steps 5 & 6 (Done Live):**
Let me know that Steps 5 & 6 will be done live during the GROUNDING ceremony with one of these options:

**Option 1: Collective Intention Setting Circle**
Join Thought Leader Barbara and cohort members every Tuesday OR Thursday, 7:00 - 8:30 PM ET to ground intentions in unison.

**Option 2: Private 1-on-1 Intention Setting Ceremony**  
Book a private session with Thought Leader Barbara for personalized intention grounding.

**THE GROUNDING CEREMONY PROCESS (Steps 5 & 6):**

**Step 5: Grounding in Agreement**
After declaring my compiled Intention Declaration Statement aloud:
- I Ask: "Are You With Me?"
- Barbara & Cohort Agree: "YES!"

**Step 6: Spiritual Activation**
- I Declare: "So Be It!"
- All Affirm: "And So It Is!"
- All Together DECLARE: "It Is Done! It Is Done! It Is Done!"

This is the sacred GROUNDING step where I plant the spiritual seed into my physical body and auric field.

**E (Emotional Embodiment):** This happens as I step into executing my New 9-to-5 & Nighttime Non-Negotiable SOPs Monday through Thursday. This is where I LIVE my intentions through daily structured routines.

**N (Nurture):** As I execute my SOPs Monday through Thursday, I am nurturing the spiritual seed I've planted. This daily practice waters and tends to my spiritual ASK until it manifests in my physical reality.

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
    setIsChatOpen(true)
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

      {/* SimpleChatModal Component */}
      <SimpleChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context="intention-setting"
        title="Set Your 28-Day Intentions"
      />
    </div>
  )
}






