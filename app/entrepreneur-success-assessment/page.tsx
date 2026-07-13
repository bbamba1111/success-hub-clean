import EntrepreneurSuccessAssessment from "@/components/entrepreneur-success/entrepreneur-success-assessment"
import { CherryBlossomScene } from "@/components/cherry-blossom/cherry-blossom-scene"
import { Clock } from "lucide-react"

export const metadata = {
  title: "Entrepreneur Success Assessment™ | Harmony Lane™",
  description:
    "Establish your operating baseline across the Eight Operating Pillars™. No right or wrong answers — we are simply establishing your starting point.",
}

export default function EntrepreneurSuccessAssessmentPage() {
  return (
    <div className="min-h-screen bg-brand-cream">

      {/* ── Scene 3: Japanese Executive Study / Shoji Screens ────────── */}
      <CherryBlossomScene variant="executive" minHeight="min-h-[70vh]">
        <div className="glass-panel mx-auto w-full max-w-lg rounded-3xl px-7 py-11 text-center sm:px-10 sm:py-14">

          {/* CB avatar */}
          <div className="mb-5 flex justify-center">
            <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-white/70 shadow-lg">
              <img
                src="/images/logo.png"
                alt="Cherry Blossom"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.22em] text-brand-coral">
            Cherry Blossom™
          </p>

          <h1 className="mt-3 font-playfair text-balance text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
            Entrepreneur Success Assessment™
          </h1>

          <div className="mt-6 space-y-3 text-left">
            <p className="font-montserrat text-[14px] leading-relaxed text-brand-ink text-pretty">
              During the past 30 days you&apos;ve developed habits, routines, and business practices &mdash; some
              intentionally, others by default.
            </p>
            <p className="font-montserrat text-[14px] leading-relaxed text-brand-ink text-pretty">
              This assessment helps me understand how you&apos;ve been operating your business so I can
              personalize Harmony Lane&trade; specifically for you.
            </p>
            <p className="font-montserrat text-[14px] leading-relaxed text-brand-ink-soft text-pretty">
              There are no right or wrong answers. We are simply establishing your starting point.
            </p>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 text-sm text-brand-ink-soft">
            <Clock className="h-4 w-4 text-brand-coral" aria-hidden />
            <span className="font-montserrat font-medium">Approx. 10 mins</span>
          </div>

        </div>
      </CherryBlossomScene>

      {/* ── ESA form — flows below the scene ─────────────────────────── */}
      <div className="bg-white">
        <EntrepreneurSuccessAssessment />
      </div>

    </div>
  )
}
