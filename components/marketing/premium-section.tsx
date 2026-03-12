export function PremiumSection() {
  return (
    <section className="py-28 bg-gradient-to-br from-white via-[#F0F7F4]/30 to-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="font-poppins text-lg font-semibold tracking-widest text-[#E26C73] uppercase mb-6">
          By Invitation
        </p>
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2F4F4F] mb-10 text-balance leading-tight">
          Exclusive by Design. Intimate by Intention. Transformational by Rhythm.
        </h2>

        <div className="space-y-8 font-poppins text-xl text-[#4A5568] leading-relaxed max-w-3xl mx-auto">
          <p>
            This is a premium boutique-style experience designed to protect the intimacy, support, and structure required for real transformation.
          </p>

          <div className="py-8 space-y-4">
            <p className="text-[#6B7280] text-xl">It is not a high-volume membership.</p>
            <p className="text-[#6B7280] text-xl">It is not open coworking.</p>
            <p className="text-[#7FB069] font-semibold text-2xl">
              It is a curated installation environment.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-14 flex justify-center gap-5">
          <div className="w-3 h-3 rounded-full bg-[#F8C8C8]" />
          <div className="w-3 h-3 rounded-full bg-[#E26C73]" />
          <div className="w-3 h-3 rounded-full bg-[#7FB069]" />
        </div>
      </div>
    </section>
  )
}
