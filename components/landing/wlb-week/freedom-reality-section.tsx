import { Body, BulletList, Emphasis, SectionTitle } from "./section-primitives"

const HUSTLE_PATTERNS = [
  "Work expands into personal time.",
  "The founder becomes the bottleneck.",
  "Business decisions depend on the founder's constant availability.",
  "Time saved is automatically filled with more work.",
  "Work-life balance becomes something to pursue later.",
]

export function FreedomRealitySection() {
  return (
    <section id="freedom" className="w-full scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-5">
          <SectionTitle>You Built Your Business for Freedom. Are You Experiencing It?</SectionTitle>
          <Body>
            You wanted more control over your time. More flexibility. More room to pursue the things that matter beyond
            business.
          </Body>
          <Body>But as your business grew, so did the demands on you.</Body>
          <Body>
            You became the person who makes the decisions, solves the problems, answers the questions, and keeps
            everything moving.
          </Body>
          <Body className="font-semibold text-[#4A3A42]">
            Your business may be growing, but how much of that growth depends on you?
          </Body>
          <Body>
            And if AI gives you more capacity, will you use it to expand your freedom&mdash;or fill your calendar with
            even more work?
          </Body>
          <div className="mt-2 flex flex-col gap-2 border-t border-[#F2E4E8] pt-6">
            <Body>You do not necessarily have a time-management problem.</Body>
            <Emphasis>You may have a workweek and an operating model that need to be redesigned.</Emphasis>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl bg-[#FDF6F3] p-7 sm:p-10">
          <SectionTitle className="sm:text-3xl">The Hustle Habit Can Become the Business Operating System</SectionTitle>
          <Body>
            Many entrepreneurs leave demanding corporate environments only to recreate the patterns they wanted to
            leave behind.
          </Body>
          <BulletList items={HUSTLE_PATTERNS} />
          <Body>Now AI can accelerate how work gets done.</Body>
          <Body>But faster work does not automatically create more freedom.</Body>
          <Emphasis>Before you automate your hustle, redesign how your business operates.</Emphasis>
        </div>
      </div>
    </section>
  )
}
