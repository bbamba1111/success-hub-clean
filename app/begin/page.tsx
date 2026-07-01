import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ClipboardCheck, MessageCircleHeart, Target } from "lucide-react"
import { RitualTimeline } from "@/components/begin/ritual-timeline"

export const metadata: Metadata = {
  title: "Welcome to Your First Work-Life Balance Business Week™ | Make Time For More™",
  description:
    "Every Work-Life Balance Business Week™ begins with one simple ritual — the Weekly Reality Check™. Take 5–7 minutes to understand where you are today.",
}

const JOURNEY_CARDS = [
  {
    icon: ClipboardCheck,
    title: "Weekly Reality Check™",
    body: "Take a 5–7 minute snapshot of your current reality across the areas that matter most. Cherry Blossom will use this to personalize your entire week.",
  },
  {
    icon: MessageCircleHeart,
    title: "Personalized Weekly Review™",
    body: "After your Reality Check is complete, Cherry Blossom immediately reviews your results with you. No copying. No pasting. She already knows your scores and remembers your previous weeks.",
  },
  {
    icon: Target,
    title: "Weekly Operating Declaration™",
    body: "Choose your 1–3 Priority Focus Areas and create one simple Weekly Intention Declaration that Cherry Blossom will coach you around throughout the week.",
  },
]

export default function BeginPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F0]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E26C73] to-[#d65f66] px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex justify-center">
            <img
              src="/images/logo.png"
              alt="Make Time For More logo"
              width={88}
              height={88}
              className="rounded-full border-4 border-white/30 shadow-xl"
            />
          </div>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/80">
            Make Time For More™
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl">
            Welcome to Your First Work-Life Balance Business Week™
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/90">
            Every Work-Life Balance Business Week™ begins with one simple ritual. Before we build your week,
            let&apos;s understand where you are today.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <Link href="/audit">
              <Button
                size="lg"
                className="bg-white px-8 py-6 text-lg font-semibold text-[#E26C73] shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              >
                Begin My Weekly Reality Check™
              </Button>
            </Link>
            <span className="flex items-center gap-2 text-sm text-white/80">
              <Clock className="h-4 w-4" />
              5–7 minutes
            </span>
          </div>
        </div>
      </section>

      {/* Journey cards */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {JOURNEY_CARDS.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="rounded-2xl border-[#E26C73]/15 bg-white shadow-sm">
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7FB069]/15">
                  <Icon className="h-6 w-6 text-[#7FB069]" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-gray-900 text-balance">{title}</h2>
                <p className="text-pretty leading-relaxed text-gray-600">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-[#E26C73]/10 sm:p-10">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 text-balance">
            Your Weekly Ritual, Start to Finish
          </h2>
          <RitualTimeline />
          <div className="mt-10 text-center">
            <Link href="/audit">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] px-8 py-6 text-lg font-semibold text-white shadow-md transition-all hover:from-[#D55A60] hover:to-[#6FA055] hover:shadow-lg"
              >
                Begin My Weekly Reality Check™
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
