import Link from "next/link"
import { ArrowLeft, Download, CheckCircle, Calendar, Bell, Home, Users, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SundayShiftPrepSheetPage() {
  const prepSteps = [
    {
      icon: Home,
      title: "Clear Your Physical Space",
      description: "Create a clean, organized environment that supports focus and calm. Remove clutter from your workspace."
    },
    {
      icon: Calendar,
      title: "Block Off Your Calendar",
      description: "Protect your Sunday Shift time. Mark it as non-negotiable so nothing can interrupt your preparation."
    },
    {
      icon: Users,
      title: "Notify Your Family & Team",
      description: "Let those around you know you'll be unavailable during this time. Set expectations for uninterrupted focus."
    },
    {
      icon: Bell,
      title: "Delegate or Delay Tasks",
      description: "Move non-essential tasks to another time. This moment is for your transformation, not your to-do list."
    },
    {
      icon: Heart,
      title: "Prepare Your Spirit",
      description: "Take a few deep breaths. Release the week that passed. Open yourself to the week ahead with intention."
    }
  ]

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
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Prepare For Your Experience
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Complete these steps to create the optimal environment for your work-life balance transformation journey.
          </p>
        </div>

        {/* Preparation Steps */}
        <div className="space-y-4 mb-12">
          {prepSteps.map((step, index) => (
            <Card key={index} className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-[#7FB069] bg-[#7FB069]/10 px-2 py-1 rounded">
                        Step {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-gray-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Download CTA */}
        <Card className="border-0 bg-gradient-to-r from-[#7FB069] to-[#E26C73] shadow-xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Download Your Preparation Checklist
            </h3>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Get the complete printable checklist to prepare your space, mind, and schedule 
              for a transformative Sunday Shift experience.
            </p>
            <a
              href="https://docs.google.com/document/d/1IZ5qefGnMQpYJP8wMgQS3tVY6sj56CHcCpRBkOGpGjU/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-white text-[#7FB069] hover:bg-gray-50 font-semibold px-8 py-4 text-lg">
                <Download className="mr-2 h-5 w-5" />
                Open The Preparation Checklist
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Return to Sunday Shift */}
        <div className="text-center mt-8">
          <Link href="/sunday-shift">
            <Button variant="outline" className="border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069]/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Sunday Shift
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
