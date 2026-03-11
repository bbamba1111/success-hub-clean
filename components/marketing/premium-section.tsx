export function PremiumSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm font-medium tracking-widest text-[#E26C73] uppercase mb-4">
          By Invitation
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2F4F4F] mb-8 text-balance leading-tight">
          Exclusive by Design. Intimate by Intention. Transformational by Rhythm.
        </h2>

        <div className="space-y-6 text-lg text-[#4A5568] leading-relaxed max-w-3xl mx-auto">
          <p>
            This is a premium boutique-style experience designed to protect the intimacy, support, and structure required for real transformation.
          </p>

          <div className="py-6 space-y-3">
            <p className="text-[#6B7280]">It is not a high-volume membership.</p>
            <p className="text-[#6B7280]">It is not open coworking.</p>
            <p className="text-[#7FB069] font-semibold">
              It is a curated installation environment.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#F8C8C8]" />
          <div className="w-2 h-2 rounded-full bg-[#E26C73]" />
          <div className="w-2 h-2 rounded-full bg-[#7FB069]" />
        </div>
      </div>
    </section>
  )
}
