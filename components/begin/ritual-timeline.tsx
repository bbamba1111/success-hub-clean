import { Check } from "lucide-react"

const STEPS = [
  "Weekly Reality Check™",
  "Cherry Blossom Review™",
  "Choose 1–3 Priority Focus Areas",
  "Weekly Intention Declaration™",
  "Prepare Operating Environment™",
  "Enter the Success Hub™",
  "Begin Your Work-Life Balance Business Day™",
]

export function RitualTimeline() {
  return (
    <ol className="relative mx-auto max-w-md">
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1
        return (
          <li key={step} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                  isLast
                    ? "border-[#7FB069] bg-[#7FB069] text-white"
                    : "border-[#E26C73]/40 bg-white text-[#E26C73]"
                }`}
              >
                {isLast ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              {!isLast && <span className="mt-1 w-px flex-1 bg-[#E26C73]/20" />}
            </div>
            <div className="pt-1.5">
              <p className="font-medium leading-snug text-gray-800 text-pretty">{step}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
