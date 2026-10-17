import Image from "next/image"

const OUTCOMES = [
  "Reconnect with your original entrepreneurial intention.",
  "Assess current work-life balance and recognize the freedom gap.",
  "Personalize the human boundaries you want to protect.",
  "Bring actual business priorities into a defined workday.",
  "Recognize the demands, expectations, and habits that may interfere with those boundaries.",
]

export function WhyHarmonyLaneSection() {
  return (
    <section id="why-harmony-lane" className="relative w-full scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <Image
        src="/images/panoramic-zen-stones.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-7 shadow-sm backdrop-blur-md sm:p-12">
          <p className="font-poppins text-sm font-semibold tracking-[0.14em] text-[#C13B6B]">Harmony Lane&trade;</p>
          <h2 className="font-playfair mt-4 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Your Destination for Human Sustainability&trade;
          </h2>
          <p className="font-playfair mt-4 text-pretty text-lg font-semibold text-[#5A7F46] sm:text-xl">
            Reconnect with your intention. Personalize your boundaries. Experience another way.
          </p>

          <div className="font-poppins mt-8 flex flex-col gap-4 text-pretty text-base leading-relaxed text-[#5A4A52] sm:text-lg">
            <p>
              Harmony Lane&trade; is where founders begin closing the gap between the freedom they intended to create
              and the way they currently live, work, and lead.
            </p>
            <p>This is not simply about becoming more productive.</p>
            <p>
              It is about deciding what your business is supposed to make possible for you&mdash;and experiencing a
              workweek designed with that life in mind.
            </p>
          </div>

          <ul className="mt-8 flex flex-col gap-3 border-t border-[#F2E4E8] pt-6">
            {OUTCOMES.map((item) => (
              <li key={item} className="font-poppins flex items-start gap-3 text-base leading-relaxed text-[#4A3A42]">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#8AA06A]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <p className="font-playfair mt-10 text-pretty text-xl font-bold leading-snug text-[#4A3A42]">
            You don&apos;t have to solve every business problem before you experience a different way to work and live.
          </p>
          <p className="font-poppins mt-3 text-base font-semibold text-[#C13B6B]">
            Start with Monday. Experience the Week. Discover what needs to change.
          </p>
        </div>
      </div>
    </section>
  )
}
