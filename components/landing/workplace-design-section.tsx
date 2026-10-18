const STAGES = [
  {
    title: "For founders starting out",
    body: "Establish your principles early. Decide what healthy availability, reasonable workload, focused work, recovery, and human oversight should mean as your business develops.",
  },
  {
    title: "For founders leading established businesses",
    body: "Examine the expectations and operating practices already in place. Identify where growth or AI-enabled work could intensify demands, and decide what needs to change to protect human boundaries.",
  },
]

export function WorkplaceDesignSection() {
  return (
    <section id="workplace" className="w-full scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <h2 className="font-playfair max-w-3xl text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
          You&apos;re Not Just Building a Business. You&apos;re Designing a Workplace.
        </h2>

        <div className="font-poppins mt-8 flex max-w-3xl flex-col gap-4 text-pretty text-lg leading-relaxed text-[#5A4A52]">
          <p>
            Whether you are preparing to hire your first team member or already leading a growing organization, the way
            you design work today can shape the working conditions people experience tomorrow.
          </p>
          <p>
            In the agentic AI age, founders need to consider more than how quickly a business can operate. They also need
            to decide how workloads, responsibilities, availability, communication, human judgment, and AI authority
            should work together.
          </p>
          <p className="font-playfair text-xl font-semibold leading-snug text-[#4A3A42]">
            Will AI-created capacity become more work for everyone&mdash;or will you deliberately use some of that
            capacity to create healthier working conditions and more room for human life?
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {STAGES.map((stage) => (
            <div key={stage.title} className="flex flex-col gap-3 rounded-2xl bg-[#FDF6F3] p-6 sm:p-8">
              <h3 className="font-playfair text-xl font-bold text-[#4A3A42] sm:text-2xl">{stage.title}</h3>
              <p className="font-poppins text-base leading-relaxed text-[#5A4A52]">{stage.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-6">
          <p className="font-playfair max-w-3xl text-pretty text-xl font-semibold leading-snug text-[#5A7F46] sm:text-2xl">
            Human sustainability should not be an afterthought added after growth. It can be a design principle from the
            beginning&mdash;and a principle you revisit as the business evolves.
          </p>
          <a
            href="#business-week"
            className="font-poppins inline-flex items-center justify-center rounded-full bg-[#C13B6B] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#C13B6B]/20 transition-transform hover:scale-[1.03] hover:bg-[#a8325c]"
          >
            Experience the Work-Life Balance Business Week&trade;
          </a>
        </div>
      </div>
    </section>
  )
}
