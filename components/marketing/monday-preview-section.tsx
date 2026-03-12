import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import Link from "next/link"

export function MondayPreviewSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#2F4F4F] to-[#1a3535] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest text-[#F8C8C8] uppercase mb-4">
            What Happens Next
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
            After The Sunday Shift™
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Women who resonate with the rhythm are invited into the next step:
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <div 
            className="w-full h-80 rounded-2xl bg-gradient-to-r from-[#7FB069]/30 to-[#E26C73]/30 relative"
            style={{
              backgroundImage: "url('/images/mondays-placeholder.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <p className="text-sm text-[#6B7280] mb-2">Image Placeholder</p>
                <p className="text-[#2F4F4F] font-medium">/images/mondays-placeholder.jpg</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">
              Make Time For More On Mondays<sup className="text-lg">™</sup>
            </h3>
            <p className="text-lg text-white/80 leading-relaxed">
              A boutique Monday-only installation where work is intentionally contained inside a focused rhythm so life can expand.
            </p>

            {/* Highlight */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#7FB069]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-8 h-8 text-[#7FB069]" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#7FB069]">20 Hours</p>
                  <p className="text-white/70">of Time Freedom Every Monday</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-white/80">
              <p>This is not a course.</p>
              <p>Not traditional coworking.</p>
              <p>Not another productivity hack.</p>
              <p className="text-[#E26C73] font-semibold pt-2">
                It is a live guided installation experience.
              </p>
            </div>

            <Link href="/mondays">
              <Button 
                size="lg"
                className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Preview Mondays
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

