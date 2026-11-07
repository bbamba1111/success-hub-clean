import { getPlanByLevel } from "@/lib/payments/config"
import { OfferCta } from "../offer-cta"
import { Body, BulletList, Emphasis, Eyebrow, SectionTitle } from "./section-primitives"

const MONDAY_OPPORTUNITIES = [
  "Begin the workweek with greater intention.",
  "Participate in structured coworking.",
  "Practice working within a more deliberate approach to time and boundaries.",
  "Use a simple five-minute check-in to notice collisions between work demands and personal boundaries.",
  "Identify questions about your workweek that deserve further attention.",
]

export function MondayExperienceSection() {
  const monday = getPlanByLevel("business-day")

  return (
    <section id="monday" className="w-full scroll-mt-20 bg-[#3F5A35] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#D9E4C8]">
            Your First Experience: Monday
          </p>
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FDF6F3] sm:text-4xl">
            Live Work-Life Balance. Don&apos;t Just Learn About It.
          </h2>
          <p className="font-poppins text-pretty text-base leading-relaxed text-[#F2EBE4]">
            Monday is your opportunity to experience the redesigned workweek in real time.
          </p>
          <p className="font-poppins text-pretty text-base leading-relaxed text-[#F2EBE4]">
            Inside the Make Time For More&trade; Work-Life Balance Coworking Community, you begin practicing a different
            approach to how you work, while making space to notice what your current operating habits reveal.
          </p>
          <p className="font-poppins text-pretty text-base leading-relaxed text-[#F2EBE4]">
            The purpose is to experience the difference between simply trying to manage more work and deliberately
            creating a more sustainable way to work.
          </p>
          <p className="font-poppins text-pretty text-sm leading-relaxed text-[#D9E4C8]">
            One day is the beginning&mdash;not a promise that your business will be transformed overnight.
          </p>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl bg-[#FDF6F3] p-7 sm:p-10">
          <Eyebrow>You will have an opportunity to</Eyebrow>
          <BulletList items={MONDAY_OPPORTUNITIES} />
          <Emphasis>Start with Monday. Experience the possibility. Decide what comes next.</Emphasis>
          {monday?.priceLabel ? (
            <Body className="font-semibold text-[#4A3A42]">Monday experience &mdash; {monday.priceLabel}</Body>
          ) : null}
          <OfferCta href={monday?.checkoutUrl} label="Experience Monday" />
        </div>
      </div>
    </section>
  )
}
