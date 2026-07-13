import EntrepreneurSuccessAssessment from "@/components/entrepreneur-success/entrepreneur-success-assessment"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"

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
        <CherryBlossomSceneCard
          title="Entrepreneur Success Assessment™"
          time="Approx. 10 mins"
        >
          <p>
            During the past 30 days you&apos;ve developed habits, routines, and business practices —{" "}
            <em>some intentionally, others by default</em>.
          </p>
          <p>
            This assessment helps me understand how you&apos;ve been operating your business so I can{" "}
            <strong>personalize Harmony Lane™ specifically for you</strong>.
          </p>
          <p className="text-brand-ink-soft">
            There are no right or wrong answers. We are simply establishing your starting point.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── ESA form — flows below the scene ─────────────────────────── */}
      <div className="bg-white">
        <EntrepreneurSuccessAssessment />
      </div>

    </div>
  )
}
