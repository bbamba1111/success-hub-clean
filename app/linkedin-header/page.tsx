import type { Metadata } from "next"
import { LinkedInHeader } from "@/components/linkedin/linkedin-header"

export const metadata: Metadata = {
  title: "LinkedIn Header Preview — Thought Leader Barbara",
  description:
    "Preview the responsive LinkedIn profile banner built from the Harmony Lane™ Work-Life Balance Business Day™ panoramic imagery.",
}

export default function LinkedInHeaderPreviewPage() {
  return (
    <main className="min-h-screen bg-[#FDF6F3] px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#7FB069]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            LinkedIn Header Preview
          </span>
          <h1 className="font-playfair mt-5 text-pretty text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
            Barbara&apos;s LinkedIn banner, from the Business Day&trade;
          </h1>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
            The same panoramic Work-Life Balance Business Day&trade; imagery from the landing page,
            recomposed for LinkedIn&apos;s 1584&nbsp;&times;&nbsp;396 banner. Review the crop below,
            then download or screenshot at full width to publish.
          </p>
        </header>

        {/* Full-bleed banner exactly as it renders on a profile */}
        <section className="mt-12">
          <h2 className="font-poppins mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8A7A82]">
            Banner (4:1 &mdash; 1584 &times; 396)
          </h2>
          <div className="overflow-hidden rounded-xl shadow-xl ring-1 ring-black/5">
            <LinkedInHeader />
          </div>
        </section>

        {/* Same banner with the profile safe-area guide + a simulated profile card */}
        <section className="mt-14">
          <h2 className="font-poppins mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8A7A82]">
            With LinkedIn overlay &amp; safe area
          </h2>
          <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">
            <div className="relative">
              <LinkedInHeader showSafeArea />
              {/* Simulated profile photo the way LinkedIn overlays it (lower-left) */}
              <div className="absolute -bottom-10 left-6 h-24 w-24 rounded-full border-4 border-white bg-[#EBD9C4] shadow-lg sm:h-28 sm:w-28" />
            </div>
            <div className="px-6 pb-6 pt-14">
              <p className="font-playfair text-2xl font-bold text-[#4A3A42]">Barbara Bamba</p>
              <p className="font-poppins mt-1 text-sm text-[#6B5860]">
                Human Sustainability&trade; in the AI Age &middot; Founder, Harmony Lane&trade;
              </p>
            </div>
          </div>
        </section>

        {/* Narrow / responsive crop check */}
        <section className="mt-14">
          <h2 className="font-poppins mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8A7A82]">
            Responsive crop (mobile width)
          </h2>
          <div className="mx-auto max-w-sm overflow-hidden rounded-xl shadow-xl ring-1 ring-black/5">
            <LinkedInHeader />
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-[#E7D3DA] bg-white/70 p-6">
          <h2 className="font-playfair text-lg font-bold text-[#C13B6B]">Publishing notes</h2>
          <ul className="font-poppins mt-3 space-y-2 text-sm leading-relaxed text-[#5A4A52]">
            <li>&bull; Upload at 1584 &times; 396 px for the sharpest result on desktop.</li>
            <li>
              &bull; The lower-left region stays clear on purpose &mdash; that&apos;s where LinkedIn
              places your profile photo and name.
            </li>
            <li>
              &bull; The imagery cycles through the Business Day&trade; phases here for review; to
              publish, screenshot the phase you like best at full width.
            </li>
          </ul>
        </section>
      </div>
    </main>
  )
}
