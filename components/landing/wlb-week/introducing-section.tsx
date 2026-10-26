import { Body, Emphasis, Eyebrow, SectionTitle } from "./section-primitives"

export function IntroducingSection() {
  return (
    <section id="business-week" className="w-full scroll-mt-20 bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 text-center sm:px-8">
        <Eyebrow>Introducing a Different Way to Experience the Workweek</Eyebrow>
        <SectionTitle className="sm:text-5xl">The Work-Life Balance Business Week&trade;</SectionTitle>
        <Body className="text-lg">
          Make Time For More&trade; introduces a redesigned entry into the workweek&mdash;one where you begin
          practicing work-life balance from Day 1.
        </Body>
        <Body>
          This is not about waiting until your business is fully built, your revenue reaches a certain milestone, or
          every operational problem is solved before you make room for life.
        </Body>
        <Body>
          It is about beginning to experience a different way of working while discovering what your business needs to
          support that way of life.
        </Body>
        <Body>
          You will begin noticing where business demands collide with personal boundaries, where you are carrying more
          than you need to, and where your business may depend too heavily on you.
        </Body>
        <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-[#F2E4E8] bg-white p-7 sm:p-9">
          <Body>The objective is not to solve every problem in one week.</Body>
          <Emphasis>
            It is to experience the possibility of a different workweek&mdash;and begin identifying what needs to
            change to make it sustainable.
          </Emphasis>
        </div>
      </div>
    </section>
  )
}
