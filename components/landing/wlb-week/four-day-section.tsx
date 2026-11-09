import { getPlanByLevel } from "@/lib/payments/config"
import { OfferCta } from "../offer-cta"
import { Body, Emphasis, Eyebrow, SectionTitle } from "./section-primitives"

const PATTERN_QUESTIONS = [
  "Where does work repeatedly spill into personal time?",
  "Which responsibilities continue to pull you back in?",
  "What expectations or operating habits make it difficult to disconnect?",
  "What would need to change for your business to function without your constant involvement?",
]

const CHECK_IN_STEPS = [
  { label: "Notice", body: "Where did work collide with a personal boundary?" },
  {
    label: "Identify",
    body: "What boundary was challenged, or what operating condition contributed to the collision?",
  },
  { label: "Consider", body: "What is one change worth exploring?" },
]

export function FourDaySection() {
  const week = getPlanByLevel("business-week")

  return (
    <section id="four-day" className="w-full scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 sm:px-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <Eyebrow>Ready to Extend the Experience?</Eyebrow>
          <SectionTitle>The Four-Day Work-Life Balance Business Week&trade;</SectionTitle>
          <Body className="text-lg font-semibold text-[#4A3A42]">
            Monday introduces the experience. The four-day week gives you more room to practice.
          </Body>
          <Body>
            Continue across the Monday&ndash;Thursday workweek with a structured coworking environment designed to help
            you practice work-life balance while you build your business.
          </Body>
          <Body>As you participate, you can begin to recognize patterns that a single day may not reveal.</Body>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {PATTERN_QUESTIONS.map((q) => (
            <li
              key={q}
              className="font-playfair text-pretty rounded-2xl border border-[#F2E4E8] bg-[#FDF6F3] p-6 text-lg font-semibold leading-snug text-[#4A3A42]"
            >
              {q}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-8 rounded-3xl border-2 border-[#8AA06A] p-7 sm:p-10">
          <div className="flex flex-col gap-3">
            <h3 className="font-playfair text-balance text-2xl font-bold text-[#4A3A42] sm:text-3xl">
              The Five-Minute Work-Life Boundary Check-In&trade;
            </h3>
            <Body>At the end of each coworking segment, take five minutes to reflect:</Body>
          </div>

          <ol className="grid gap-6 md:grid-cols-3">
            {CHECK_IN_STEPS.map((step, i) => (
              <li key={step.label} className="flex flex-col gap-2">
                <span className="font-poppins text-xs font-semibold uppercase tracking-[0.2em] text-[#5A7F46]">
                  Step {i + 1}
                </span>
                <span className="font-playfair text-xl font-bold text-[#C13B6B]">{step.label}</span>
                <Body>{step.body}</Body>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-2 border-t border-[#F2E4E8] pt-6">
            <Body>
              No complicated boundary-building workflow. No expectation that you solve every operational problem
              immediately.
            </Body>
            <Body>
              Just a simple practice of noticing what is happening and beginning to understand what needs to change.
            </Body>
          </div>

          <Emphasis>Practice work-life balance while you discover what your workweek is telling you.</Emphasis>
          <OfferCta href={week?.checkoutUrl} label="Explore the Four-Day Experience" variant="secondary" />
        </div>
      </div>
    </section>
  )
}
