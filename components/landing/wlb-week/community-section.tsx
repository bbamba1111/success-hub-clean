import { Body, BulletList, CtaLink, Emphasis, Eyebrow, SectionTitle } from "./section-primitives"

const COMMUNITY_GOALS = [
  "Practice work-life balance as part of their working life.",
  "Build more intentional workweek habits.",
  "Notice recurring conflicts between business demands and personal boundaries.",
  "Recognize where the founder has become a bottleneck.",
  "Consider how to redesign work as AI changes what their businesses can accomplish.",
  "Make deliberate decisions about how increased capacity can support both business growth and time freedom.",
]

export function CommunitySection() {
  return (
    <section id="community" className="w-full scroll-mt-20 bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-5">
          <Eyebrow>Make It a Practice, Not a One-Time Event</Eyebrow>
          <SectionTitle>The Make Time For More&trade; Work-Life Balance Coworking Community</SectionTitle>
          <Body className="text-lg font-semibold text-[#4A3A42]">A different way of working takes practice.</Body>
          <Body>
            The monthly community gives you an ongoing environment to participate in coworking, practice work-life
            balance, reflect on recurring collisions, and make more deliberate choices about how you work.
          </Body>
          <Body>
            Rather than waiting for your business to become less demanding before making room for life, you begin
            practicing now while learning where your operating model needs attention.
          </Body>
          <Body className="text-sm">
            The aim is not to promise a completely self-running business through membership. It is to help you
            practice a different relationship with work while developing greater awareness of the changes your
            business may need.
          </Body>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl bg-white p-7 sm:p-10">
          <p className="font-playfair text-xl font-bold text-[#4A3A42]">
            Designed for founders and entrepreneurs who want to:
          </p>
          <BulletList items={COMMUNITY_GOALS} />
          <Emphasis>You do not have to wait until everything changes to begin changing how you work.</Emphasis>
          <CtaLink href="/community" label="Explore the Monthly Community" variant="secondary" />
        </div>
      </div>
    </section>
  )
}
