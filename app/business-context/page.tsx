import { BusinessContextProfile } from "@/components/business-context/business-context-profile"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"

export const metadata = {
  title: "Business Context Profile™ | Harmony Lane™",
  description:
    "Tell me about the business you are building so every recommendation Harmony Lane™ makes is personalized to your actual context.",
}

export default function BusinessContextPage() {
  return (
    <div className="min-h-screen bg-brand-cream">

      {/* ── Scene: Executive garden — introduces the business layer ───── */}
      <CherryBlossomScene variant="executive" minHeight="min-h-[70vh]">
        <CherryBlossomSceneCard
          title="Business Context Profile™"
          time="Approx. 10 mins"
          scrollPrompt="Build My Business Context Profile™"
        >
          <p>
            Beautiful. Now I want to understand the business you are building so{" "}
            <strong>every recommendation I make reflects your actual context</strong>.
          </p>
          <p>
            This is not an assessment — there are no scores. I am simply learning about your
            business so Harmony Lane™ can guide you with precision rather than guessing.
          </p>
          <p className="text-brand-ink-soft">
            Everything you share here stays on your device and is used only to personalize your
            experience.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── Business Context Profile™ wizard — flows below the scene ─── */}
      <div className="bg-white">
        <BusinessContextProfile />
      </div>

    </div>
  )
}
