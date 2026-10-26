const CAPACITY_QUESTIONS = [
  "Will every hour saved become another hour of work?",
  "Will the founder simply take on more responsibility because more is now possible?",
  "Or will some of that capacity be used to reduce unnecessary founder dependency, redesign the workweek, and protect time for life beyond the business?",
]

export function AiCapacitySection() {
  return (
    <section id="why-now" className="w-full scroll-mt-20 bg-[#4A3A42] py-20 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 sm:px-8">
        <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#D9E4C8]">
          The Question Every Founder Needs to Ask Before Adopting AI
        </p>
        <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#FDF6F3] sm:text-5xl">
          If AI Frees Up Your Time, What Will You Do With It?
        </h2>
        <p className="font-poppins text-pretty text-base leading-relaxed text-[#F2EBE4]">
          AI can help businesses accomplish more. But what happens to the capacity it creates is a decision we must
          make.
        </p>

        <ul className="flex flex-col gap-4 border-l-2 border-[#C13B6B] pl-6">
          {CAPACITY_QUESTIONS.map((q) => (
            <li key={q} className="font-playfair text-pretty text-lg font-semibold leading-snug text-[#FDF6F3]">
              {q}
            </li>
          ))}
        </ul>

        <p className="font-poppins text-pretty text-base leading-relaxed text-[#F2EBE4]">
          These are operating decisions&mdash;not automatic benefits of technology.
        </p>
        <p className="font-poppins text-pretty text-base leading-relaxed text-[#F2EBE4]">
          Before you accelerate your business with AI, consider what would have to be true for your business to support
          the way you want to live, work, lead, and operate.
        </p>
        <p className="font-poppins text-pretty text-base leading-relaxed text-[#F2EBE4]">
          That is the conversation behind Make Time For More&trade;.
        </p>
        <p className="font-playfair text-pretty text-2xl font-semibold text-[#F4A7BE]">
          Redesign the workweek before you accelerate it.
        </p>
      </div>
    </section>
  )
}
